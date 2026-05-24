package main

import (
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// Config holds local node settings persisted to disk
type Config struct {
	NodeID           string `json:"nodeId"`
	UPIID            string `json:"upiId"`
	AllocatedSpaceGB int    `json:"allocatedSpaceGb"`
}

// ReceiptResponse handles text acknowledgments back to our master server
type ReceiptResponse struct {
	Status        string `json:"status"`
	ShardID       string `json:"shardId"`
	NodeID        string `json:"nodeId"`
	HashSignature string `json:"hashSignature"`
	Timestamp     int64  `json:"timestamp"`
}

// TelemetryHeartbeat represents real-time storage statistics sent to the gateway
type TelemetryHeartbeat struct {
	Type            string `json:"type"`
	NodeID          string `json:"nodeId"`
	UsedSpaceBytes  int64  `json:"usedSpaceBytes"`
	TotalSpaceBytes int64  `json:"totalSpaceBytes"`
	FreeSpaceBytes  int64  `json:"freeSpaceBytes"`
	IsFull          bool   `json:"isFull"`
	Timestamp       int64  `json:"timestamp"`
}

const (
	ServerURL = "wss://api.driveshare.in/v1/node/connect"
	// Prefix with a dot to make it completely hidden in the user's OS file manager
	VaultDir   = "./.driveshare_vault"
	ConfigFile = ".driveshare_config.json"
)

// Thread-safe WebSocket writer mutex
var writeMutex sync.Mutex

func safeWriteMessage(conn *websocket.Conn, messageType int, data []byte) error {
	writeMutex.Lock()
	defer writeMutex.Unlock()
	return conn.WriteMessage(messageType, data)
}

// getVaultUsedSpace recursively calculates the size of the vault directory in bytes
func getVaultUsedSpace(dir string) (int64, error) {
	var totalSize int64
	err := filepath.Walk(dir, func(_ string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			totalSize += info.Size()
		}
		return nil
	})
	return totalSize, err
}

// generateUniqueNodeID creates an immutable, unique identifier based on machine hostname
func generateUniqueNodeID() string {
	hostname, err := os.Hostname()
	if err != nil {
		hostname = "device"
	}

	var sanitized strings.Builder
	for _, char := range hostname {
		if (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || (char >= '0' && char <= '9') {
			sanitized.WriteRune(char)
		}
	}

	cleanHost := sanitized.String()
	if len(cleanHost) > 12 {
		cleanHost = cleanHost[:12]
	} else if len(cleanHost) == 0 {
		cleanHost = "node"
	}

	src := rand.NewSource(time.Now().UnixNano())
	r := rand.New(src)
	randomHex := fmt.Sprintf("%06x", r.Intn(16777215))

	return fmt.Sprintf("ds_node_%s_%s", strings.ToLower(cleanHost), randomHex)
}

// loadOrCreateConfig fetches settings from disk or prompts the user on first start
func loadOrCreateConfig(flagUPI string, flagSpace int) Config {
	var cfg Config

	if data, err := os.ReadFile(ConfigFile); err == nil {
		if err := json.Unmarshal(data, &cfg); err == nil {
			log.Printf("Loaded existing configuration. Node ID: %s", cfg.NodeID)
			return cfg
		}
	}

	log.Println("Initializing DriveShare Local Node Configuration Setup...")
	cfg.NodeID = generateUniqueNodeID()

	if flagUPI != "" {
		cfg.UPIID = flagUPI
	} else {
		fmt.Println("-----------------------------------------------------------------")
		fmt.Println("Welcome to DriveShare - Earn Passive UPI Income from Unused Space!")
		fmt.Println("-----------------------------------------------------------------")
		for {
			fmt.Print("Enter your UPI ID to receive automatic payments (e.g., student@okaxis): ")
			var input string
			_, _ = fmt.Scanln(&input)
			input = strings.TrimSpace(input)
			if input != "" && strings.Contains(input, "@") {
				cfg.UPIID = input
				break
			}
			fmt.Println(" Invalid UPI format. Please make sure it contains the '@' symbol.")
		}
	}

	cfg.AllocatedSpaceGB = flagSpace

	configBytes, _ := json.MarshalIndent(cfg, "", "  ")
	// Save with strict 0600 owner-only read/write privileges
	_ = os.WriteFile(ConfigFile, configBytes, 0600)
	log.Printf("Successfully registered node. Saved settings to secure file: %s", ConfigFile)

	return cfg
}

func main() {
	log.Println("Starting DriveShare High-Performance Storage Node Daemon...")
	// Create the vault folder with exclusive 0700 permissions (only owner can read/write/execute)
	_ = os.MkdirAll(VaultDir, 0700)

	flagUPI := flag.String("upi", "", "Your Indian UPI ID for automated rewards settlement")
	flagSpace := flag.Int("space", 50, "Allocated hard drive space in GB")
	flag.Parse()

	cfg := loadOrCreateConfig(*flagUPI, *flagSpace)

	dialer := websocket.Dialer{
		HandshakeTimeout: 10 * time.Second,
	}

	headers := http.Header{}
	headers.Add("x-node-id", cfg.NodeID)
	headers.Add("x-upi-id", cfg.UPIID)
	headers.Add("x-allocated-space-gb", fmt.Sprintf("%d", cfg.AllocatedSpaceGB))

	for {
		log.Printf("Connecting to DriveShare Coordination Matrix at %s...", ServerURL)
		conn, _, err := dialer.Dial(ServerURL, headers)
		if err != nil {
			log.Printf("Satellite connection failed: %v. Retrying in 5 seconds...", err)
			time.Sleep(5 * time.Second)
			continue
		}

		log.Printf("Linked to Sovereign Grid. Active Node: %s | Payouts: %s", cfg.NodeID, cfg.UPIID)

		done := make(chan struct{})

		// Start background telemetry heartbeat reporting
		go func(c *websocket.Conn, stopChan chan struct{}) {
			ticker := time.NewTicker(30 * time.Second)
			defer ticker.Stop()
			for {
				select {
				case <-ticker.C:
					usedBytes, _ := getVaultUsedSpace(VaultDir)
					allocatedBytes := int64(cfg.AllocatedSpaceGB) * 1024 * 1024 * 1024
					isFull := usedBytes >= allocatedBytes

					heartbeat := TelemetryHeartbeat{
						Type:            "HEARTBEAT",
						NodeID:          cfg.NodeID,
						UsedSpaceBytes:  usedBytes,
						TotalSpaceBytes: allocatedBytes,
						FreeSpaceBytes:  allocatedBytes - usedBytes,
						IsFull:          isFull,
						Timestamp:       time.Now().UnixMilli(),
					}
					hBytes, _ := json.Marshal(heartbeat)
					if err := safeWriteMessage(c, websocket.TextMessage, hBytes); err != nil {
						return
					}
					log.Printf("Pulse sent. Space: %.2f/%.2f GB used (Full: %v)",
						float64(usedBytes)/(1024*1024*1024),
						float64(allocatedBytes)/(1024*1024*1024),
						isFull,
					)
				case <-stopChan:
					return
				}
			}
		}(conn, done)

		// Process incoming continuous streams from your central Express gateway
		for {
			messageType, rawData, err := conn.ReadMessage()
			if err != nil {
				log.Printf("Connection pipe broken: %v", err)
				break
			}

			// Handle incoming binary file chunks
			if messageType == websocket.BinaryMessage {
				if len(rawData) < 4 {
					continue
				}

				// Extract metadata out of custom protocol byte layout
				idLength := binary.BigEndian.Uint32(rawData[0:4])
				rawShardID := string(rawData[4 : 4+idLength])
				shardBytes := rawData[4+idLength:]

				// SECURITY SHIELD 1: Strip directory path structures to prevent directory traversal
				safeShardID := filepath.Base(rawShardID)

				// SECURITY SHIELD 2: Restrict shard ID strictly to alphanumeric, dashes, and underscores
				var cleanShardBuilder strings.Builder
				for _, r := range safeShardID {
					if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '-' || r == '_' {
						cleanShardBuilder.WriteRune(r)
					}
				}
				shardID := cleanShardBuilder.String()
				if shardID == "" {
					log.Println(" Malicious/Unsafe Shard ID ignored to protect filesystem.")
					continue
				}

				// Calculate storage sizes before writing
				usedBytes, _ := getVaultUsedSpace(VaultDir)
				allocatedBytes := int64(cfg.AllocatedSpaceGB) * 1024 * 1024 * 1024

				if usedBytes+int64(len(shardBytes)) > allocatedBytes {
					log.Printf(" Storage Limit Hit! Rejecting shard %s (%d bytes). Used: %.2f GB",
						shardID, len(shardBytes), float64(usedBytes)/(1024*1024*1024))

					receipt := ReceiptResponse{
						Status:        "REJECTED_OUT_OF_SPACE",
						ShardID:       shardID,
						NodeID:        cfg.NodeID,
						HashSignature: "",
						Timestamp:     time.Now().UnixMilli(),
					}
					receiptBytes, _ := json.Marshal(receipt)
					_ = safeWriteMessage(conn, websocket.TextMessage, receiptBytes)
					continue
				}

				log.Printf("Incoming data block captured: %s (%d bytes)", shardID, len(shardBytes))

				// SECURITY SHIELD 3: Save shard binary file with highly restrictive owner-only permissions (0600)
				targetPath := filepath.Join(VaultDir, shardID+".bin")
				err = os.WriteFile(targetPath, shardBytes, 0600)
				if err != nil {
					log.Printf("Failed to write chunk to disk: %v", err)
					continue
				}

				// Generate mathematical checksum verification signature
				hasher := sha256.New()
				hasher.Write(shardBytes)
				hashString := hex.EncodeToString(hasher.Sum(nil))

				// Construct JSON text confirmation receipt
				receipt := ReceiptResponse{
					Status:        "SUCCESS_STORED",
					ShardID:       shardID,
					NodeID:        cfg.NodeID,
					HashSignature: hashString,
					Timestamp:     time.Now().UnixMilli(),
				}

				receiptBytes, _ := json.Marshal(receipt)
				_ = safeWriteMessage(conn, websocket.TextMessage, receiptBytes)
				log.Printf("Chunk storage verified and reported to central registry ledger.")
			}
		}
		close(done)
		conn.Close()
		time.Sleep(5 * time.Second)
	}
}

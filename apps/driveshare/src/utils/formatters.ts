export function formatBytes(bytes: number | string): string {
  const numBytes = typeof bytes === 'string' ? parseFloat(bytes) : bytes;
  if (isNaN(numBytes) || numBytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  
  return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function generateTerraformConfig(bucketName: string, accessKey: string, secretKey: string): string {
  return `# Terraform provider mapping for sovereign DriveShare S3 API
provider "aws" {
  alias                       = "driveshare"
  region                      = "ap-south-1" # Locked to Bharat Grid
  access_key                  = "${accessKey}"
  secret_key                  = "${secretKey}"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_region_validation      = true
  
  endpoints {
    s3 = "https://s3.gateway.driveshare.in"
  }
}

resource "aws_s3_bucket" "cctv_storage" {
  provider = aws.driveshare
  bucket   = "${bucketName}"
  
  tags = {
    Environment = "Production"
    Compliance  = "DPDP-Act-India"
    Fabric      = "Decentralized-P2P"
  }
}`;
}

export function generateRcloneConfig(bucketName: string, accessKey: string, secretKey: string): string {
  return `[driveshare-cctv]
type = s3
provider = Other
env_auth = false
access_key_id = ${accessKey}
secret_access_key = ${secretKey}
endpoint = https://s3.gateway.driveshare.in
region = ap-south-1
acl = private
storage_class = STANDARD

# Run automated night sync script (12 AM - 6 AM Indian Standard Time):
# rclone sync /mnt/cctv/recordings driveshare-cctv:${bucketName}/sync-archive \\
#   --transfers=16 --checkers=32 --bwlimit 50M --progress`;
}

export function generateAwsCliConfig(bucketName: string, accessKey: string, secretKey: string): string {
  return `# Step 1: Configure AWS profile credentials
aws configure set aws_access_key_id "${accessKey}" --profile driveshare
aws configure set aws_secret_access_key "${secretKey}" --profile driveshare
aws configure set region "ap-south-1" --profile driveshare

# Step 2: Upload recordings direct to Sovereign Indian Nodes
aws s3 cp ./cctv_reel_025.mp4 s3://${bucketName}/ \\
  --endpoint-url=https://s3.gateway.driveshare.in \\
  --profile driveshare`;
}

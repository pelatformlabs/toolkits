import { loadS3Config } from "./config";
import { S3Service } from "./services/s3";
import type { S3Config, S3ProviderType } from "./types";

// === SERVICE CLASSES ===
export { S3Service } from "./services/s3";

export const S3_PROVIDER = process.env.PELATFORM_S3_PROVIDER as S3ProviderType;

// === MAIN FACTORY FUNCTIONS (Primary API) ===
/**
 * Create S3 service using environment variables or manual configuration
 * @param config Optional S3 configuration. If not provided, loads from environment variables
 * @returns S3Service instance
 * @throws Error if configuration is invalid or environment variables are missing
 * @public
 *
 * @example
 * ```typescript
 * import { createS3 } from '@pelatform/storage/s3';
 *
 * // Using environment variables
 * // Set: PELATFORM_S3_PROVIDER=aws, PELATFORM_S3_REGION=us-east-1, etc.
 * const s3FromEnv = createS3();
 * await s3FromEnv.uploadFile('test.txt', 'Hello World');
 *
 * // Using manual configuration
 * const s3Manual = createS3({
 *   provider: 'aws',
 *   region: 'us-east-1',
 *   bucket: 'my-bucket',
 *   accessKeyId: 'AKIA...',
 *   secretAccessKey: 'secret...'
 * });
 *
 * // Cloudflare R2
 * const r2 = createS3({
 *   provider: 'cloudflare-r2',
 *   region: 'auto',
 *   bucket: 'my-r2-bucket',
 *   accessKeyId: 'your-r2-key',
 *   secretAccessKey: 'your-r2-secret',
 *   endpoint: 'https://account-id.r2.cloudflarestorage.com'
 * });
 *
 * // MinIO
 * const minio = createS3({
 *   provider: 'minio',
 *   region: 'us-east-1',
 *   bucket: 'my-minio-bucket',
 *   accessKeyId: 'minioadmin',
 *   secretAccessKey: 'minioadmin',
 *   endpoint: 'http://localhost:9000',
 *   forcePathStyle: true
 * });
 * ```
 */
export function createS3(): S3Service;
export function createS3(config: S3Config): S3Service;
export function createS3(config?: S3Config): S3Service {
  if (config) {
    return new S3Service(config);
  }
  const envConfig = loadS3Config();
  return new S3Service(envConfig);
}

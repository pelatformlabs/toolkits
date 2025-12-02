// /**
//  * Factory functions for creating S3 and Cloudinary storage services
//  * Supports both environment-based and manual configuration
//  */

// import { hasStorageConfig, loadCloudinaryConfig, loadS3Config } from './config';
// import { CloudinaryService } from './services/cloudinary';
// import { S3Service } from './services/s3';
// import type { CloudinaryConfig, S3Config } from './types';

// /**
//  * Create S3 service using environment variables or manual configuration
//  * @param config Optional S3 configuration. If not provided, loads from environment variables
//  * @returns S3Service instance
//  * @throws Error if configuration is invalid or environment variables are missing
//  * @public
//  *
//  * @example
//  * ```typescript
//  * import { createS3 } from '@pelatform/storage';
//  *
//  * // Using environment variables
//  * // Set: PELATFORM_S3_PROVIDER=aws, PELATFORM_S3_REGION=us-east-1, etc.
//  * const s3FromEnv = createS3();
//  * await s3FromEnv.uploadFile('test.txt', 'Hello World');
//  *
//  * // Using manual configuration
//  * const s3Manual = createS3({
//  *   provider: 'aws',
//  *   region: 'us-east-1',
//  *   bucket: 'my-bucket',
//  *   accessKeyId: 'AKIA...',
//  *   secretAccessKey: 'secret...'
//  * });
//  *
//  * // Cloudflare R2
//  * const r2 = createS3({
//  *   provider: 'cloudflare-r2',
//  *   region: 'auto',
//  *   bucket: 'my-r2-bucket',
//  *   accessKeyId: 'your-r2-key',
//  *   secretAccessKey: 'your-r2-secret',
//  *   endpoint: 'https://account-id.r2.cloudflarestorage.com'
//  * });
//  *
//  * // MinIO
//  * const minio = createS3({
//  *   provider: 'minio',
//  *   region: 'us-east-1',
//  *   bucket: 'my-minio-bucket',
//  *   accessKeyId: 'minioadmin',
//  *   secretAccessKey: 'minioadmin',
//  *   endpoint: 'http://localhost:9000',
//  *   forcePathStyle: true
//  * });
//  * ```
//  */
// export function createS3(): S3Service;
// export function createS3(config: S3Config): S3Service;
// export function createS3(config?: S3Config): S3Service {
//   if (config) {
//     return new S3Service(config);
//   }
//   const envConfig = loadS3Config();
//   return new S3Service(envConfig);
// }

// /**
//  * Create Cloudinary service using environment variables or manual configuration
//  * @param config Optional Cloudinary configuration. If not provided, loads from environment variables
//  * @returns CloudinaryService instance
//  * @throws Error if configuration is invalid or environment variables are missing
//  * @public
//  *
//  * @example
//  * ```typescript
//  * import { createCloudinary } from '@pelatform/storage';
//  *
//  * // Using environment variables
//  * // Set: PELATFORM_CLOUDINARY_CLOUD_NAME=my-cloud, PELATFORM_CLOUDINARY_API_KEY=123..., etc.
//  * const cloudinaryFromEnv = createCloudinary();
//  * await cloudinaryFromEnv.uploadFile('photo.jpg', imageBuffer);
//  *
//  * // Using manual configuration
//  * const cloudinary = createCloudinary({
//  *   provider: 'cloudinary',
//  *   cloudName: 'my-cloud-name',
//  *   apiKey: '123456789012345',
//  *   apiSecret: 'your-api-secret',
//  *   secure: true,
//  *   folder: 'uploads'
//  * });
//  *
//  * // Upload with transformations
//  * await cloudinary.uploadFile('profile-pic.jpg', imageBuffer);
//  *
//  * // Get optimized URL
//  * const publicUrl = cloudinary.getPublicUrl('profile-pic.jpg');
//  * console.log(publicUrl); // Cloudinary optimized URL
//  * ```
//  */
// export function createCloudinary(): CloudinaryService;
// export function createCloudinary(config: CloudinaryConfig): CloudinaryService;
// export function createCloudinary(config?: CloudinaryConfig): CloudinaryService {
//   if (config) {
//     return new CloudinaryService(config);
//   }
//   const envConfig = loadCloudinaryConfig();
//   return new CloudinaryService(envConfig);
// }

// /**
//  * Check if storage configuration is available in environment variables
//  * @returns True if either S3 or Cloudinary configuration is available
//  * @public
//  *
//  * @example
//  * ```typescript
//  * import { isStorageConfigured, createS3, createCloudinary } from '@pelatform/storage';
//  *
//  * if (isStorageConfigured()) {
//  *   // Choose your preferred provider
//  *   const s3 = createS3();
//  *   // OR
//  *   const cloudinary = createCloudinary();
//  *
//  *   await s3.uploadFile('test.txt', 'Hello World');
//  * } else {
//  *   console.log('Storage not configured. Please set environment variables.');
//  * }
//  *
//  * // Use in conditional initialization
//  * const storage = isStorageConfigured() ? createS3() : null;
//  * if (storage) {
//  *   await storage.uploadFile('file.txt', content);
//  * }
//  * ```
//  */
// export function isStorageConfigured(): boolean {
//   return hasStorageConfig();
// }

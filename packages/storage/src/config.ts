/**
 * Storage configuration from environment variables
 * Provides automatic configuration loading from environment variables
 */

import type { CloudinaryConfig, S3Config, StorageConfig } from "./types";

/**
 * Environment variable names for storage configuration
 * @public
 *
 * @example
 * ```typescript
 * import { ENV_VARS } from '@pelatform/storage';
 *
 * // Check if specific env vars are set
 * console.log(process.env[ENV_VARS.PELATFORM_S3_BUCKET]);
 * console.log(process.env[ENV_VARS.PELATFORM_CLOUDINARY_CLOUD_NAME]);
 * ```
 */
export const ENV_VARS = {
  // S3 Configuration
  PELATFORM_S3_PROVIDER: "PELATFORM_S3_PROVIDER",
  PELATFORM_S3_REGION: "PELATFORM_S3_REGION",
  PELATFORM_S3_BUCKET: "PELATFORM_S3_BUCKET",
  PELATFORM_S3_ACCESS_KEY_ID: "PELATFORM_S3_ACCESS_KEY_ID",
  PELATFORM_S3_SECRET_ACCESS_KEY: "PELATFORM_S3_SECRET_ACCESS_KEY",
  PELATFORM_S3_ENDPOINT: "PELATFORM_S3_ENDPOINT",
  PELATFORM_S3_FORCE_PATH_STYLE: "PELATFORM_S3_FORCE_PATH_STYLE",
  PELATFORM_S3_PUBLIC_URL: "PELATFORM_S3_PUBLIC_URL",

  // Cloudinary Configuration
  PELATFORM_CLOUDINARY_CLOUD_NAME: "PELATFORM_CLOUDINARY_CLOUD_NAME",
  PELATFORM_CLOUDINARY_API_KEY: "PELATFORM_CLOUDINARY_API_KEY",
  PELATFORM_CLOUDINARY_API_SECRET: "PELATFORM_CLOUDINARY_API_SECRET",
  PELATFORM_CLOUDINARY_SECURE: "PELATFORM_CLOUDINARY_SECURE",
  PELATFORM_CLOUDINARY_FOLDER: "PELATFORM_CLOUDINARY_FOLDER",
} as const;

/**
 * Get environment variable value
 * @internal
 */
function getEnvVar(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  return undefined;
}

/**
 * Get required environment variable value
 * @internal
 */
function getRequiredEnvVar(key: string): string {
  const value = getEnvVar(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Get boolean environment variable value
 * @internal
 */
function getBooleanEnvVar(key: string, defaultValue = false): boolean {
  const value = getEnvVar(key);
  if (!value) return defaultValue;
  return value.toLowerCase() === "true" || value === "1";
}

/**
 * Load S3 configuration from environment variables
 * @returns S3 configuration object
 * @throws Error if required environment variables are missing
 * @public
 *
 * @example
 * ```typescript
 * import { loadS3Config } from '@pelatform/storage';
 *
 * // Set environment variables first:
 * // PELATFORM_S3_PROVIDER=aws
 * // PELATFORM_S3_REGION=us-east-1
 * // PELATFORM_S3_BUCKET=my-bucket
 * // PELATFORM_S3_ACCESS_KEY_ID=AKIA...
 * // PELATFORM_S3_SECRET_ACCESS_KEY=secret...
 *
 * try {
 *   const config = loadS3Config();
 *   console.log(config);
 *   // Returns: {
 *   //   provider: 'aws',
 *   //   region: 'us-east-1',
 *   //   bucket: 'my-bucket',
 *   //   accessKeyId: 'AKIA...',
 *   //   secretAccessKey: 'secret...'
 *   // }
 * } catch (error) {
 *   console.error('Missing S3 configuration:', error.message);
 * }
 * ```
 */
export function loadS3Config(): S3Config {
  const provider = getRequiredEnvVar(ENV_VARS.PELATFORM_S3_PROVIDER) as S3Config["provider"];

  // Validate provider
  const validProviders: S3Config["provider"][] = [
    "aws",
    "cloudflare-r2",
    "minio",
    "digitalocean",
    "supabase",
    "custom",
  ];
  if (!validProviders.includes(provider)) {
    throw new Error(
      `Invalid S3 provider: ${provider}. Must be one of: ${validProviders.join(", ")}`,
    );
  }

  return {
    provider,
    region: getRequiredEnvVar(ENV_VARS.PELATFORM_S3_REGION),
    bucket: getRequiredEnvVar(ENV_VARS.PELATFORM_S3_BUCKET),
    accessKeyId: getRequiredEnvVar(ENV_VARS.PELATFORM_S3_ACCESS_KEY_ID),
    secretAccessKey: getRequiredEnvVar(ENV_VARS.PELATFORM_S3_SECRET_ACCESS_KEY),
    endpoint: getEnvVar(ENV_VARS.PELATFORM_S3_ENDPOINT),
    forcePathStyle: getBooleanEnvVar(ENV_VARS.PELATFORM_S3_FORCE_PATH_STYLE),
    publicUrl: getEnvVar(ENV_VARS.PELATFORM_S3_PUBLIC_URL),
  };
}

/**
 * Load Cloudinary configuration from environment variables
 * @returns Cloudinary configuration object
 * @throws Error if required environment variables are missing
 * @public
 *
 * @example
 * ```typescript
 * import { loadCloudinaryConfig } from '@pelatform/storage';
 *
 * // Set environment variables first:
 * // PELATFORM_CLOUDINARY_CLOUD_NAME=my-cloud
 * // PELATFORM_CLOUDINARY_API_KEY=123456789
 * // PELATFORM_CLOUDINARY_API_SECRET=secret...
 * // PELATFORM_CLOUDINARY_SECURE=true (optional)
 * // PELATFORM_CLOUDINARY_FOLDER=uploads (optional)
 *
 * try {
 *   const config = loadCloudinaryConfig();
 *   console.log(config);
 *   // Returns: {
 *   //   provider: 'cloudinary',
 *   //   cloudName: 'my-cloud',
 *   //   apiKey: '123456789',
 *   //   apiSecret: 'secret...',
 *   //   secure: true,
 *   //   folder: 'uploads'
 *   // }
 * } catch (error) {
 *   console.error('Missing Cloudinary configuration:', error.message);
 * }
 * ```
 */
export function loadCloudinaryConfig(): CloudinaryConfig {
  return {
    provider: "cloudinary",
    cloudName: getRequiredEnvVar(ENV_VARS.PELATFORM_CLOUDINARY_CLOUD_NAME),
    apiKey: getRequiredEnvVar(ENV_VARS.PELATFORM_CLOUDINARY_API_KEY),
    apiSecret: getRequiredEnvVar(ENV_VARS.PELATFORM_CLOUDINARY_API_SECRET),
    secure: getBooleanEnvVar(ENV_VARS.PELATFORM_CLOUDINARY_SECURE, true),
    folder: getEnvVar(ENV_VARS.PELATFORM_CLOUDINARY_FOLDER),
  };
}

/**
 * Auto-detect and load storage configuration from environment variables
 * Determines the provider based on available environment variables
 * @returns Storage configuration object (S3 or Cloudinary)
 * @throws Error if no valid configuration is found
 * @public
 *
 * @example
 * ```typescript
 * import { loadStorageConfig } from '@pelatform/storage';
 *
 * // Auto-detection based on available env vars
 * try {
 *   const config = loadStorageConfig();
 *
 *   if (config.provider === 'cloudinary') {
 *     console.log('Using Cloudinary:', config.cloudName);
 *   } else {
 *     console.log('Using S3:', config.provider, config.bucket);
 *   }
 * } catch (error) {
 *   console.error('No storage configuration found:', error.message);
 * }
 *
 * // Explicit provider (set PELATFORM_S3_PROVIDER=cloudinary)
 * // Will load Cloudinary config even if S3 vars are also present
 * ```
 */
export function loadStorageConfig(): StorageConfig {
  const provider = getEnvVar(ENV_VARS.PELATFORM_S3_PROVIDER);

  // If provider is explicitly set, use it
  if (provider) {
    if (provider === "cloudinary") {
      return loadCloudinaryConfig();
    } else {
      return loadS3Config();
    }
  }

  // Auto-detect based on available environment variables
  const hasCloudinaryVars =
    getEnvVar(ENV_VARS.PELATFORM_CLOUDINARY_CLOUD_NAME) &&
    getEnvVar(ENV_VARS.PELATFORM_CLOUDINARY_API_KEY) &&
    getEnvVar(ENV_VARS.PELATFORM_CLOUDINARY_API_SECRET);

  const hasS3Vars =
    getEnvVar(ENV_VARS.PELATFORM_S3_BUCKET) &&
    getEnvVar(ENV_VARS.PELATFORM_S3_ACCESS_KEY_ID) &&
    getEnvVar(ENV_VARS.PELATFORM_S3_SECRET_ACCESS_KEY);

  if (hasCloudinaryVars) {
    return loadCloudinaryConfig();
  } else if (hasS3Vars) {
    // Default to AWS if no provider specified
    const config = loadS3Config();
    if (!config.provider) {
      config.provider = "aws";
    }
    return config;
  }

  throw new Error(
    "No storage configuration found. Please set either:\n" +
      "- S3: PELATFORM_S3_PROVIDER, PELATFORM_S3_REGION, PELATFORM_S3_BUCKET, PELATFORM_S3_ACCESS_KEY_ID, PELATFORM_S3_SECRET_ACCESS_KEY\n" +
      "- Cloudinary: PELATFORM_CLOUDINARY_CLOUD_NAME, PELATFORM_CLOUDINARY_API_KEY, PELATFORM_CLOUDINARY_API_SECRET",
  );
}

/**
 * Check if storage configuration is available in environment variables
 * @returns True if valid storage configuration is found
 * @public
 *
 * @example
 * ```typescript
 * import { hasStorageConfig, loadStorageConfig } from '@pelatform/storage';
 *
 * if (hasStorageConfig()) {
 *   const config = loadStorageConfig();
 *   console.log('Storage configured:', config.provider);
 * } else {
 *   console.log('Please set storage environment variables');
 * }
 *
 * // Use in conditional initialization
 * const storage = hasStorageConfig() ? createStorage() : null;
 * ```
 */
export function hasStorageConfig(): boolean {
  try {
    loadStorageConfig();
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if storage configuration is available in environment variables
 * @returns True if either S3 or Cloudinary configuration is available
 * @public
 *
 * @example
 * ```typescript
 * import { isStorageConfigured, createS3, createCloudinary } from '@pelatform/storage';
 *
 * if (isStorageConfigured()) {
 *   // Choose your preferred provider
 *   const s3 = createS3();
 *   // OR
 *   const cloudinary = createCloudinary();
 *
 *   await s3.uploadFile('test.txt', 'Hello World');
 * } else {
 *   console.log('Storage not configured. Please set environment variables.');
 * }
 *
 * // Use in conditional initialization
 * const storage = isStorageConfigured() ? createS3() : null;
 * if (storage) {
 *   await storage.uploadFile('file.txt', content);
 * }
 * ```
 */
export function isStorageConfigured(): boolean {
  return hasStorageConfig();
}

/**
 * Get storage provider name from environment variables without loading full config
 * @returns Provider name or undefined if not configured
 * @public
 *
 * @example
 * ```typescript
 * import { getStorageProvider } from '@pelatform/storage';
 *
 * const provider = getStorageProvider();
 *
 * switch (provider) {
 *   case 'aws':
 *     console.log('Using AWS S3');
 *     break;
 *   case 'cloudinary':
 *     console.log('Using Cloudinary');
 *     break;
 *   case 'cloudflare-r2':
 *     console.log('Using Cloudflare R2');
 *     break;
 *   default:
 *     console.log('No storage provider configured');
 * }
 *
 * // Quick check without throwing errors
 * if (getStorageProvider()) {
 *   // Storage is configured
 * }
 * ```
 */
export function getStorageProvider(): string | undefined {
  const provider = getEnvVar(ENV_VARS.PELATFORM_S3_PROVIDER);
  if (provider) return provider;

  // Auto-detect
  const hasCloudinaryVars = getEnvVar(ENV_VARS.PELATFORM_CLOUDINARY_CLOUD_NAME);
  const hasS3Vars = getEnvVar(ENV_VARS.PELATFORM_S3_BUCKET);

  if (hasCloudinaryVars) return "cloudinary";
  if (hasS3Vars) return "aws"; // Default S3 provider

  return undefined;
}

/**
 * Validate if all required environment variables are set for S3
 * @returns Validation result with missing variables
 * @public
 *
 * @example
 * ```typescript
 * import { validateS3EnvVars } from '@pelatform/storage';
 *
 * const validation = validateS3EnvVars();
 *
 * if (validation.valid) {
 *   console.log('S3 configuration is complete');
 * } else {
 *   console.log('Missing S3 variables:', validation.missing);
 *   // Returns: ["PELATFORM_S3_REGION", "PELATFORM_S3_BUCKET"]
 * }
 * ```
 */
export function validateS3EnvVars(): { valid: boolean; missing: string[] } {
  const required = [
    ENV_VARS.PELATFORM_S3_PROVIDER,
    ENV_VARS.PELATFORM_S3_REGION,
    ENV_VARS.PELATFORM_S3_BUCKET,
    ENV_VARS.PELATFORM_S3_ACCESS_KEY_ID,
    ENV_VARS.PELATFORM_S3_SECRET_ACCESS_KEY,
  ];

  const missing = required.filter((key) => !getEnvVar(key));

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Validate if all required environment variables are set for Cloudinary
 * @returns Validation result with missing variables
 * @public
 *
 * @example
 * ```typescript
 * import { validateCloudinaryEnvVars } from '@pelatform/storage';
 *
 * const validation = validateCloudinaryEnvVars();
 *
 * if (validation.valid) {
 *   console.log('Cloudinary configuration is complete');
 * } else {
 *   console.log('Missing Cloudinary variables:', validation.missing);
 *   // Returns: ["PELATFORM_CLOUDINARY_API_KEY"]
 * }
 * ```
 */
export function validateCloudinaryEnvVars(): {
  valid: boolean;
  missing: string[];
} {
  const required = [
    ENV_VARS.PELATFORM_CLOUDINARY_CLOUD_NAME,
    ENV_VARS.PELATFORM_CLOUDINARY_API_KEY,
    ENV_VARS.PELATFORM_CLOUDINARY_API_SECRET,
  ];

  const missing = required.filter((key) => !getEnvVar(key));

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Get all available environment variables for debugging
 * @returns Object containing all storage-related env vars
 * @public
 *
 * @example
 * ```typescript
 * import { getStorageEnvVars } from '@pelatform/storage';
 *
 * const envVars = getStorageEnvVars();
 * console.log('Storage environment variables:', envVars);
 * // Returns: {
 * //   PELATFORM_S3_PROVIDER: 'aws',
 * //   PELATFORM_S3_REGION: 'us-east-1',
 * //   PELATFORM_S3_BUCKET: 'my-bucket',
 * //   // ... other set variables (secrets are masked)
 * // }
 * ```
 */
export function getStorageEnvVars(): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};

  Object.values(ENV_VARS).forEach((key) => {
    const value = getEnvVar(key);
    if (value) {
      // Mask sensitive values
      if (key.includes("SECRET") || key.includes("API_SECRET")) {
        result[key] = `${value.substring(0, 4)}***`;
      } else {
        result[key] = value;
      }
    }
  });

  return result;
}

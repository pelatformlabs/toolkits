/**
 * Pelatform Email Package
 * Unified email service supporting multiple providers with React template rendering
 */

// =============================================================================
// FACTORY FUNCTIONS (Main API)
// =============================================================================

/**
 * Factory functions for creating email service instances
 */
export {
  createEmail,
  createNodemailer,
  createResend,
  getConfiguredProvider,
  isEmailConfigured,
} from "./factory.js";

// =============================================================================
// EMAIL SERVICE CLASS
// =============================================================================

/**
 * Core email service class and related functionality
 */
export { EmailService } from "./services.js";

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Configuration loading and validation utilities
 */
export {
  getEmailEnvVars,
  hasEmailConfig,
  loadEmailConfig,
  loadNodemailerConfig,
  loadResendConfig,
  validateEmailEnvVars,
  validateNodemailerEnvVars,
  validateResendEnvVars,
} from "./config.js";

// =============================================================================
// PROVIDERS
// =============================================================================

export { NodemailerProvider } from "./providers/nodemailer.js";
/**
 * Email provider implementations
 */
export { ResendProvider } from "./providers/resend.js";

// =============================================================================
// TYPES
// =============================================================================

/**
 * TypeScript type definitions
 */
export type {
  BulkEmailOptions,
  BulkEmailResult,
  ConfigValidationResult,
  EmailAnalytics,
  EmailAttachment,
  EmailConfig,
  EmailProvider,
  EmailResult,
  EmailTemplateData,
  EmailTemplateOptions,
  EmailValidationResult,
  EmailWebhookEvent,
  EmailWebhookPayload,
  IEmailProvider,
  NodemailerConfig,
  ResendConfig,
  SendEmailOptions,
} from "./types.js";

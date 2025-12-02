/**
 * Email configuration from environment variables
 * Provides automatic configuration loading from environment variables
 */

import type { ConfigValidationResult, EmailConfig, NodemailerConfig, ResendConfig } from "./types";

/**
 * Load Resend configuration from environment variables
 * @returns Resend configuration object or null if required variables are missing
 * @throws Error if required environment variables are missing
 * @public
 *
 * @example
 * ```typescript
 * import { loadResendConfig } from '@pelatform/email';
 *
 * // Set environment variables first:
 * // PELATFORM_EMAIL_RESEND_API_KEY=re_your_api_key
 * // PELATFORM_EMAIL_FROM_NAME=Your App
 * // PELATFORM_EMAIL_FROM_EMAIL=noreply@yourapp.com
 * // PELATFORM_EMAIL_REPLY_TO=support@yourapp.com (optional)
 *
 * try {
 *   const config = loadResendConfig();
 *   if (config) {
 *     console.log('Resend configured for:', config.from.email);
 *     // Returns: {
 *     //   provider: 'resend',
 *     //   apiKey: 're_your_api_key',
 *     //   from: {
 *     //     name: 'Your App',
 *     //     email: 'noreply@yourapp.com'
 *     //   },
 *     //   replyTo: 'support@yourapp.com'
 *     // }
 *   } else {
 *     console.log('Resend configuration missing');
 *   }
 * } catch (error) {
 *   console.error('Missing Resend configuration:', error.message);
 * }
 * ```
 */
export function loadResendConfig(): ResendConfig | null {
  const apiKey = process.env.PELATFORM_EMAIL_RESEND_API_KEY;
  const fromName = process.env.PELATFORM_EMAIL_FROM_NAME;
  const fromEmail = process.env.PELATFORM_EMAIL_FROM_EMAIL;
  const replyTo = process.env.PELATFORM_EMAIL_REPLY_TO;

  if (!apiKey || !fromName || !fromEmail) {
    return null;
  }

  return {
    provider: "resend",
    apiKey,
    from: {
      name: fromName,
      email: fromEmail,
    },
    replyTo,
  };
}

/**
 * Load Nodemailer/SMTP configuration from environment variables
 * @returns Nodemailer configuration object or null if required variables are missing
 * @throws Error if required environment variables are missing
 * @public
 *
 * @example
 * ```typescript
 * import { loadNodemailerConfig } from '@pelatform/email';
 *
 * // Set environment variables first:
 * // PELATFORM_EMAIL_SMTP_HOST=smtp.gmail.com
 * // PELATFORM_EMAIL_SMTP_PORT=587
 * // PELATFORM_EMAIL_SMTP_SECURE=false
 * // PELATFORM_EMAIL_SMTP_USER=your-email@gmail.com
 * // PELATFORM_EMAIL_SMTP_PASS=your-app-password
 * // PELATFORM_EMAIL_FROM_NAME=Your App
 * // PELATFORM_EMAIL_FROM_EMAIL=noreply@yourapp.com
 * // PELATFORM_EMAIL_REPLY_TO=support@yourapp.com (optional)
 *
 * try {
 *   const config = loadNodemailerConfig();
 *   if (config) {
 *     console.log('SMTP configured for:', config.smtp.host);
 *     // Returns: {
 *     //   provider: 'nodemailer',
 *     //   from: {
 *     //     name: 'Your App',
 *     //     email: 'noreply@yourapp.com'
 *     //   },
 *     //   smtp: {
 *     //     host: 'smtp.gmail.com',
 *     //     port: 587,
 *     //     secure: false,
 *     //     auth: {
 *     //       user: 'your-email@gmail.com',
 *     //       pass: 'your-app-password'
 *     //     }
 *     //   }
 *     // }
 *   } else {
 *     console.log('SMTP configuration missing');
 *   }
 * } catch (error) {
 *   console.error('Missing SMTP configuration:', error.message);
 * }
 * ```
 */
export function loadNodemailerConfig(): NodemailerConfig | null {
  const host = process.env.PELATFORM_EMAIL_SMTP_HOST;
  const port = process.env.PELATFORM_EMAIL_SMTP_PORT;
  const secure = process.env.PELATFORM_EMAIL_SMTP_SECURE;
  const user = process.env.PELATFORM_EMAIL_SMTP_USER;
  const pass = process.env.PELATFORM_EMAIL_SMTP_PASS;
  const fromName = process.env.PELATFORM_EMAIL_FROM_NAME;
  const fromEmail = process.env.PELATFORM_EMAIL_FROM_EMAIL;
  const replyTo = process.env.PELATFORM_EMAIL_REPLY_TO;

  if (!host || !port || !user || !pass || !fromName || !fromEmail) {
    return null;
  }

  return {
    provider: "nodemailer",
    from: {
      name: fromName,
      email: fromEmail,
    },
    replyTo,
    smtp: {
      host,
      port: parseInt(port, 10),
      secure: secure === "true",
      auth: {
        user,
        pass,
      },
    },
  };
}

/**
 * Auto-detect and load email configuration from environment variables
 * Determines the provider based on available environment variables
 * @returns Email configuration object (Resend or Nodemailer) or null if none configured
 * @throws Error if no valid configuration is found
 * @public
 *
 * @example
 * ```typescript
 * import { loadEmailConfig } from '@pelatform/email';
 *
 * // Auto-detection based on available env vars
 * try {
 *   const config = loadEmailConfig();
 *   if (config) {
 *     console.log(`Using ${config.provider} provider`);
 *
 *     if (config.provider === 'resend') {
 *       console.log('Resend API key configured');
 *     } else if (config.provider === 'nodemailer') {
 *       console.log('SMTP server:', config.smtp.host);
 *     }
 *
 *     const emailService = new EmailService(config);
 *   }
 * } catch (error) {
 *   console.error('No email configuration found:', error.message);
 * }
 *
 * // Provider priority order:
 * // 1. Resend (if PELATFORM_EMAIL_RESEND_API_KEY is set)
 * // 2. Nodemailer/SMTP (if SMTP settings are configured)
 * ```
 */
export function loadEmailConfig(): EmailConfig | null {
  // Try providers in order of preference
  return loadResendConfig() || loadNodemailerConfig();
}

/**
 * Check if email configuration exists in environment variables
 * @returns True if any email provider is configured, false otherwise
 * @public
 *
 * @example
 * ```typescript
 * import { hasEmailConfig, createEmail } from '@pelatform/email';
 *
 * if (hasEmailConfig()) {
 *   console.log('Email service is configured');
 *   const email = createEmail(); // Will work
 *   await email.sendEmail({
 *     to: 'user@example.com',
 *     subject: 'Test',
 *     html: '<h1>Test Email</h1>'
 *   });
 * } else {
 *   console.log('Please configure email service');
 *   // Show setup instructions
 * }
 *
 * // Use in conditional initialization
 * const email = hasEmailConfig() ? createEmail() : null;
 * if (email) {
 *   await email.sendEmail(emailOptions);
 * }
 * ```
 */
export function hasEmailConfig(): boolean {
  return loadEmailConfig() !== null;
}

/**
 * Get email environment variables (with secrets masked)
 * @returns Object containing environment variables with secrets masked as '***'
 * @public
 *
 * @example
 * ```typescript
 * import { getEmailEnvVars } from '@pelatform/email';
 *
 * const envVars = getEmailEnvVars();
 * console.log('Email environment variables:', envVars);
 * // Returns: {
 * //   PELATFORM_EMAIL_FROM_NAME: 'Your App',
 * //   PELATFORM_EMAIL_FROM_EMAIL: 'noreply@yourapp.com',
 * //   PELATFORM_EMAIL_RESEND_API_KEY: '***',
 * //   PELATFORM_EMAIL_SMTP_HOST: 'smtp.gmail.com',
 * //   PELATFORM_EMAIL_SMTP_PORT: '587',
 * //   PELATFORM_EMAIL_SMTP_USER: 'your-email@gmail.com',
 * //   PELATFORM_EMAIL_SMTP_PASS: '***'
 * // }
 *
 * // Useful for debugging configuration issues
 * Object.entries(envVars).forEach(([key, value]) => {
 *   if (value) {
 *     console.log(`${key}: ${value}`);
 *   }
 * });
 * ```
 */
export function getEmailEnvVars(): Record<string, string | undefined> {
  const envVars: Record<string, string | undefined> = {};

  // Common variables
  envVars.PELATFORM_EMAIL_FROM_NAME = process.env.PELATFORM_EMAIL_FROM_NAME;
  envVars.PELATFORM_EMAIL_FROM_EMAIL = process.env.PELATFORM_EMAIL_FROM_EMAIL;
  envVars.PELATFORM_EMAIL_REPLY_TO = process.env.PELATFORM_EMAIL_REPLY_TO;

  // Provider-specific variables (mask secrets)
  envVars.PELATFORM_EMAIL_RESEND_API_KEY = process.env.PELATFORM_EMAIL_RESEND_API_KEY
    ? "***"
    : undefined;
  envVars.PELATFORM_EMAIL_SMTP_HOST = process.env.PELATFORM_EMAIL_SMTP_HOST;
  envVars.PELATFORM_EMAIL_SMTP_PORT = process.env.PELATFORM_EMAIL_SMTP_PORT;
  envVars.PELATFORM_EMAIL_SMTP_SECURE = process.env.PELATFORM_EMAIL_SMTP_SECURE;
  envVars.PELATFORM_EMAIL_SMTP_USER = process.env.PELATFORM_EMAIL_SMTP_USER;
  envVars.PELATFORM_EMAIL_SMTP_PASS = process.env.PELATFORM_EMAIL_SMTP_PASS ? "***" : undefined;

  return envVars;
}

/**
 * Validate Resend environment variables
 * @returns Validation result with missing fields and errors
 * @public
 *
 * @example
 * ```typescript
 * import { validateResendEnvVars } from '@pelatform/email';
 *
 * const validation = validateResendEnvVars();
 * if (!validation.valid) {
 *   console.error('Missing Resend variables:', validation.missing);
 *   console.error('Validation errors:', validation.errors);
 *   // Returns: {
 *   //   valid: false,
 *   //   missing: ['PELATFORM_EMAIL_RESEND_API_KEY or RESEND_API_KEY'],
 *   //   errors: []
 *   // }
 * } else {
 *   console.log('Resend configuration is valid');
 * }
 *
 * // Supports both PELATFORM_EMAIL_* and legacy variable names
 * // Required variables:
 * // - PELATFORM_EMAIL_RESEND_API_KEY or RESEND_API_KEY
 * // - PELATFORM_EMAIL_FROM_NAME or EMAIL_FROM_NAME
 * // - PELATFORM_EMAIL_FROM_EMAIL or EMAIL_FROM_EMAIL
 * ```
 */
export function validateResendEnvVars(): ConfigValidationResult {
  const missing: string[] = [];
  const errors: string[] = [];

  if (!process.env.PELATFORM_EMAIL_RESEND_API_KEY && !process.env.RESEND_API_KEY) {
    missing.push("PELATFORM_EMAIL_RESEND_API_KEY or RESEND_API_KEY");
  }
  if (!process.env.PELATFORM_EMAIL_FROM_NAME && !process.env.EMAIL_FROM_NAME) {
    missing.push("PELATFORM_EMAIL_FROM_NAME or EMAIL_FROM_NAME");
  }
  if (!process.env.PELATFORM_EMAIL_FROM_EMAIL && !process.env.EMAIL_FROM_EMAIL) {
    missing.push("PELATFORM_EMAIL_FROM_EMAIL or EMAIL_FROM_EMAIL");
  }

  return {
    valid: missing.length === 0 && errors.length === 0,
    missing,
    errors,
  };
}

/**
 * Validate Nodemailer/SMTP environment variables
 * @returns Validation result with missing fields and errors
 * @public
 *
 * @example
 * ```typescript
 * import { validateNodemailerEnvVars } from '@pelatform/email';
 *
 * const validation = validateNodemailerEnvVars();
 * if (!validation.valid) {
 *   console.error('Missing SMTP variables:', validation.missing);
 *   console.error('SMTP errors:', validation.errors);
 *   // Returns: {
 *   //   valid: false,
 *   //   missing: ['PELATFORM_EMAIL_SMTP_HOST or SMTP_HOST'],
 *   //   errors: ['SMTP_PORT must be a valid port number (1-65535)']
 *   // }
 * } else {
 *   console.log('SMTP configuration is valid');
 * }
 *
 * // Validates SMTP host, port, credentials, and sender information
 * // Also validates port number format and range (1-65535)
 * // Supports both PELATFORM_EMAIL_* and legacy variable names
 * ```
 */
export function validateNodemailerEnvVars(): ConfigValidationResult {
  const missing: string[] = [];
  const errors: string[] = [];

  if (!process.env.PELATFORM_EMAIL_SMTP_HOST && !process.env.SMTP_HOST) {
    missing.push("PELATFORM_EMAIL_SMTP_HOST or SMTP_HOST");
  }
  if (!process.env.PELATFORM_EMAIL_SMTP_PORT && !process.env.SMTP_PORT) {
    missing.push("PELATFORM_EMAIL_SMTP_PORT or SMTP_PORT");
  }
  if (!process.env.PELATFORM_EMAIL_SMTP_USER && !process.env.SMTP_USER) {
    missing.push("PELATFORM_EMAIL_SMTP_USER or SMTP_USER");
  }
  if (!process.env.PELATFORM_EMAIL_SMTP_PASS && !process.env.SMTP_PASS) {
    missing.push("PELATFORM_EMAIL_SMTP_PASS or SMTP_PASS");
  }
  if (!process.env.PELATFORM_EMAIL_FROM_NAME && !process.env.EMAIL_FROM_NAME) {
    missing.push("PELATFORM_EMAIL_FROM_NAME or EMAIL_FROM_NAME");
  }
  if (!process.env.PELATFORM_EMAIL_FROM_EMAIL && !process.env.EMAIL_FROM_EMAIL) {
    missing.push("PELATFORM_EMAIL_FROM_EMAIL or EMAIL_FROM_EMAIL");
  }

  const port = process.env.PELATFORM_EMAIL_SMTP_PORT || process.env.SMTP_PORT;
  if (port && (Number.isNaN(Number(port)) || Number(port) < 1 || Number(port) > 65535)) {
    errors.push("SMTP_PORT must be a valid port number (1-65535)");
  }

  return {
    valid: missing.length === 0 && errors.length === 0,
    missing,
    errors,
  };
}

/**
 * Validate email environment variables for any configured provider
 * @returns Validation result - success if any provider is configured, combined errors otherwise
 * @public
 *
 * @example
 * ```typescript
 * import { validateEmailEnvVars, createEmail } from '@pelatform/email';
 *
 * const validation = validateEmailEnvVars();
 * if (validation.valid) {
 *   console.log('Email service is properly configured');
 *   const email = createEmail();
 *   await email.sendEmail({
 *     to: 'user@example.com',
 *     subject: 'Test',
 *     html: '<h1>Test Email</h1>'
 *   });
 * } else {
 *   console.error('Email configuration issues:');
 *   console.error('Missing variables:', validation.missing);
 *   console.error('Validation errors:', validation.errors);
 * }
 *
 * // Attempts to validate configuration for all supported providers
 * // Returns success if any provider is properly configured
 * // If no provider is valid, returns combined errors from all providers
 * ```
 */
export function validateEmailEnvVars(): ConfigValidationResult {
  // Try each provider validation
  const validations = [validateResendEnvVars(), validateNodemailerEnvVars()];

  // If any provider is valid, return success
  const validProvider = validations.find((v) => v.valid);
  if (validProvider) {
    return validProvider;
  }

  // If no provider is valid, return combined errors
  const allMissing = validations.flatMap((v) => v.missing);
  const allErrors = validations.flatMap((v) => v.errors);

  return {
    valid: false,
    missing: [...new Set(allMissing)], // Remove duplicates
    errors: [...new Set(allErrors)], // Remove duplicates
  };
}

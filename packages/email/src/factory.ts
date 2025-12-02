/**
 * Factory functions for creating email service instances
 * Supports both environment-based and manual configuration
 */

import { hasEmailConfig, loadEmailConfig } from "./config";
import { EmailService } from "./services";
import type { EmailConfig, EmailProvider, NodemailerConfig, ResendConfig } from "./types";

/**
 * Create an email service instance using environment variables or manual configuration
 * @param config Optional email configuration. If not provided, loads from environment variables
 * @returns EmailService instance
 * @throws Error if no configuration is provided and none found in environment
 * @public
 *
 * @example
 * ```typescript
 * import { createEmail } from '@pelatform/email';
 *
 * // Using environment variables
 * // Set: PELATFORM_EMAIL_RESEND_API_KEY=re_your_key, PELATFORM_EMAIL_FROM_NAME=Your App, etc.
 * const email = createEmail();
 * await email.sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   html: '<h1>Hello World</h1>'
 * });
 *
 * // Using manual configuration
 * const email = createEmail({
 *   provider: 'resend',
 *   apiKey: 'your-api-key',
 *   from: {
 *     name: 'Your App',
 *     email: 'noreply@yourapp.com'
 *   }
 * });
 *
 * // SMTP configuration
 * const smtpEmail = createEmail({
 *   provider: 'nodemailer',
 *   from: {
 *     name: 'Your App',
 *     email: 'noreply@yourapp.com'
 *   },
 *   smtp: {
 *     host: 'smtp.gmail.com',
 *     port: 587,
 *     secure: false,
 *     auth: {
 *       user: 'your-email@gmail.com',
 *       pass: 'your-app-password'
 *     }
 *   }
 * });
 * ```
 */
export function createEmail(config?: EmailConfig): EmailService {
  let finalConfig: EmailConfig;

  if (config) {
    finalConfig = config;
  } else {
    const envConfig = loadEmailConfig();
    if (!envConfig) {
      throw new Error(
        "No email configuration provided and none found in environment variables. " +
          "Please provide a config object or set environment variables like PELATFORM_EMAIL_RESEND_API_KEY, etc.",
      );
    }
    finalConfig = envConfig;
  }

  return new EmailService(finalConfig);
}

/**
 * Create Resend service using environment variables or manual configuration
 * @param config Optional Resend configuration. If not provided, loads from environment variables
 * @returns EmailService instance configured for Resend
 * @throws Error if Resend configuration is not found
 * @public
 *
 * @example
 * ```typescript
 * import { createResend } from '@pelatform/email';
 *
 * // Using environment variables
 * // Set: PELATFORM_EMAIL_RESEND_API_KEY=re_your_key, PELATFORM_EMAIL_FROM_NAME=Your App, etc.
 * const email = createResend();
 * await email.sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   html: '<h1>Hello World</h1>'
 * });
 *
 * // Using manual configuration
 * const email = createResend({
 *   provider: 'resend',
 *   apiKey: 'your-resend-api-key',
 *   from: {
 *     name: 'Your App',
 *     email: 'noreply@yourapp.com'
 *   }
 * });
 *
 * // Send with attachments and tags
 * await email.sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Invoice',
 *   html: '<h1>Your Invoice</h1>',
 *   attachments: [{
 *     filename: 'invoice.pdf',
 *     content: pdfBuffer,
 *     contentType: 'application/pdf'
 *   }],
 *   tags: {
 *     category: 'billing',
 *     priority: 'high'
 *   }
 * });
 * ```
 */
export function createResend(
  config?: Omit<ResendConfig, "provider"> & { provider?: "resend" },
): EmailService {
  if (config) {
    return createEmail({ ...config, provider: "resend" });
  }

  // Try to load from environment
  const envConfig = loadEmailConfig();
  if (envConfig?.provider === "resend") {
    return createEmail(envConfig);
  }

  throw new Error(
    "No Resend configuration found. Please provide config or set environment variables: " +
      "PELATFORM_EMAIL_RESEND_API_KEY, PELATFORM_EMAIL_FROM_NAME, PELATFORM_EMAIL_FROM_EMAIL",
  );
}

/**
 * Create Nodemailer service using environment variables or manual configuration
 * @param config Optional Nodemailer configuration. If not provided, loads from environment variables
 * @returns EmailService instance configured for Nodemailer/SMTP
 * @throws Error if Nodemailer configuration is not found
 * @public
 *
 * @example
 * ```typescript
 * import { createNodemailer } from '@pelatform/email';
 *
 * // Using environment variables
 * // Set: PELATFORM_EMAIL_SMTP_HOST=smtp.gmail.com, PELATFORM_EMAIL_SMTP_PORT=587, etc.
 * const email = createNodemailer();
 * await email.sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   html: '<h1>Hello World</h1>'
 * });
 *
 * // Using manual configuration
 * const email = createNodemailer({
 *   provider: 'nodemailer',
 *   from: {
 *     name: 'Your App',
 *     email: 'noreply@yourapp.com'
 *   },
 *   smtp: {
 *     host: 'smtp.gmail.com',
 *     port: 587,
 *     secure: false,
 *     auth: {
 *       user: 'your-email@gmail.com',
 *       pass: 'your-app-password'
 *     }
 *   }
 * });
 *
 * // Send with attachments and custom headers
 * await email.sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Report',
 *   html: '<h1>Monthly Report</h1>',
 *   attachments: [{
 *     filename: 'report.pdf',
 *     content: reportBuffer,
 *     contentType: 'application/pdf'
 *   }],
 *   headers: {
 *     'X-Priority': '1',
 *     'X-Category': 'reports'
 *   }
 * });
 * ```
 */
export function createNodemailer(
  config?: Omit<NodemailerConfig, "provider"> & { provider?: "nodemailer" },
): EmailService {
  if (config) {
    return createEmail({ ...config, provider: "nodemailer" });
  }

  // Try to load from environment
  const envConfig = loadEmailConfig();
  if (envConfig?.provider === "nodemailer") {
    return createEmail(envConfig);
  }

  throw new Error(
    "No Nodemailer configuration found. Please provide config or set environment variables: " +
      "PELATFORM_EMAIL_SMTP_HOST, PELATFORM_EMAIL_SMTP_PORT, PELATFORM_EMAIL_SMTP_USER, PELATFORM_EMAIL_SMTP_PASS, PELATFORM_EMAIL_FROM_NAME, PELATFORM_EMAIL_FROM_EMAIL",
  );
}

/**
 * Check if email service is configured via environment variables
 * @returns True if email configuration is found in environment variables
 * @public
 *
 * @example
 * ```typescript
 * import { isEmailConfigured, createEmail } from '@pelatform/email';
 *
 * if (isEmailConfigured()) {
 *   const email = createEmail();
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
 * const email = isEmailConfigured() ? createEmail() : null;
 * if (email) {
 *   await email.sendEmail(emailOptions);
 * }
 * ```
 */
export function isEmailConfigured(): boolean {
  return hasEmailConfig();
}

/**
 * Get the configured email provider from environment variables
 * @returns The email provider name or null if not configured
 * @public
 *
 * @example
 * ```typescript
 * import { getConfiguredProvider } from '@pelatform/email';
 *
 * const provider = getConfiguredProvider();
 *
 * switch (provider) {
 *   case 'resend':
 *     console.log('Using Resend email service');
 *     break;
 *   case 'nodemailer':
 *     console.log('Using SMTP/Nodemailer service');
 *     break;
 *   default:
 *     console.log('No email provider configured');
 * }
 *
 * // Quick check without throwing errors
 * if (getConfiguredProvider()) {
 *   // Email service is configured
 * }
 * ```
 */
export function getConfiguredProvider(): EmailProvider | null {
  const config = loadEmailConfig();
  return config?.provider || null;
}

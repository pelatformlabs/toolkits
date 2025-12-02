/**
 * Email service implementation
 * Provides unified interface for sending emails across different providers
 */

import React from "react";
import { render } from "@react-email/components";

import { NodemailerProvider } from "./providers/nodemailer.js";
import { ResendProvider } from "./providers/resend.js";
import type {
  EmailConfig,
  EmailResult,
  EmailTemplateData,
  IEmailProvider,
  NodemailerConfig,
  ResendConfig,
  SendEmailOptions,
} from "./types.js";

/**
 * Email service class that provides a unified interface for sending emails across different providers
 * @public
 *
 * @example
 * ```typescript
 * import { EmailService } from '@pelatform/email';
 *
 * // Create email service with Resend
 * const emailService = new EmailService({
 *   provider: 'resend',
 *   apiKey: 'your-api-key',
 *   from: {
 *     name: 'Your App',
 *     email: 'noreply@yourapp.com'
 *   }
 * });
 *
 * // Send simple email
 * const result = await emailService.sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   html: '<h1>Welcome to our app!</h1>'
 * });
 *
 * if (result.success) {
 *   console.log('Email sent with ID:', result.messageId);
 * } else {
 *   console.error('Failed to send email:', result.error);
 * }
 *
 * // Send React template email
 * const templateResult = await emailService.sendTemplate(
 *   WelcomeTemplate,
 *   { userName: 'John', appName: 'MyApp' },
 *   { to: 'user@example.com', subject: 'Welcome!' }
 * );
 * ```
 */
export class EmailService {
  private provider: IEmailProvider;
  private config: EmailConfig;

  /**
   * Create a new EmailService instance
   * @param config Email provider configuration
   * @throws Error if provider is not supported
   */
  constructor(config: EmailConfig) {
    this.config = config;
    this.provider = this.createProvider(config);
  }

  /**
   * Create provider instance based on configuration
   * @param config Email configuration object
   * @returns Email provider instance
   * @throws Error if provider type is not supported
   * @internal
   */
  private createProvider(config: EmailConfig): IEmailProvider {
    switch (config.provider) {
      case "resend":
        return new ResendProvider(config as ResendConfig);
      case "nodemailer":
        return new NodemailerProvider(config as NodemailerConfig);
      default:
        throw new Error(
          `Unsupported email provider: ${(config as EmailConfig).provider}`,
        );
    }
  }

  /**
   * Send email with HTML/text content
   * @param options Email sending options
   * @returns Promise resolving to email sending result
   * @public
   *
   * @example
   * ```typescript
   * const result = await emailService.sendEmail({
   *   to: ['user1@example.com', 'user2@example.com'],
   *   cc: 'manager@example.com',
   *   subject: 'Important Update',
   *   html: '<h1>Hello</h1><p>This is an important update.</p>',
   *   text: 'Hello\n\nThis is an important update.',
   *   attachments: [{
   *     filename: 'document.pdf',
   *     content: pdfBuffer,
   *     contentType: 'application/pdf'
   *   }],
   *   tags: {
   *     category: 'notification',
   *     priority: 'high'
   *   }
   * });
   *
   * if (result.success) {
   *   console.log('Email sent successfully:', result.messageId);
   * } else {
   *   console.error('Failed to send email:', result.error);
   * }
   * ```
   */
  async sendEmail(options: SendEmailOptions): Promise<EmailResult> {
    return this.provider.send(options);
  }

  /**
   * Send email using React template
   * @param Template React component to render as email template
   * @param props Props to pass to the React component
   * @param options Email sending options (excluding html/text which are generated)
   * @returns Promise resolving to email sending result
   * @public
   *
   * @example
   * ```typescript
   * // Define a React email template
   * interface WelcomeEmailProps {
   *   userName: string;
   *   appName: string;
   *   loginUrl: string;
   * }
   *
   * const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ userName, appName, loginUrl }) => (
   *   <div>
   *     <h1>Welcome to {appName}, {userName}!</h1>
   *     <p>Thank you for joining us.</p>
   *     <a href={loginUrl}>Login to your account</a>
   *   </div>
   * );
   *
   * // Send template email
   * const result = await emailService.sendTemplate(
   *   WelcomeEmail,
   *   {
   *     userName: 'John Doe',
   *     appName: 'MyApp',
   *     loginUrl: 'https://myapp.com/login'
   *   },
   *   {
   *     to: 'john@example.com',
   *     subject: 'Welcome to MyApp!',
   *     attachments: [welcomeGuide]
   *   }
   * );
   * ```
   */
  async sendTemplate<T extends EmailTemplateData>(
    Template: React.ComponentType<T>,
    props: T,
    options: Omit<SendEmailOptions, "html" | "text">,
  ): Promise<EmailResult> {
    try {
      // Render React component to HTML
      const html = await render(React.createElement(Template, props));

      // Generate plain text version (basic HTML stripping)
      const text = html
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();

      return this.sendEmail({
        ...options,
        html,
        text,
      });
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to render template",
      };
    }
  }

  /**
   * Get email configuration
   * @returns Copy of the current email configuration
   * @public
   *
   * @example
   * ```typescript
   * const config = emailService.getConfig();
   * console.log('Current provider:', config.provider);
   * console.log('From email:', config.from.email);
   * ```
   */
  getConfig(): EmailConfig {
    return { ...this.config };
  }

  /**
   * Update email configuration
   * @param config New email configuration
   * @throws Error if the new provider is not supported
   * @public
   *
   * @example
   * ```typescript
   * // Switch from Resend to SMTP
   * emailService.updateConfig({
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
  updateConfig(config: EmailConfig): void {
    this.config = config;
    this.provider = this.createProvider(config);
  }

  /**
   * Validate the current email configuration
   * @returns Promise resolving to validation result
   * @public
   *
   * @example
   * ```typescript
   * const validation = await emailService.validateConfig();
   * if (validation.valid) {
   *   console.log('Email configuration is valid');
   * } else {
   *   console.error('Configuration error:', validation.error);
   * }
   * ```
   */
  async validateConfig(): Promise<{ valid: boolean }> {
    if (this.provider.validateConfig) {
      return this.provider.validateConfig();
    }
    return { valid: true };
  }
}

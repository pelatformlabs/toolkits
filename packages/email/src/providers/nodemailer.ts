/**
 * Nodemailer/SMTP email provider implementation
 * Provides SMTP email sending functionality using Nodemailer
 */

import nodemailer from "nodemailer";

import type {
  EmailResult,
  EmailValidationResult,
  IEmailProvider,
  NodemailerConfig,
  SendEmailOptions,
} from "../types";

/**
 * Nodemailer/SMTP email provider implementation
 * @public
 *
 * @example
 * ```typescript
 * import { NodemailerProvider } from '@pelatform/email';
 *
 * const provider = new NodemailerProvider({
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
 * const result = await provider.send({
 *   to: 'user@example.com',
 *   subject: 'Hello',
 *   html: '<h1>Hello World</h1>'
 * });
 *
 * if (result.success) {
 *   console.log('Email sent with ID:', result.messageId);
 * } else {
 *   console.error('Failed to send email:', result.error);
 * }
 * ```
 */
export class NodemailerProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter;
  private config: NodemailerConfig;

  /**
   * Create a new Nodemailer provider instance
   * @param config Nodemailer configuration including SMTP settings
   * @throws Error if SMTP configuration is missing
   */
  constructor(config: NodemailerConfig) {
    this.config = config;

    if (!config.smtp) {
      throw new Error("SMTP configuration is required for Nodemailer");
    }

    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.auth.user,
        pass: config.smtp.auth.pass,
      },
    });
  }

  /**
   * Validate Nodemailer/SMTP configuration
   * @returns Promise resolving to validation result
   * @public
   *
   * @example
   * ```typescript
   * const validation = await provider.validateConfig();
   * if (!validation.valid) {
   *   console.error('SMTP configuration error:', validation.error);
   * } else {
   *   console.log('SMTP connection successful');
   * }
   * ```
   */
  async validateConfig(): Promise<EmailValidationResult> {
    try {
      if (!this.config.smtp) {
        return {
          valid: false,
          error: "SMTP configuration is required",
        };
      }

      if (!this.config.smtp.host || !this.config.smtp.port) {
        return {
          valid: false,
          error: "SMTP host and port are required",
        };
      }

      if (!this.config.smtp.auth.user || !this.config.smtp.auth.pass) {
        return {
          valid: false,
          error: "SMTP authentication credentials are required",
        };
      }

      if (!this.config.from.email || !this.config.from.name) {
        return {
          valid: false,
          error: "From email and name are required",
        };
      }

      // Test SMTP connection
      await this.transporter.verify();

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "SMTP connection failed",
      };
    }
  }

  /**
   * Send an email using SMTP via Nodemailer
   * @param options Email sending options
   * @returns Promise resolving to email sending result
   * @public
   *
   * @example
   * ```typescript
   * const result = await provider.send({
   *   to: ['user1@example.com', 'user2@example.com'],
   *   cc: 'manager@example.com',
   *   bcc: 'archive@example.com',
   *   subject: 'Monthly Report',
   *   html: '<h1>Report</h1><img src="cid:chart" alt="Chart">',
   *   text: 'Please find the monthly report attached.',
   *   attachments: [
   *     {
   *       filename: 'report.pdf',
   *       content: reportBuffer,
   *       contentType: 'application/pdf'
   *     },
   *     {
   *       filename: 'chart.png',
   *       content: chartBuffer,
   *       contentType: 'image/png',
   *       cid: 'chart' // For inline images
   *     }
   *   ],
   *   headers: {
   *     'X-Priority': '1',
   *     'X-Category': 'reports'
   *   }
   * });
   *
   * if (result.success) {
   *   console.log('Email sent with ID:', result.messageId);
   * } else {
   *   console.error('Failed to send email:', result.error);
   * }
   * ```
   */
  async send(options: SendEmailOptions): Promise<EmailResult> {
    try {
      const info = await this.transporter.sendMail({
        from: `${this.config.from.name} <${this.config.from.email}>`,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        cc: options.cc
          ? Array.isArray(options.cc)
            ? options.cc.join(", ")
            : options.cc
          : undefined,
        bcc: options.bcc
          ? Array.isArray(options.bcc)
            ? options.bcc.join(", ")
            : options.bcc
          : undefined,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: this.config.replyTo,
        headers: options.headers,
        attachments: options.attachments?.map((attachment) => ({
          filename: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType,
          cid: attachment.cid,
        })),
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

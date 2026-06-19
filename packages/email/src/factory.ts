import { type EnvRecord, hasEmailConfig, loadEmailConfig } from "./config";
import { EmailService } from "./services";
import type { EmailConfig, EmailProvider, NodemailerConfig, ResendConfig } from "./types";

export type { EnvRecord } from "./config";

export function createEmail(config?: EmailConfig, env?: EnvRecord): EmailService {
  if (config) return new EmailService(config);

  const envConfig = loadEmailConfig(env);
  if (!envConfig) {
    throw new Error(
      "No email configuration provided and none found in environment variables. " +
        "Please provide a config object or set environment variables like PELATFORM_EMAIL_RESEND_API_KEY, etc.",
    );
  }
  return new EmailService(envConfig);
}

export function createResend(
  config?: Omit<ResendConfig, "provider"> & { provider?: "resend" },
  env?: EnvRecord,
): EmailService {
  if (config) return createEmail({ ...config, provider: "resend" });

  const envConfig = loadEmailConfig(env);
  if (envConfig?.provider === "resend") return createEmail(envConfig);

  throw new Error(
    "No Resend configuration found. Please provide config or set environment variables: " +
      "PELATFORM_EMAIL_RESEND_API_KEY, PELATFORM_EMAIL_FROM_NAME, PELATFORM_EMAIL_FROM_EMAIL",
  );
}

export function createNodemailer(
  config?: Omit<NodemailerConfig, "provider"> & { provider?: "nodemailer" },
  env?: EnvRecord,
): EmailService {
  if (config) return createEmail({ ...config, provider: "nodemailer" });

  const envConfig = loadEmailConfig(env);
  if (envConfig?.provider === "nodemailer") return createEmail(envConfig);

  throw new Error(
    "No Nodemailer configuration found. Please provide config or set environment variables: " +
      "PELATFORM_EMAIL_SMTP_HOST, PELATFORM_EMAIL_SMTP_PORT, PELATFORM_EMAIL_SMTP_USER, PELATFORM_EMAIL_SMTP_PASS, PELATFORM_EMAIL_FROM_NAME, PELATFORM_EMAIL_FROM_EMAIL",
  );
}

export function isEmailConfigured(env?: EnvRecord): boolean {
  return hasEmailConfig(env);
}

export function getConfiguredProvider(env?: EnvRecord): EmailProvider | null {
  const config = loadEmailConfig(env);
  return config?.provider || null;
}

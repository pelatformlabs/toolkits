# @pelatform/email

[![Version](https://img.shields.io/npm/v/@pelatform/email.svg)](https://www.npmjs.com/package/@pelatform/email)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A flexible and easy-to-use email package for SaaS applications. This package provides a modular template system, support for multiple email providers (Resend and Nodemailer), and complete integration with React Email components.

## Installation

```bash
npm install @pelatform/email
# or
bun add @pelatform/email
```

## Quick Start

```typescript
import { createEmail } from "@pelatform/email";

// Create email service from environment variables
const email = createEmail();

// Send a simple email
await email.sendEmail({
  to: "user@example.com",
  subject: "Welcome!",
  html: "<h1>Welcome to our platform</h1>",
});

// Send with React template
import { WelcomeEmail } from "./templates/WelcomeEmail";

await email.sendTemplate(
  WelcomeEmail,
  { userName: "John" },
  {
    to: "user@example.com",
    subject: "Welcome to our platform",
  }
);
```

## Key Features

- **Multiple Provider Support**: Resend (default) and Nodemailer/SMTP
- **React Email Templates**: Send emails using React components with automatic HTML rendering
- **Environment Configuration**: Load config from environment variables automatically
- **Flexible API**: Support for attachments, CC/BCC, custom headers, and more
- **Type-Safe**: Full TypeScript support with comprehensive types
- **Auto Text Fallback**: Automatically generates plain text versions from HTML

## Configuration

### Using Environment Variables

```bash
# For Resend
PELATFORM_EMAIL_RESEND_API_KEY=your_resend_api_key
PELATFORM_EMAIL_FROM_NAME=Your App Name
PELATFORM_EMAIL_FROM_EMAIL=noreply@yourdomain.com
PELATFORM_EMAIL_REPLY_TO=support@yourdomain.com

# For Nodemailer (SMTP)
PELATFORM_EMAIL_NODEMAILER_HOST=smtp.gmail.com
PELATFORM_EMAIL_NODEMAILER_PORT=587
PELATFORM_EMAIL_NODEMAILER_SECURE=false
PELATFORM_EMAIL_NODEMAILER_USER=your_email@gmail.com
PELATFORM_EMAIL_NODEMAILER_PASS=your_app_password
PELATFORM_EMAIL_FROM_NAME=Your App Name
PELATFORM_EMAIL_FROM_EMAIL=your_email@gmail.com
```

### Manual Configuration

```typescript
import { createResend, createNodemailer } from "@pelatform/email";

// Resend
const resend = createResend({
  provider: "resend",
  apiKey: "your_api_key",
  from: {
    name: "Your App",
    email: "noreply@yourdomain.com",
  },
});

// Nodemailer
const nodemailer = createNodemailer({
  provider: "nodemailer",
  from: {
    name: "Your App",
    email: "your_email@gmail.com",
  },
  smtp: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "your_email@gmail.com",
      pass: "your_app_password",
    },
  },
});
```

## Basic Usage

### Sending HTML Emails

```typescript
await email.sendEmail({
  to: "user@example.com",
  subject: "Hello!",
  html: "<p>This is an HTML email</p>",
  text: "This is the plain text version", // Optional
});
```

### Sending with React Templates

```typescript
import { EmailTemplate } from "./templates/EmailTemplate";

await email.sendTemplate(
  EmailTemplate,
  { userName: "John", resetLink: "https://..." },
  {
    to: "user@example.com",
    subject: "Password Reset",
  }
);
```

### Advanced Options

```typescript
await email.sendEmail({
  to: ["user1@example.com", "user2@example.com"],
  cc: "manager@example.com",
  bcc: "admin@example.com",
  subject: "Important Update",
  html: "<h1>Update</h1>",
  attachments: [
    {
      filename: "document.pdf",
      content: pdfBuffer,
      contentType: "application/pdf",
    },
  ],
  headers: {
    "X-Custom-Header": "value",
  },
  tags: { category: "notification" },
});
```

## API Reference

### Factory Functions

- `createEmail(config?)` - Create email service from config or environment
- `createResend(config?)` - Create Resend email service
- `createNodemailer(config?)` - Create Nodemailer email service

### EmailService Methods

- `sendEmail(options)` - Send HTML/text email
- `sendTemplate(component, props, options)` - Send React template email
- `getConfig()` - Get current configuration
- `updateConfig(config)` - Update configuration
- `validateConfig()` - Validate current configuration

## Links

- [npm Package](https://www.npmjs.com/package/@pelatform/email)
- [Contributing Guide](../../CONTRIBUTING.md)
- [Code of Conduct](../../CODE_OF_CONDUCT.md)
- [License](../../LICENSE)

## License

MIT © [Pelatform Inc.](../../LICENSE)

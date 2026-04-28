import { expect, vi } from "vitest";

// Global test setup for Email package tests
global.console = {
  ...console,
};

// Set up test environment variables
process.env.NODE_ENV = "test";

// Mock Resend class with proper function constructor
function createMockResend() {
  function MockResend() {
    return {
      emails: {
        send: vi.fn().mockResolvedValue({
          data: { id: "test-email-id" },
          error: null,
        }),
      },
    };
  }
  return MockResend;
}

vi.mock("resend", () => ({
  Resend: createMockResend(),
}));

// Mock Nodemailer with default export
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({
      sendMail: vi.fn().mockResolvedValue({
        messageId: "test-message-id",
        envelope: {
          from: "test@example.com",
          to: ["recipient@example.com"],
        },
      }),
      verify: vi.fn().mockResolvedValue(true),
    }),
  },
  createTransport: vi.fn().mockReturnValue({
    sendMail: vi.fn().mockResolvedValue({
      messageId: "test-message-id",
      envelope: {
        from: "test@example.com",
        to: ["recipient@example.com"],
      },
    }),
    verify: vi.fn().mockResolvedValue(true),
  }),
}));

// Mock React Email render
vi.mock("react-email", () => ({
  render: vi.fn(() => Promise.resolve("<html>mock-rendered-email</html>")),
}));

// Mock React Email components
vi.mock("react-email", () => ({
  render: vi.fn((template) => "<html>mock-rendered-template</html>"),
}));

// Mock Email providers with proper function constructors
function createMockResendProvider() {
  function MockResendProvider(config: any) {
    return {
      send: vi.fn().mockResolvedValue({
        success: true,
        messageId: "resend-test-message-id",
        provider: "resend",
      }),
      validateConfig: vi.fn().mockResolvedValue({ valid: true }),
      getConfig: vi.fn().mockReturnValue({
        provider: "resend",
        apiKey: config?.apiKey || "test-api-key",
        from: config?.from || { name: "Test", email: "test@example.com" },
      }),
    };
  }
  return MockResendProvider;
}

function createMockNodemailerProvider() {
  function MockNodemailerProvider(config: any) {
    return {
      send: vi.fn().mockResolvedValue({
        success: true,
        messageId: "nodemailer-test-message-id",
        provider: "nodemailer",
      }),
      validateConfig: vi.fn().mockResolvedValue({ valid: true }),
      getConfig: vi.fn().mockReturnValue({
        provider: "nodemailer",
        smtp: config?.smtp || { host: "localhost", port: 587 },
        from: config?.from || { name: "Test", email: "test@example.com" },
      }),
    };
  }
  return MockNodemailerProvider;
}

vi.mock("../src/providers/resend", () => ({
  ResendProvider: createMockResendProvider(),
}));

vi.mock("../src/providers/nodemailer", () => ({
  NodemailerProvider: createMockNodemailerProvider(),
}));

// Cleanup after each test to ensure determinism
import { afterEach } from "vitest";
afterEach(() => {
  vi.clearAllMocks();
});

// Global test utilities
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeValidEmail(): T;
    }
  }
}

expect.extend({
  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid email`
          : `expected ${received} to be a valid email`,
      pass,
    };
  },
});

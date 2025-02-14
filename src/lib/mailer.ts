// src/lib/mailer.ts
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { ReactElement } from "react";
import ModernTemplate from "#/components/email/template";

export type EmailConfig = {
  from: string;
  to: string;
  subject: string;
  template: ReactElement;
};

const RETRY_DELAYS = [1000, 3000, 5000]; // Delays in milliseconds between retries

export class Mailer {
  private transporter: nodemailer.Transporter;
  private isInitialized: boolean = false;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      // Add pool configuration
      pool: true,
      maxConnections: 1,
      maxMessages: 10,
      // Add timeout settings
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }

  private async initializeTransporter() {
    if (!this.isInitialized) {
      try {
        await this.transporter.verify();
        this.isInitialized = true;
      } catch (error) {
        console.error("Failed to initialize mailer:", error);
        throw new Error("Failed to initialize mailer");
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async sendMailWithRetry(
    mailOptions: nodemailer.SendMailOptions,
    retryCount: number = 0,
  ): Promise<nodemailer.SentMessageInfo> {
    try {
      await this.initializeTransporter();
      return await this.transporter.sendMail(mailOptions);
    } catch (error: any) {
      const retryDelay = RETRY_DELAYS[retryCount];

      // If we have retries left and it's a retryable error
      if (retryDelay && this.isRetryableError(error)) {
        console.log(
          `Retrying email send after ${retryDelay}ms (attempt ${
            retryCount + 1
          })`,
        );
        await this.delay(retryDelay);

        // Reset transporter on connection issues
        if (error.code === "ECONNECTION" || error.code === "EPROTOCOL") {
          this.isInitialized = false;
        }

        return this.sendMailWithRetry(mailOptions, retryCount + 1);
      }

      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    // List of error codes that are worth retrying
    const retryableCodes = [
      "ECONNECTION",
      "EPROTOCOL",
      "ETIMEDOUT",
      "ECONNRESET",
      "ESOCKET",
      "421",
    ];

    return retryableCodes.some(
      (code) =>
        error.code === code ||
        error.responseCode === parseInt(code) ||
        (error.response && error.response.includes(code)),
    );
  }

  async sendMail(config: Omit<EmailConfig, "template">) {
    const html = await render(
      ModernTemplate({
        username: "Ableez",
        actionUrl: "https://asteriskda.vercel.app",
        previewText: "Ableez is my hero",
      }),
    );

    try {
      const mailOptions = {
        from: config.from,
        to: config.to,
        subject: config.subject,
        html,
      };

      const info = await this.sendMailWithRetry(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("ERROR SENDING MAIL:::::", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        throw new Error(`Email sending failed: ${error.message}`);
      }
      throw new Error("Failed to send email due to an unknown error");
    }
  }

  async verifyConnection() {
    try {
      await this.initializeTransporter();
      return true;
    } catch (error) {
      console.error("Failed to verify email connection:", error);
      return false;
    }
  }
}

export const mailer = new Mailer();

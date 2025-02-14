// src/components/emails/ModernTemplate.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface ModernTemplateProps {
  username: string;
  actionUrl: string;
  previewText?: string;
}

export const ModernTemplate = ({
  username,
  actionUrl,
  previewText = "Welcome to our platform!",
}: ModernTemplateProps) => {
  const main = {
    backgroundColor: "#ffffff",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };

  const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
  };

  const logo = {
    margin: "0 auto",
  };

  const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#484848",
  };

  const button = {
    backgroundColor: "#008aff",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px",
  };

  const footer = {
    color: "#9CA3AF",
    fontSize: "14px",
    marginTop: "32px",
    textAlign: "center" as const,
  };

  const link = {
    color: "#008aff",
    textDecoration: "underline",
  };

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Img
            src="https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2eRPmY6TBJyuGiFdea2YtlVjTNx7vmUkP80JKb"
            width="150"
            height="150"
            alt="Asterisk"
            style={logo}
          />

          {/* Main Content */}
          <Section style={{ marginTop: "32px" }}>
            <Text style={paragraph}>Hi {username},</Text>
            <Text style={paragraph}>
              Welcome to our platform! We're excited to have you on board. Our
              mission is to provide you with the best possible experience.
            </Text>
            <Text style={paragraph}>
              To get started, please verify your account by clicking the button
              below:
            </Text>

            <Button style={button} href={actionUrl}>
              Verify Your Account
            </Button>

            <Text style={paragraph}>
              Here are a few things you can do with your new account:
            </Text>

            {/* Features Grid */}
            <Row style={{ marginTop: "24px" }}>
              <Column style={{ paddingRight: "8px" }}>
                <Text style={{ ...paragraph, margin: "0" }}>
                  ✨ Customize your profile
                </Text>
              </Column>
              <Column style={{ paddingRight: "8px" }}>
                <Text style={{ ...paragraph, margin: "0" }}>
                  🚀 Explore features
                </Text>
              </Column>
            </Row>
            <Row style={{ marginTop: "12px" }}>
              <Column style={{ paddingRight: "8px" }}>
                <Text style={{ ...paragraph, margin: "0" }}>
                  🤝 Connect with others
                </Text>
              </Column>
              <Column style={{ paddingRight: "8px" }}>
                <Text style={{ ...paragraph, margin: "0" }}>
                  📈 Track progress
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ marginTop: "32px", borderColor: "#E5E7EB" }} />

          {/* Footer */}
          <Text style={footer}>
            This email was sent to you because you signed up for our platform.
            If you didn't sign up, you can safely ignore this email.
          </Text>
          <Text style={footer}>
            <Link href="#" style={link}>
              Unsubscribe
            </Link>{" "}
            •
            <Link href="#" style={link}>
              {" "}
              Privacy Policy
            </Link>{" "}
            •
            <Link href="#" style={link}>
              {" "}
              Terms of Service
            </Link>
          </Text>
          <Text style={{ ...footer, marginTop: "12px" }}>
            © 2025 Your Company Name, All Rights Reserved
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ModernTemplate;

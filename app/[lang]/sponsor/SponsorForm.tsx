"use client";

import { useState } from "react";
import { Form, Input, Select, Button, message, Card } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, MessageOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

type FormValues = {
  fullName: string;
  email: string;
  phone?: string;
  sponsorshipType: string;
  message: string;
};

type SponsorFormProps = {
  dictionary: any;
};

export default function SponsorForm({ dictionary }: SponsorFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dict = dictionary.sponsor;

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log("Form values:", values);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      message.success(dict.successMessage);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error(dict.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "3rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "20px auto" }}>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "1rem",
            }}
          >
            {dict.title}
          </h1>
          {/* <p
            style={{
              fontSize: "1.25rem",
              color: "#4b5563",
              marginBottom: "1.5rem",
            }}
          >
            {dict.subtitle}
          </p> */}
          <p
            style={{
              fontSize: "1rem",
              color: "#6b7280",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.75",
            }}
          >
            {dict.description}
          </p>
        </div>

        {/* Form Card */}
        <Card
          style={{
            borderRadius: "1rem",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
          styles={{ body: { padding: "3rem" } }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            {dict.formTitle}
          </h2>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark="optional"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            {/* Full Name / Company Name */}
            <Form.Item
              label={<span style={{ fontSize: "1rem", fontWeight: "500" }}>{dict.fullName}</span>}
              name="fullName"
              rules={[
                { required: true, message: dict.enterFullName },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#9ca3af" }} />}
                placeholder={dict.enterFullName}
                size="large"
                style={{ borderRadius: "0.5rem" }}
              />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label={<span style={{ fontSize: "1rem", fontWeight: "500" }}>{dict.email}</span>}
              name="email"
              rules={[
                { required: true, message: dict.enterEmail },
                { type: "email", message: dict.validEmail },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#9ca3af" }} />}
                placeholder={dict.enterEmail}
                size="large"
                style={{ borderRadius: "0.5rem" }}
              />
            </Form.Item>

            {/* Phone (Optional) */}
            <Form.Item
              label={<span style={{ fontSize: "1rem", fontWeight: "500" }}>{dict.phone}</span>}
              name="phone"
            >
              <Input
                prefix={<PhoneOutlined style={{ color: "#9ca3af" }} />}
                placeholder={dict.enterPhone}
                size="large"
                style={{ borderRadius: "0.5rem" }}
              />
            </Form.Item>

            {/* Type of Sponsorship */}
            <Form.Item
              label={<span style={{ fontSize: "1rem", fontWeight: "500" }}>{dict.sponsorshipType}</span>}
              name="sponsorshipType"
              rules={[{ required: true, message: dict.selectType }]}
            >
              <Select
                placeholder={dict.selectType}
                size="large"
                style={{ borderRadius: "0.5rem" }}
              >
                <Option value="scholarship">{dict.types.scholarship}</Option>
                <Option value="program">{dict.types.program}</Option>
                <Option value="event">{dict.types.event}</Option>
                <Option value="general">{dict.types.general}</Option>
                <Option value="other">{dict.types.other}</Option>
              </Select>
            </Form.Item>

            {/* Message */}
            <Form.Item
              label={<span style={{ fontSize: "1rem", fontWeight: "500" }}>{dict.message}</span>}
              name="message"
              rules={[
                { required: true, message: dict.enterMessage },
                { min: 20, message: "Please write at least 20 characters" },
              ]}
            >
              <TextArea
                placeholder={dict.messagePlaceholder}
                rows={6}
                style={{ borderRadius: "0.5rem" }}
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item style={{ marginBottom: 0, marginTop: "2rem" }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                style={{
                  borderRadius: "0.5rem",
                  height: "3rem",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                }}
              >
                {dict.submit}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Contact Info Section */}
        <div
          style={{
            marginTop: "3rem",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "0.95rem",
          }}
        >
          <p>
            {dict.contactText}{" "}
            <a
              href={`mailto:${dict.contactEmail}`}
              style={{ color: "#667eea", fontWeight: "500" }}
            >
              {dict.contactEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

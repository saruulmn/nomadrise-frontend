"use client";

import React, { useEffect, useState } from "react";
import { scholarshipApi } from "@/lib/api";
import { Modal, Form, Input, Upload, Button, InputNumber, message, Select } from "antd";
import { UploadOutlined, FileTextOutlined, ArrowLeftOutlined, CalendarOutlined, DollarOutlined, BookOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import Link from "next/link";

const { TextArea } = Input;
const { Option } = Select;

type Scholarship = {
  url: string;
  org: string;
  org_name: string;
  title: string;
  description: string;
  study_level: string;
  field_of_study: string;
  coverage: string;
  amount: string;
  currency: string;
  application_open_at: string;
  application_close_at: string;
  application_url: string;
  is_active: boolean;
};

type ScholarshipDetailPageProps = {
  params: Promise<{ lang: string; id: string }>;
};

export default function ScholarshipDetailPage({ params }: ScholarshipDetailPageProps) {
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [lang, setLang] = useState("en");
  const [dict, setDict] = useState<any>(null);
  const [scholarshipId, setScholarshipId] = useState<string>("");

  useEffect(() => {
    Promise.resolve(params).then(async (resolvedParams) => {
      setLang(resolvedParams.lang);
      setScholarshipId(resolvedParams.id);
      const dictionary = await getDictionary(resolvedParams.lang as Locale);
      setDict(dictionary);
    });
  }, [params]);

  useEffect(() => {
    if (!scholarshipId) return;
    
    const fetchScholarship = async () => {
      try {
        const response = await scholarshipApi.getById(parseInt(scholarshipId));
        setScholarship(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching scholarship:", err);
        setError("Failed to load scholarship");
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [scholarshipId]);

  const handleApplyClick = () => {
    setModalVisible(true);
    form.resetFields();
    setFileList([]);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = async (values: any) => {
    try {
      console.log("Application submitted:", {
        scholarship: scholarship?.title,
        ...values,
        documents: fileList,
      });
      
      message.success(dict?.scholarship?.successMessage || "Application submitted successfully!");
      handleModalClose();
    } catch (error) {
      message.error(dict?.scholarship?.errorMessage || "Failed to submit application");
      console.error("Submission error:", error);
    }
  };

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: UploadFile) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
    multiple: true,
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "mn" ? "mn-MN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCoverageLabel = (coverage: string) => {
    const labels: { [key: string]: string } = {
      full: lang === "mn" ? "Бүрэн" : "Full Coverage",
      partial: lang === "mn" ? "Хэсэгчилсэн" : "Partial Coverage",
      tuition_only: lang === "mn" ? "Зөвхөн сургалтын төлбөр" : "Tuition Only",
    };
    return labels[coverage] || coverage;
  };

  const getStudyLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      undergraduate: lang === "mn" ? "Бакалавр" : "Undergraduate",
      postgraduate: lang === "mn" ? "Магистр" : "Master's/Postgraduate",
      doctorate: lang === "mn" ? "Доктор" : "Doctorate/PhD",
    };
    return labels[level] || level;
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "1.125rem", color: "#6b7280" }}>
            {lang === "mn" ? "Уншиж байна..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div style={{ minHeight: "100vh", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "1.125rem", color: "#ef4444" }}>
            {error || (lang === "mn" ? "Тэтгэлэг олдсонгүй" : "Scholarship not found")}
          </p>
          <Link href={`/${lang}/scholarships`}>
            <button style={{
              marginTop: "2rem",
              padding: "0.75rem 1.5rem",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "1rem",
            }}>
              {lang === "mn" ? "Буцах" : "Back to Scholarships"}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "4rem 2rem", background: "#f9fafb" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Back Button */}
        <Link href={`/${lang}/scholarships`}>
          <button style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "0.95rem",
            marginBottom: "2rem",
            color: "#374151",
          }}>
            <ArrowLeftOutlined />
            {lang === "mn" ? "Буцах" : "Back to Scholarships"}
          </button>
        </Link>

        {/* Scholarship Header */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "3rem 2rem",
          borderRadius: "1rem",
          marginBottom: "2rem",
          color: "white",
        }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem", color: "white" }}>
            {scholarship.title}
          </h1>
          <p style={{ fontSize: "1.25rem", opacity: 0.9, marginBottom: "1.5rem" }}>
            {scholarship.org_name}
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <span style={{
              padding: "0.5rem 1rem",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "9999px",
              fontSize: "0.95rem",
            }}>
              {getStudyLevelLabel(scholarship.study_level)}
            </span>
            <span style={{
              padding: "0.5rem 1rem",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "9999px",
              fontSize: "0.95rem",
            }}>
              {getCoverageLabel(scholarship.coverage)}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          background: "white",
          padding: "2.5rem",
          borderRadius: "1rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          marginBottom: "2rem",
        }}>
          {/* Key Information */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
            padding: "2rem",
            background: "#f9fafb",
            borderRadius: "0.75rem",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <DollarOutlined style={{ fontSize: "1.5rem", color: "#667eea" }} />
                <h3 style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: "600", textTransform: "uppercase" }}>
                  {lang === "mn" ? "Дүн" : "Amount"}
                </h3>
              </div>
              <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#667eea" }}>
                {scholarship.amount ? `${scholarship.currency} ${Number(scholarship.amount).toLocaleString()}` : lang === "mn" ? "Холбогдох" : "Contact for details"}
              </p>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <CalendarOutlined style={{ fontSize: "1.5rem", color: "#667eea" }} />
                <h3 style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: "600", textTransform: "uppercase" }}>
                  {lang === "mn" ? "Хаах хугацаа" : "Deadline"}
                </h3>
              </div>
              <p style={{ fontSize: "1.125rem", fontWeight: "600", color: "#dc2626" }}>
                {formatDate(scholarship.application_close_at)}
              </p>
            </div>

            {scholarship.field_of_study && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <BookOutlined style={{ fontSize: "1.5rem", color: "#667eea" }} />
                  <h3 style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: "600", textTransform: "uppercase" }}>
                    {lang === "mn" ? "Салбар" : "Field of Study"}
                  </h3>
                </div>
                <p style={{ fontSize: "1.125rem", fontWeight: "600", color: "#374151" }}>
                  {scholarship.field_of_study}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1f2937", marginBottom: "1rem" }}>
              {lang === "mn" ? "Дэлгэрэнгүй мэдээлэл" : "Description"}
            </h2>
            <div style={{
              fontSize: "1.05rem",
              lineHeight: "1.8",
              color: "#374151",
              whiteSpace: "pre-wrap",
            }}>
              {scholarship.description}
            </div>
          </div>

          {/* Application Period */}
          {scholarship.application_open_at && (
            <div style={{
              padding: "1.5rem",
              background: "#fef3c7",
              border: "1px solid #fbbf24",
              borderRadius: "0.75rem",
              marginBottom: "2rem",
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#92400e", marginBottom: "0.5rem" }}>
                {lang === "mn" ? "Өргөдлийн хугацаа" : "Application Period"}
              </h3>
              <p style={{ color: "#78350f", fontSize: "1rem" }}>
                {formatDate(scholarship.application_open_at)} - {formatDate(scholarship.application_close_at)}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={handleApplyClick}
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "1rem 2rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1.125rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {dict?.scholarship?.checkMaterials || (lang === "mn" ? "Материал шалгуулах" : "Check Materials")}
            </button>

            <a
              href={scholarship.application_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "1rem 2rem",
                background: "white",
                color: "#667eea",
                border: "2px solid #667eea",
                borderRadius: "0.5rem",
                fontSize: "1.125rem",
                fontWeight: "600",
                textDecoration: "none",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#667eea";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.color = "#667eea";
              }}
            >
              {lang === "mn" ? "Албан ёсны вэбсайт" : "Official Website"}
            </a>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {dict && (
        <Modal
          title={
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#667eea" }}>
              {dict.scholarship.checkMaterials}
            </div>
          }
          open={modalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={700}
          centered
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", color: "#374151", marginBottom: "0.5rem" }}>
              {scholarship.title}
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
              {scholarship.org_name}
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark="optional"
          >
            <Form.Item
              label={dict.scholarship.fullName}
              name="fullName"
              rules={[{ required: true, message: dict.scholarship.enterFullName }]}
            >
              <Input size="large" placeholder={dict.scholarship.fullName} />
            </Form.Item>

            <Form.Item
              label={dict.scholarship.email}
              name="email"
              rules={[
                { required: true, message: dict.scholarship.enterEmail },
                { type: "email", message: dict.scholarship.validEmail }
              ]}
            >
              <Input size="large" placeholder="example@email.com" />
            </Form.Item>

            <Form.Item
              label={dict.scholarship.phone}
              name="phone"
              rules={[{ required: true, message: dict.scholarship.enterPhone }]}
            >
              <Input size="large" placeholder="+976 99999999" />
            </Form.Item>

            <Form.Item
              label={dict.scholarship.school}
              name="school"
              rules={[{ required: true, message: dict.scholarship.enterSchool }]}
            >
              <Input size="large" placeholder={dict.scholarship.school} />
            </Form.Item>

            <Form.Item
              label={dict.scholarship.gpa}
              name="gpa"
              rules={[{ required: true, message: dict.scholarship.enterGpa }]}
            >
              <InputNumber
                size="large"
                min={0}
                max={4}
                step={0.01}
                style={{ width: "100%" }}
                placeholder="3.50"
              />
            </Form.Item>

            <Form.Item
              label={dict.scholarship.ielts}
              name="ielts"
              rules={[{ required: true, message: dict.scholarship.enterIelts }]}
            >
              <InputNumber
                size="large"
                min={0}
                max={9}
                step={0.5}
                style={{ width: "100%" }}
                placeholder="7.0"
              />
            </Form.Item>

            <Form.Item
              label={dict.scholarship.fieldOfStudy}
              name="fieldOfStudy"
              rules={[{ required: true, message: dict.scholarship.selectField }]}
            >
              <Select size="large" placeholder={dict.scholarship.selectField}>
                <Option value="computer-science">{dict.scholarship.fields.computerScience}</Option>
                <Option value="engineering">{dict.scholarship.fields.engineering}</Option>
                <Option value="business">{dict.scholarship.fields.business}</Option>
                <Option value="medicine">{dict.scholarship.fields.medicine}</Option>
                <Option value="arts">{dict.scholarship.fields.arts}</Option>
                <Option value="sciences">{dict.scholarship.fields.sciences}</Option>
                <Option value="social-sciences">{dict.scholarship.fields.socialSciences}</Option>
                <Option value="other">{dict.scholarship.fields.other}</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={dict.scholarship.essay}
              name="essay"
              rules={[
                { required: true, message: dict.scholarship.writeEssay },
                { min: 200, message: dict.scholarship.essayMinLength }
              ]}
            >
              <TextArea
                rows={6}
                placeholder={dict.scholarship.essayPlaceholder}
                showCount
                maxLength={2000}
              />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  <FileTextOutlined style={{ marginRight: "0.5rem" }} />
                  {dict.scholarship.documents}
                </span>
              }
              name="documents"
              rules={[{ required: true, message: dict.scholarship.uploadDocuments }]}
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} size="large" style={{ width: "100%" }}>
                  {dict.scholarship.selectFiles}
                </Button>
              </Upload>
            </Form.Item>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "-1rem", marginBottom: "1rem" }}>
              {dict.scholarship.documentHint}
            </p>

            <Form.Item>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem" }}>
                <Button size="large" onClick={handleModalClose}>
                  {dict.scholarship.cancel}
                </Button>
                <Button 
                  type="primary" 
                  size="large" 
                  htmlType="submit"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                  }}
                >
                  {dict.scholarship.submit}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}

import { Button, Form, Input, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const registerMutation = useMutation<
    { success: boolean; message: string },
    unknown,
    any
  >({
    mutationFn: async (values) => {
      console.log("🚀 Sending register request to API:", values);

      const payload = {
        accountName: values.accountName,
        password: values.password,
      };

      setLoading(true);
      const response = await fetch(
        "https://localhost:7071/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      setLoading(false);
      return response.json();
    },
    onSuccess: (response) => {
      console.log("📦 API Response Data:", response);
      if (response.success) {
        message.success("Đăng ký thành công! Vui lòng đăng nhập.");
        form.resetFields();
      } else {
        message.error(response.message || "Đăng ký thất bại.");
      }
    },
    onError: (error) => {
      console.error("❌ Registration error:", error);
      message.error("Lỗi kết nối đến máy chủ: " + (error as Error).message);
      setLoading(false);
    },
  });

  const onFinish = (values: any) => {
    console.log("🆕 Registering:", values);
    registerMutation.mutate(values);
  };

  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      onFinishFailed={(errorInfo) => {
        console.error("❌ Form submission failed. Errors:", errorInfo);
        alert("Form submission failed! Check console for errors.");
      }}
    >
      <Form.Item
        name="accountName"
        label="Tài khoản"
        rules={[{ required: true, message: "Nhập tài khoản" }]}
      >
        <Input placeholder="Tài khoản" allowClear />
      </Form.Item>

      <Form.Item
        name="password"
        label="Mật khẩu"
        rules={[{ required: true, message: "Nhập mật khẩu" }]}
      >
        <Input.Password
          placeholder="Mật khẩu"
          allowClear
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="submit-btn"
          loading={loading}
        >
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;

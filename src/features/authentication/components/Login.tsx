/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, message, Tabs } from "antd";
import {
  LockOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../hooks/useAuthStore";
import { useNavigate } from "react-router-dom";
import { LoginDto } from "../dto/login.dto";
import { PagePath } from "../../../enums/page-path.enum";
import { RoleCode } from "../../../enums/role.enum";
import "../../../style/Login.css";
import { useState } from "react";

const { TabPane } = Tabs;

const LoginRegister = () => {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const loginMutation = useMutation<
    { success: boolean; message: string; role: string },
    unknown,
    LoginDto
  >({
    mutationFn: login,
    onSuccess: (response) => {
      if (response.success) {
        if (
          response.role === RoleCode.ADMIN ||
          response.role === RoleCode.STAFF ||
          response.role === RoleCode.THERAPIST
        ) {
          navigate(PagePath.HOME);
        } else {
          navigate(PagePath.HOME_PAGE);
        }
        message.success("Đăng nhập thành công");
      } else {
        message.error(response.message);
      }
    },
    onError: (error) => {
      message.error("Login failed: " + (error as Error).message);
    },
  });

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

      const response = await fetch("https://localhost:7071/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📩 API Response received:", response);
      return response.json();
    },
    onSuccess: (response) => {
      console.log("📦 API Response Data:", response);
      if (response.success) {
        message.success("Đăng ký thành công! Vui lòng đăng nhập.");
        setActiveTab("1");
      } else {
        message.error("Đăng ký thất bại.");
      }
    },
    onError: (error) => {
      message.error("Lỗi kết nối đến máy chủ: " + (error as Error).message);
    },
  });

  const onFinish = (values: any) => {
    console.log("📌 Active Tab at Form Submit:", activeTab);

    if (activeTab === "1") {
      console.log("🔑 Logging in:", values);
      loginMutation.mutate(values);
    } else if (activeTab === "2") {
      console.log("🆕 Registering:", values);
      registerMutation.mutate(values);
    } else {
      console.error("Unexpected Tab State:", activeTab);
    }
  };


    const payload = {
      accountName: values.accountName,
      password: values.password,
    };

    const response = await fetch("https://localhost:7071/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify(payload),
    });

    console.log("📩 API Response received:", response);
    return response.json();
  },
  onSuccess: (response) => {
    console.log("📦 API Response Data:", response);
    if (response.success) {
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      setActiveTab("1");
    } else {
      message.error( "Đăng ký thất bại.");
    }
  },
  onError: (error) => {
    message.error("Lỗi kết nối đến máy chủ: " + (error as Error).message);
  },
});



const onFinish = (values: any) => {
  console.log("📌 Active Tab at Form Submit:", activeTab);

  if (activeTab === "1") {
    console.log("🔑 Logging in:", values);
    loginMutation.mutate(values);
  } else if (activeTab === "2") {
    console.log("🆕 Registering:", values);
    registerMutation.mutate(values);
  } else {
    console.error(" Unexpected Tab State:", activeTab);
  }
};


  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image">
          <img
            src="https://i.pinimg.com/736x/58/43/3f/58433f4c85f2c63027ec5bf84bbda38f.jpg"
            alt="Logo"
          />
        </div>

        <div className="login-form">
          <h2 className="login-title">Dịch vụ chăm sóc da</h2>
          <Tabs
            defaultActiveKey="1"
            centered
            onChange={(key) => setActiveTab(key)}
          >
            <TabPane tab="Đăng nhập" key="1">
              <Form form={loginForm} name="login" onFinish={onFinish}>
                <Form.Item
                  name="accountName"
                  label="Tài khoản"
                  rules={[{ required: true, message: "Nhập tài khoản" }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Tài khoản"
                    allowClear
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[{ required: true, message: "Nhập mật khẩu" }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu"
                    allowClear
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
                <Form.Item className="forgot-password">
                  <Button
                    type="link"
                    onClick={() => navigate(PagePath.VERIFY_EMAIL)}
                  >
                    Quên mật khẩu?
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="submit-btn"
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="Đăng ký" key="2">
              <Form
                form={registerForm}
                name="register"
                onFinish={onFinish}
                onFinishFailed={(errorInfo) => {
                  console.error(
                    "❌ Form submission failed. Errors:",
                    errorInfo
                  );
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

                <Form.Item
                  name="confirmPassword"
                  label="Nhập lại mật khẩu"
                  rules={[{ required: true, message: "Nhập lại mật khẩu" }]}
                >
                  <Input.Password
                    placeholder="Nhập lại mật khẩu"
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
                    onClick={() => {
                      console.log(
                        "🖱️ Đăng ký button clicked! Submitting form..."
                      );
                      loginForm.submit();
                    }}
                  >
                    Đăng ký
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;

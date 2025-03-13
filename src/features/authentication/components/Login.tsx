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

const { TabPane } = Tabs;

const LoginRegister = () => {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const mutation = useMutation<
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

  const onFinish = (values: LoginDto) => {
    mutation.mutate(values);
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
          <Tabs defaultActiveKey="1" centered>
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
              <Form form={registerForm} name="register" onFinish={onFinish}>
                <Form.Item
                  name="username"
                  label="Tài khoản"
                  rules={[{ required: true, message: "Nhập tài khoản" }]}
                >
                  <Input placeholder="Tài khoản" allowClear />
                </Form.Item>
                <Form.Item
                  name="fullName"
                  label="Họ & Tên"
                  rules={[{ required: true, message: "Nhập họ & tên" }]}
                >
                  <Input placeholder="Họ & Tên" allowClear />
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

import { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../hooks/useAuthStore";
import "../../../style/App.css";
import { useNavigate } from "react-router-dom";
import { LoginDto } from "../dto/login.dto";
import { PagePath } from "../../../enums/page-path.enum";

const VerifyEmail = () => {
  const [form] = Form.useForm();
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const mutation = useMutation<
    { success: boolean; message: string },
    unknown,
    LoginDto
  >({
    mutationFn: login,
    onSuccess: (response) => {
      if (response.success) {
        navigate(PagePath.HOME);
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

  useEffect(() => {
    document.title = "Xác thực email";
  }, []);

  return (
    <div>
      <img
        src="https://cdn.fpt-is.com/vi/FPT-IS-set-logo-08-1715516291.svg"
        style={{ width: "200px" }}
      />
      <h2 style={{ fontWeight: 700, fontSize: "30px", margin: 0 }}>Skincare</h2>
      <p style={{ marginTop: 0 }}>Xác thực email</p>
      <div className="form-container">
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          initialValues={{
            username: "ADMIN@GMAIL.COM",
          }}
        >
          <Form.Item
            name="username"
            label="Tài khoản"
            rules={[{ required: true, message: "Nhập tài khoản" }]}
          >
            <Input allowClear placeholder="Username" />
          </Form.Item>
          <Form.Item>
            <Button
              className="login-btn"
              type="primary"
              onClick={() => navigate(PagePath.VERIFY_OTP)}
            >
              Xác thực email
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default VerifyEmail;

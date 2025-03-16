import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { PagePath } from "../../../enums/page-path.enum";
import { useForgotPassword } from "../hooks/useForgotPassword";

const VerifyEmail = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const onFinish = (values: { email: string }) => {
    forgotPassword(values.email, {
      onSuccess: () => {
        message.success("OTP đã được gửi đến email của bạn!");

        
        sessionStorage.setItem("user_email", values.email);

        
        navigate(PagePath.VERIFY_OTP, { state: { email: values.email } });
      },
      onError: (error) => {
        message.error("Gửi OTP thất bại: " + (error as Error).message);
      },
    });
  };

  return (
    <div>
      <h2 style={{ fontWeight: 700, fontSize: "30px", margin: 0 }}>Skincare</h2>
      <p style={{ marginTop: 0 }}>Xác thực email</p>
      <div className="form-container">
        <Form
          form={form}
          name="forgot-password"
          onFinish={onFinish}
          initialValues={{ email: "ADMIN@GMAIL.COM" }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Nhập email của bạn" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input allowClear placeholder="Nhập email của bạn" />
          </Form.Item>
          <Form.Item>
            <Button
              className="login-btn"
              type="primary"
              htmlType="submit"
              loading={isPending}
            >
              Nhận OTP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default VerifyEmail;

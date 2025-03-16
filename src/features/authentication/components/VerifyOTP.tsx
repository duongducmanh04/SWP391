import { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../style/App.css";
import { PagePath } from "../../../enums/page-path.enum";
import { useVerifyOTP } from "../hooks/useVerifyOTP";

const VerifyOTP = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  
  
  const email = location.state?.email || sessionStorage.getItem("user_email");

  useEffect(() => {
    document.title = "Xác thực OTP";

    
    if (!email) {
      message.error("Lỗi: Không có email! Quay lại trang trước.");
      navigate(PagePath.VERIFY_EMAIL);
    }
  }, [email, navigate]);

  const { mutate: verifyOTP, isPending } = useVerifyOTP();

  const onFinish = (values: { otp: string }) => {
    if (!email) {
      message.error("Lỗi: Không có email! Quay lại trang trước.");
      return;
    }

    verifyOTP(
      { email, otp: values.otp },
      {
        onSuccess: () => {
          message.success("OTP hợp lệ! Bạn có thể đặt lại mật khẩu...");
          sessionStorage.setItem("user_email", email);
          sessionStorage.setItem("otp", values.otp);
          navigate(PagePath.RESET_PASSWORD, { state: { email } });
        },
        onError: (error) => {
          message.error("Xác thực OTP thất bại: " + (error as Error).message);
        },
      }
    );
  };

  return (
    <div>
      <h2 style={{ fontWeight: 700, fontSize: "30px", margin: 0 }}>Skincare</h2>
      <p style={{ marginTop: 0 }}>Xác thực OTP</p>
      <div className="form-container">
        <Form form={form} name="verify-otp" onFinish={onFinish}>
          <Form.Item
            name="otp"
            label="OTP"
            rules={[{ required: true, message: "Nhập OTP" }]}
          >
            <Input maxLength={6} allowClear placeholder="Nhập mã OTP" />
          </Form.Item>
          <Form.Item>
            <Button className="login-btn" type="primary" htmlType="submit" loading={isPending}>
              Xác thực OTP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default VerifyOTP;

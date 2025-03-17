import { Button, Form, Input, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "../../../style/App.css";
import { useNavigate, useLocation } from "react-router-dom";
import { PagePath } from "../../../enums/page-path.enum";
import { useResetPassword } from "../hooks/useResetPassword";

const ResetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || sessionStorage.getItem("user_email");
  const otp = location.state?.otp || sessionStorage.getItem("otp");
  const { mutate: resetPassword, isPending } = useResetPassword();
  const onFinish = (values: { newPassword: string; confirmNewPassword: string }) => {
    if (!email || !otp) {
      message.error("Lỗi: Không tìm thấy email hoặc OTP!");
      navigate(PagePath.VERIFY_EMAIL);
      return;
    }

    if (values.newPassword !== values.confirmNewPassword) {
      message.error("Mật khẩu mới không trùng khớp!");
      return;
    }

    resetPassword(
      { email, otp, newPassword: values.newPassword },
      {
        onSuccess: () => {
          message.success("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập lại...");
          navigate(PagePath.LOGIN);
        },
        onError: (error) => {
          console.error("❌ API Error:", error);
          message.error("Đặt lại mật khẩu thất bại: " + (error as Error).message);
        },
      }
    );
  };

  return (
    <div>
      <h2 style={{ fontWeight: 700, fontSize: "30px", margin: 0 }}>Skincare</h2>
      <p style={{ marginTop: 0 }}>Đặt lại mật khẩu</p>
      <div className="form-container">
        <Form form={form} name="reset-password" onFinish={onFinish}>
        <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Nhập mật khẩu mới" },
              { min: 8, message: "Mật khẩu mới phải có ít nhất 8 ký tự!" }, 
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu mới"
              allowClear
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="confirmNewPassword"
            label="Nhập lại mật khẩu"
            rules={[{ required: true, message: "Nhập lại mật khẩu mới" }]}
          >
            <Input.Password
              placeholder="Xác nhận mật khẩu mới"
              allowClear
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item>
            <Button className="login-btn" type="primary" htmlType="submit" loading={isPending}>
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;

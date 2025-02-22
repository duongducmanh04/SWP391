import { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../hooks/useAuthStore";
import "../../../style/App.css";
import { useNavigate } from "react-router-dom";
import { LoginDto } from "../dto/login.dto";
import { PagePath } from "../../../enums/page-path.enum";
import type { GetProps } from "antd";

type OTPProps = GetProps<typeof Input.OTP>;

const VerifyOTP = () => {
  const [form] = Form.useForm();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const onChange: OTPProps["onChange"] = (text) => {
    console.log("onChange:", text);
  };

  const onInput: OTPProps["onInput"] = (value) => {
    console.log("onInput:", value);
  };

  const sharedProps: OTPProps = {
    onChange,
    onInput,
  };

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
    document.title = "Xác thực OTP";
  }, []);

  return (
    <div>
      <img
        src="https://cdn.fpt-is.com/vi/FPT-IS-set-logo-08-1715516291.svg"
        style={{ width: "200px" }}
      />
      <h2 style={{ fontWeight: 700, fontSize: "30px", margin: 0 }}>Skincare</h2>
      <p style={{ marginTop: 0 }}>Xác thực OTP</p>
      <div className="form-container">
        <Form form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="OTP"
            label="OTP"
            rules={[{ required: true, message: "Nhập OTP" }]}
          >
            <Input.OTP
              formatter={(str) => str.replace(/\D/g, "")}
              {...sharedProps}
            />
          </Form.Item>
          <Form.Item>
            <Button
              className="login-btn"
              type="primary"
              onClick={() => navigate(PagePath.VERIFY_OTP)}
            >
              Xác thực OTP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default VerifyOTP;

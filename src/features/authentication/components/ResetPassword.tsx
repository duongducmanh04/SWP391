import { Button, Form, Input, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import "../../../style/App.css";
import { useNavigate } from "react-router-dom";
import { PagePath } from "../../../enums/page-path.enum";

const ResetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(PagePath.LOGIN);
  };

  return (
    <div>
      {/* <img
        src="https://cdn.fpt-is.com/vi/FPT-IS-set-logo-08-1715516291.svg"
        style={{ width: "200px" }}
      /> */}
      <h2 style={{ fontWeight: 700, fontSize: "30px", margin: 0 }}>Skincare</h2>
      <p style={{ marginTop: 0 }}>Đặt lại mật khẩu</p>
      <div className="form-container">
        <Form form={form} name="control-hooks">
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Nhập mật khẩu mới" }]}
          >
            <Input.Password
              placeholder="input new password"
              allowClear
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="confirmNewPassword"
            label="Nhập lại mật khẩu mới"
            rules={[{ required: true, message: "Nhập lại mật khẩu mới" }]}
          >
            <Input.Password
              placeholder="confirm new password"
              allowClear
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item>
            <Button className="login-btn" type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;

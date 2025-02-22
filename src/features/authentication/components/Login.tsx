// // import { useEffect } from "react";
// import { Button, Form, Input, message, Tabs, Col } from "antd";
// import {
//   LockOutlined,
//   UserOutlined,
//   EyeInvisibleOutlined,
//   EyeTwoTone,
// } from "@ant-design/icons";
// import { useMutation } from "@tanstack/react-query";
// import useAuthStore from "../hooks/useAuthStore";
// import "../../../style/App.css";
// import { useNavigate } from "react-router-dom";
// import { LoginDto } from "../dto/login.dto";
// import { PagePath } from "../../../enums/page-path.enum";
// import { RoleCode } from "../../../enums/role.enum";

// const { TabPane } = Tabs;

// const LoginRegister = () => {
//   const [form] = Form.useForm();
//   const { login } = useAuthStore();
//   const navigate = useNavigate();

//   const mutation = useMutation<
//     { success: boolean; message: string; role: string },
//     unknown,
//     LoginDto
//   >({
//     mutationFn: login,
//     onSuccess: (response) => {
//       if (response.success) {
//         if (response.role === RoleCode.ADMIN) {
//           navigate(PagePath.HOME);
//         } else if (response.role === RoleCode.STAFF) {
//           navigate(PagePath.SS_HOME);
//         } else if (response.role === RoleCode.THERAPIST) {
//           navigate(PagePath.SS_HOME);
//         } else {
//           navigate(PagePath.HOME_PAGE);
//         }
//         message.success("Đăng nhập thành công");
//       } else {
//         message.error(response.message);
//       }
//     },
//     onError: (error) => {
//       message.error("Login failed: " + (error as Error).message);
//     },
//   });

//   const onFinish = (values: LoginDto) => {
//     mutation.mutate(values);
//   };

//   // useEffect(() => {
//   //   document.title = "Đăng nhập/Đăng ký";
//   // }, []);

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       <Col
//         span={12}
//         style={{
//           background: "#f0f2f5",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           overflow: "hidden",
//         }}
//       >
//         <img
//           src="https://i.pinimg.com/736x/58/43/3f/58433f4c85f2c63027ec5bf84bbda38f.jpg"
//           alt="Logo"
//           style={{
//             height: "-webkit-fill-available",
//             width: "-webkit-fill-available",
//             margin: "-80px 0",
//           }}
//         />
//       </Col>

//       <Col span={12} style={{ padding: "20px 80px", alignContent: "center" }}>
//         <h2 style={{ fontWeight: 700, fontSize: "30px", textAlign: "center" }}>
//           Dịch vụ chăm sóc da
//         </h2>
//         <Tabs defaultActiveKey="1" centered>
//           <TabPane tab="Đăng nhập" key="1">
//             <Form
//               form={form}
//               name="login"
//               onFinish={onFinish}
//               initialValues={{
//                 accountName: "customer1",
//                 password: "customer123",
//               }}
//             >
//               <Form.Item
//                 name="accountName"
//                 label="Tài khoản"
//                 rules={[{ required: true, message: "Nhập tài khoản" }]}
//               >
//                 <Input
//                   allowClear
//                   prefix={<UserOutlined />}
//                   placeholder="accountName"
//                 />
//               </Form.Item>
//               <Form.Item
//                 name="password"
//                 label="Mật khẩu"
//                 rules={[{ required: true, message: "Nhập mật khẩu" }]}
//               >
//                 <Input.Password
//                   placeholder="input password"
//                   prefix={<LockOutlined />}
//                   allowClear
//                   iconRender={(visible) =>
//                     visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
//                   }
//                 />
//               </Form.Item>
//               <Form.Item style={{ textAlign: "right" }}>
//                 <Button
//                   type="link"
//                   onClick={() => navigate(PagePath.VERIFY_EMAIL)}
//                 >
//                   Quên mật khẩu
//                 </Button>
//               </Form.Item>
//               <Form.Item>
//                 <Button
//                   className="login-btn"
//                   type="primary"
//                   htmlType="submit"
//                   block
//                 >
//                   Đăng nhập
//                 </Button>
//               </Form.Item>
//             </Form>
//           </TabPane>

//           <TabPane tab="Đăng ký" key="2">
//             <Form
//               form={form}
//               name="register"
//               onFinish={onFinish}
//               initialValues={{
//                 username: "ADMIN@GMAIL.COM",
//                 password: "admin",
//               }}
//             >
//               <Form.Item
//                 name="username"
//                 label="Tài khoản"
//                 rules={[{ required: true, message: "Nhập tài khoản" }]}
//               >
//                 <Input allowClear placeholder="Username" />
//               </Form.Item>
//               <Form.Item
//                 name="fullName"
//                 label="Họ & Tên"
//                 rules={[{ required: true, message: "Nhập họ & tên" }]}
//               >
//                 <Input allowClear placeholder="Full Name" />
//               </Form.Item>
//               <Form.Item
//                 name="password"
//                 label="Mật khẩu"
//                 rules={[{ required: true, message: "Nhập mật khẩu" }]}
//               >
//                 <Input.Password
//                   placeholder="input password"
//                   allowClear
//                   iconRender={(visible) =>
//                     visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
//                   }
//                 />
//               </Form.Item>
//               <Form.Item
//                 name="confirmPassword"
//                 label="Nhập lại mật khẩu"
//                 rules={[{ required: true, message: "Nhập lại mật khẩu" }]}
//               >
//                 <Input.Password
//                   placeholder="confirm password"
//                   allowClear
//                   iconRender={(visible) =>
//                     visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
//                   }
//                 />
//               </Form.Item>
//               <Form.Item>
//                 <Button
//                   className="login-btn"
//                   type="primary"
//                   htmlType="submit"
//                   block
//                 >
//                   Đăng ký
//                 </Button>
//               </Form.Item>
//             </Form>
//           </TabPane>
//         </Tabs>
//       </Col>
//     </div>
//   );
// };

// export default LoginRegister;
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
  const [form] = Form.useForm();
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
        if (response.role === RoleCode.ADMIN) {
          navigate(PagePath.HOME);
        } else if (response.role === RoleCode.STAFF) {
          navigate(PagePath.HOME);
        } else if (response.role === RoleCode.THERAPIST) {
          navigate(PagePath.SKIN_THERAPIST_PAGE);
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
              <Form form={form} name="login" onFinish={onFinish}>
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
                    className="login-btn"
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="Đăng ký" key="2">
              <Form form={form} name="register" onFinish={onFinish}>
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
                    className="login-btn"
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

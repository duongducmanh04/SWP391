import { useState, useEffect } from "react";
import {
  HomeOutlined,
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellFilled,
  UserOutlined,
  LogoutOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  Button,
  Dropdown,
  Modal,
  Popover,
} from "antd";
import { Link, useLocation, Outlet } from "react-router-dom";
import "../style/Home.css";
import useAuthStore from "../features/authentication/hooks/useAuthStore";
import { useNavigate } from "react-router-dom";
import { PagePath } from "../enums/page-path.enum";
import { RoleCode } from "../enums/role.enum";

const { Header, Content, Sider } = Layout;

const notificationContent = (
  <div>
    <p>Chưa có thông báo</p>
    <BellFilled
      style={{
        fontSize: "25px",
        display: "block",
        cursor: "pointer",
      }}
    />
  </div>
);

const SidebarMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

  useEffect(() => {
    document.title = "Trang chủ";
  }, []);

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     if (!token || !user) return;

  //     try {
  //       const response = await fetch(
  //         `https://dev.ddc.fis.vn/econstruction_api/users/get_one?username=${user.username}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const data = await response.json();

  //       console.log("User Details API Response:", data);

  //       if (data.statusCode === 1 && data.data.length > 0) {
  //         setUsername(data.data[0].username);
  //       } else {
  //         // message.error("Failed to fetch user details");
  //       }
  //     } catch (error) {
  //       message.error(
  //         "Error fetching user details: " + (error as Error).message
  //       );
  //     }
  //   };

  //   fetchUserDetails();
  // }, [token, user]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMenu = (key: string) => {
    if (key === "account") {
      navigate("/Home/Profile");
    } else if (key === "logout") {
      navigate("/");
      logout();
    }
  };

  const accountMenu = (
    <Menu onClick={({ key }) => handleMenu(key)}>
      <Menu.Item key="account" icon={<UserOutlined />}>
        Thông tin tài khoản
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => handleLogout()}
        style={{ color: "red" }}
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const items2 = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to={PagePath.HOME}>Trang chủ</Link>,
    },
    {
      key: "2",
      icon: <AppstoreOutlined />,
      label: "Quản lý",
      children: [
        {
          key: PagePath.WORK_VOLUME,
          label: <Link to={PagePath.WORK_VOLUME}>Bảng khối lượng</Link>,
        },
        {
          key: PagePath.USER,
          label: <Link to={PagePath.USER}>Người dùng</Link>,
        },
      ],
    },
    ...(user?.role === RoleCode.STAFF || user?.role === RoleCode.THERAPIST
      ? [
          {
            key: "3",
            icon: <CalendarOutlined />,
            label: <Link to={PagePath.BOOKING}>Lịch đặt</Link>,
          },
        ]
      : []),
  ];

  const isHomePage = location.pathname === "/home";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          backgroundColor: "rgb(242 245 248 / 1)",
          marginTop: "64px",
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            height: "100%",
            borderRight: 0,
          }}
          items={items2}
          className="bg-light-109"
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            width: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            borderBottom: "1px solid #EBEFF5",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              border: "none",
              outline: "none",
            }}
          />

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              marginRight: "20px",
            }}
          >
            <Popover
              content={notificationContent}
              trigger="hover"
              placement="bottomRight"
            >
              <BellFilled
                style={{
                  fontSize: "25px",
                  marginRight: "20px",
                  cursor: "pointer",
                }}
              />
            </Popover>

            <Dropdown overlay={accountMenu}>
              <span
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src="https://joesch.moe/api/v1/male/random?key=1"
                  style={{
                    marginRight: "10px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "2px solid #1890ff",
                    objectFit: "cover",
                  }}
                  alt="User Avatar"
                />
                {user?.username || "User"}
              </span>
            </Dropdown>
          </div>
        </Header>

        <Layout
          style={{
            padding: "64px 24px 24px",
            backgroundColor: "#FFF",
          }}
          className={isHomePage ? "home-background" : ""}
        >
          <Breadcrumb
            style={{
              margin: "6px 0",
            }}
          ></Breadcrumb>
          <Content
            style={{
              padding: "0 24",
              margin: 0,
              minHeight: 280,
              borderRadius: "8px",
              background: "transparent",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <Modal
        title="Quy định nhập liệu"
        visible={isModalVisible}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p></p>
      </Modal>
    </Layout>
  );
};

export default SidebarMenu;

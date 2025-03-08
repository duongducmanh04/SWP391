import { useState } from "react";
import { Layout, Menu, Card } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;

const CustomerProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f1eb" }}>
      <Layout>
        {/* Sidebar */}
        <Sider width={250} theme="light" style={{ background: "#fff" }}>
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            onClick={(e) => setActiveTab(e.key)}
            style={{ borderRight: 0 }}
          >
            <Menu.Item key="personal" icon={<UserOutlined />}>
              Thông tin cá nhân
            </Menu.Item>
            <Menu.Item key="schedule" icon={<ClockCircleOutlined />}>
              Lịch sử đặt lịch
            </Menu.Item>
            <Menu.Item key="password" icon={<LockOutlined />}>
              Đổi mật khẩu
            </Menu.Item>
          </Menu>
        </Sider>

        {/* Main Content */}
        <Layout style={{ padding: "24px", background: "#f5f1eb" }}>
          <Content
            style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}
          >
            <Card title="Hồ sơ khách hàng" bordered={false}>
              {activeTab === "personal" && (
                <p>Thông tin cá nhân của khách hàng</p>
              )}
              {activeTab === "schedule" && (
                <p>Lịch sử đặt lịch của khách hàng</p>
              )}
              {activeTab === "password" && (
                <p>Thay đổi mật khẩu của khách hàng</p>
              )}
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default CustomerProfile;

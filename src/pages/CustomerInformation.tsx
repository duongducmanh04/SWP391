import { useState } from "react";
import { Layout, Menu, Card, Spin, Alert, Avatar, List } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useCustomers } from "../features/user/hook/useGetCustomer"; // Import custom hook

const { Sider, Content } = Layout;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("personal");

  // Fetch danh sách khách hàng từ API
  const { data: customers, isLoading, isError, error } = useCustomers();

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
              {isLoading ? (
                <Spin tip="Đang tải dữ liệu khách hàng..." />
              ) : isError ? (
                <Alert
                  message={error?.message || "Lỗi tải dữ liệu"}
                  type="error"
                />
              ) : (
                <>
                  {activeTab === "personal" && customers && (
                    <List
                      itemLayout="horizontal"
                      dataSource={customers}
                      renderItem={(customer) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                size={64}
                                src={customer.image}
                                icon={
                                  !customer.image ? <UserOutlined /> : undefined
                                }
                              />
                            }
                            title={<b>{customer.name}</b>}
                            description={
                              <>
                                <p>Email: {customer.email}</p>
                                <p>Số điện thoại: {customer.phoneNumber}</p>
                                <p>Loại da (ID): {customer.skintypeId}</p>
                                <p>Account ID={customer.accountId}</p>
                              </>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )}
                  {activeTab === "schedule" && (
                    <p>Lịch sử đặt lịch của khách hàng</p>
                  )}
                  {activeTab === "password" && (
                    <p>Thay đổi mật khẩu của khách hàng</p>
                  )}
                </>
              )}
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ProfilePage;

import { useState } from "react";
import { Layout, Menu, Card, Spin, Alert, Avatar, List } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useGetCustomerProfile } from "../features/user/hook/useGetCustomerProfile";
import { useBookingHistory } from "../features/booking/hooks/useBookingHistory";

const { Sider, Content } = Layout;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const accountId = 7; // Có thể lấy từ auth state
  const role = "Customer";

  // Fetch dữ liệu khách hàng
  const {
    data: customer,
    isLoading,
    isError,
    error,
  } = useGetCustomerProfile(accountId, role);
  const { data: bookings, isLoading: isBookingLoading } = useBookingHistory();

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
              ) : customer ? (
                <>
                  {activeTab === "personal" && (
                    <div style={{ textAlign: "center" }}>
                      <Avatar
                        size={100}
                        src={customer.image}
                        icon={!customer.image ? <UserOutlined /> : undefined}
                      />
                      <h3 style={{ marginTop: 10 }}>{customer.name}</h3>
                      <p>
                        <strong>Email:</strong> {customer.email}
                      </p>
                      <p>
                        <strong>Số điện thoại:</strong> {customer.phoneNumber}
                      </p>
                      <p>
                        <strong>Tên tài khoản:</strong> {customer.accountName}
                      </p>
                    </div>
                  )}
                  {activeTab === "schedule" &&
                    (isBookingLoading ? (
                      <Spin tip="Đang tải lịch sử đặt lịch..." />
                    ) : (
                      <List
                        itemLayout="horizontal"
                        dataSource={bookings}
                        renderItem={(booking) => (
                          <List.Item>
                            <List.Item.Meta
                              title={`Dịch vụ: ${booking.serviceName}`}
                              description={`Thời gian: ${booking.date} - Trạng thái: ${booking.status}`}
                            />
                          </List.Item>
                        )}
                      />
                    ))}
                  {activeTab === "password" && (
                    <p>Thay đổi mật khẩu của khách hàng</p>
                  )}
                </>
              ) : (
                <Alert
                  message="Không tìm thấy dữ liệu khách hàng"
                  type="warning"
                />
              )}
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ProfilePage;

/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Card, Spin, Alert, Avatar, List, Button } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useGetCustomerProfile } from "../features/authentication/hooks/useGetCustomerProfile";
import { useBookingHistory } from "../features/user/hook/useBookingHistory";
import { BookingDto } from "../features/booking/dto/booking.dto";
import { PagePath } from "../enums/page-path.enum";
import useAuthStore from "../features/authentication/hooks/useAuthStore";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

const { Sider, Content } = Layout;

const CustomerProfile = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "personal";
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    data: profileData,
    isPending,
    error,
  } = useGetCustomerProfile(user?.accountId, user?.role);

  const profile = Array.isArray(profileData) ? profileData[0] : undefined;
  const customers = profile?.customer?.[0] ?? null;

  console.log("Profile Data:", JSON.stringify(profileData, null, 2));

  if (isPending) {
    return (
      <Spin
        size="large"
        className="flex justify-center items-center h-screen"
      />
    );
  }

  if (error) {
    return <p className="text-red-500">Lỗi: {error.message}</p>;
  }

  const {
    data: bookings,
    isLoading: isBookingLoading,
    isError: isBookingError,
    error: bookingError,
  } = useBookingHistory();

  const handleNavigateToBookingDetail = (bookingId: number) => {
    navigate(`${PagePath.CUSTOMER_BOOKING_DETAIL}?tab=schedule`, {
      state: { bookingId },
    });
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f1eb" }}>
      <Layout>
        <Sider width={250} theme="light" style={{ background: "#fff" }}>
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            onClick={(e) => {
              setActiveTab(e.key);
              navigate(`?tab=${e.key}`);
            }}
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

        <Layout style={{ padding: "24px", background: "#f5f1eb" }}>
          <Content
            style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}
          >
            <Card title="Hồ sơ khách hàng" bordered={false}>
              {activeTab === "personal" && (
                <div style={{ textAlign: "center" }}>
                  <Avatar size={100} src={customers?.image} />
                  <h3 style={{ marginTop: 10 }}>{customers?.name}</h3>
                  <p>
                    <strong>Email:</strong> {customers?.email}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {customers?.phoneNumber}
                  </p>
                  <p>
                    <strong>Tên tài khoản:</strong> {profile?.accountName}
                  </p>
                </div>
              )}

              {activeTab === "schedule" && (
                <>
                  {isBookingLoading ? (
                    <Spin tip="Đang tải lịch sử đặt lịch..." />
                  ) : isBookingError ? (
                    <Alert
                      message={
                        bookingError?.message || "Lỗi tải lịch sử đặt lịch"
                      }
                      type="error"
                    />
                  ) : bookings && bookings.length > 0 ? (
                    <List
                      itemLayout="horizontal"
                      dataSource={bookings}
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "30", "40"],
                      }}
                      renderItem={(booking: BookingDto) => (
                        <List.Item
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleNavigateToBookingDetail(booking.bookingId)
                          }
                          actions={[
                            <Button
                              type="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigateToBookingDetail(
                                  booking.bookingId
                                );
                              }}
                            >
                              Xem Chi Tiết
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            title={`Dịch vụ: ${booking.serviceName}`}
                            description={`Ngày: ${dayjs(booking.date).format(
                              "DD-MM-YYYY"
                            )} | Trạng thái: ${booking.status} | Địa điểm: ${
                              booking.location
                            }`}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Alert
                      message="Không có lịch sử đặt lịch."
                      type="warning"
                    />
                  )}
                </>
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

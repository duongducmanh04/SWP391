import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Card,
  Spin,
  Alert,
  Avatar,
  List,
  Button,
  Pagination,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useGetCustomerProfile } from "../features/user/hook/useGetCustomerProfile";
import { useBookingHistory } from "../features/booking/hooks/useBookingHistory";
import { useGetCustomerId } from "../features/user/hook/useGetCustomerId";
import { BookingDto } from "../features/booking/dto/booking.dto";

const { Sider, Content } = Layout;
const PAGE_SIZE = 5; // Số lượng booking mỗi trang

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBookings, setCurrentBookings] = useState<BookingDto[]>([]);
  const navigate = useNavigate();
  const accountId = 7;
  const role = "Customer";

  const {
    customerId,
    isLoading: isCustomerIdLoading,
    error: customerIdError,
  } = useGetCustomerId();

  const {
    data: customer,
    isLoading: isCustomerLoading,
    isError: isCustomerError,
    error: customerError,
  } = useGetCustomerProfile(accountId, role);

  const {
    data: bookings,
    isLoading: isBookingLoading,
    isError: isBookingError,
    error: bookingError,
  } = useBookingHistory();

  useEffect(() => {
    if (bookings) {
      setCurrentBookings(
        bookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
      );
    }
  }, [bookings, currentPage]);

  const handleNavigateToBookingDetail = (bookingId: number) => {
    const url = `/CustomerBookingDetail/${bookingId}`;
    console.log("🔍 Điều hướng đến:", url);
    navigate(url);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f1eb" }}>
      <Layout>
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

        <Layout style={{ padding: "24px", background: "#f5f1eb" }}>
          <Content
            style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}
          >
            <Card title="Hồ sơ khách hàng" bordered={false}>
              {isCustomerIdLoading ? (
                <Spin tip="Đang tải thông tin khách hàng..." />
              ) : customerIdError ? (
                <Alert
                  message={`Lỗi: ${customerIdError.message}`}
                  type="error"
                />
              ) : (
                <p>Customer ID: {customerId}</p>
              )}

              {isCustomerLoading ? (
                <Spin tip="Đang tải dữ liệu khách hàng..." />
              ) : isCustomerError ? (
                <Alert
                  message={
                    customerError?.message || "Lỗi tải dữ liệu khách hàng"
                  }
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
                        <>
                          <List
                            itemLayout="horizontal"
                            dataSource={currentBookings}
                            renderItem={(booking: BookingDto) => (
                              <List.Item
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNavigateToBookingDetail(
                                    booking.bookingId
                                  );
                                }}
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
                                  description={`Ngày: ${booking.date} | Trạng thái: ${booking.status} | Địa điểm: ${booking.location}`}
                                />
                              </List.Item>
                            )}
                          />

                          <Pagination
                            current={currentPage}
                            total={bookings ? bookings.length : 0}
                            pageSize={PAGE_SIZE}
                            onChange={(page) => setCurrentPage(page)}
                            style={{ textAlign: "center", marginTop: "20px" }}
                          />
                        </>
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

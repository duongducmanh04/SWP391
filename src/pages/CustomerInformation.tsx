import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Card,
  Spin,
  Alert,
  List,
  Button,
  Pagination,
  Input,
  message,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useBookingHistory } from "../features/booking/hooks/useBookingHistory";
import { BookingDto } from "../features/booking/dto/booking.dto";

const { Sider, Content } = Layout;
const PAGE_SIZE = 5;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBookings, setCurrentBookings] = useState<BookingDto[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
  });
  const [tempInfo, setTempInfo] = useState({ ...customerInfo });

  const navigate = useNavigate();
  const { data: bookings, isLoading, isError, error } = useBookingHistory();

  useEffect(() => {
    if (bookings) {
      setCurrentBookings(
        bookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
      );
    }
  }, [bookings, currentPage]);

  const handleNavigateToBookingDetail = (bookingId: number) => {
    navigate(`/CustomerBookingDetail/${bookingId}`);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setTempInfo({ ...customerInfo });
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    setCustomerInfo({ ...tempInfo });
    setIsEditing(false);
    message.success("Cập nhật thông tin thành công!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempInfo({ ...tempInfo, [e.target.name]: e.target.value });
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f1eb" }}>
      <Layout>
        <Sider width={250} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            onClick={(e) => setActiveTab(e.key)}
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

        <Layout style={{ padding: "24px" }}>
          <Content
            style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}
          >
            {activeTab === "personal" ? (
              <Card
                title="Thông tin cá nhân"
                style={{ maxWidth: 600, margin: "0 auto" }}
              >
                <div style={{ marginBottom: 10 }}>
                  <b>Tên:</b>{" "}
                  {isEditing ? (
                    <Input
                      name="name"
                      value={tempInfo.name}
                      onChange={handleChange}
                      style={{ width: "100%" }}
                    />
                  ) : (
                    customerInfo.name
                  )}
                </div>

                <div style={{ marginBottom: 10 }}>
                  <b>Email:</b>{" "}
                  {isEditing ? (
                    <Input
                      name="email"
                      value={tempInfo.email}
                      onChange={handleChange}
                      style={{ width: "100%" }}
                    />
                  ) : (
                    customerInfo.email
                  )}
                </div>

                <div style={{ marginBottom: 10 }}>
                  <b>Số điện thoại:</b>{" "}
                  {isEditing ? (
                    <Input
                      name="phone"
                      value={tempInfo.phone}
                      onChange={handleChange}
                      style={{ width: "100%" }}
                    />
                  ) : (
                    customerInfo.phone
                  )}
                </div>

                <div style={{ marginTop: 20, textAlign: "center" }}>
                  {isEditing ? (
                    <>
                      <Button
                        type="primary"
                        onClick={handleSaveClick}
                        style={{ marginRight: 10 }}
                      >
                        Cập nhật
                      </Button>
                      <Button onClick={handleCancelClick}>Hủy</Button>
                    </>
                  ) : (
                    <Button type="primary" onClick={handleEditClick}>
                      Sửa thông tin
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <Card title="Lịch sử đặt lịch" bordered={false}>
                {isLoading ? (
                  <Spin tip="Đang tải lịch sử đặt lịch..." />
                ) : isError ? (
                  <Alert
                    message={error?.message || "Lỗi tải lịch sử đặt lịch"}
                    type="error"
                  />
                ) : bookings && bookings.length > 0 ? (
                  <>
                    <List
                      dataSource={currentBookings}
                      renderItem={(booking: BookingDto) => (
                        <List.Item
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                            padding: "12px",
                            marginBottom: "10px",
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <div>
                            <b>Dịch vụ:</b> {booking.serviceName}
                          </div>
                          <div>
                            <b>Ngày đặt:</b> {booking.date}
                          </div>
                          <div>
                            <b>Trạng thái:</b> {booking.status}
                          </div>
                          <div>
                            <b>Địa điểm:</b> {booking.location}
                          </div>
                          <Button
                            type="primary"
                            style={{ marginTop: "10px", alignSelf: "start" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigateToBookingDetail(booking.bookingId);
                            }}
                          >
                            Xem Chi Tiết
                          </Button>
                        </List.Item>
                      )}
                    />
                    <Pagination
                      current={currentPage}
                      total={bookings.length}
                      pageSize={PAGE_SIZE}
                      onChange={(page) => setCurrentPage(page)}
                      style={{ textAlign: "center", marginTop: "20px" }}
                    />
                  </>
                ) : (
                  <Alert message="Không có lịch sử đặt lịch." type="warning" />
                )}
              </Card>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ProfilePage;

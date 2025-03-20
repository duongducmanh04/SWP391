import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Card,
  Spin,
  Alert,
  Avatar,
  List,
  Button,
  Input,
  message,
} from "antd";
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
import axios from "axios";

const { Sider, Content } = Layout;

const CustomerProfile = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "personal";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    data: profileData,
    isPending,
    error,
  } = useGetCustomerProfile(user?.accountId, user?.role);
  const profile = Array.isArray(profileData) ? profileData[0] : undefined;
  const customers = profile?.customer?.[0] ?? null;

  const {
    data: bookings,
    isLoading: isBookingLoading,
    isError: isBookingError,
    error: bookingError,
  } = useBookingHistory();

  const handleNavigateToBookingDetail = (bookingId: string | number) => {
    navigate(`${PagePath.CUSTOMER_BOOKING_DETAIL}?tab=schedule`, {
      state: { bookingId },
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      name: customers?.name || "",
      email: customers?.email || "",
      phoneNumber: customers?.phoneNumber || "",
    });
  };

  const handleCancelClick = () => setIsEditing(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateClick = async () => {
    try {
      await axios.put(
        `https://localhost:7071/updateCustomer/${customers?.customerId}`,
        formData
      );
      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (err) {
      console.error(err); // In lỗi ra console (hoặc có thể xóa đi)
      message.error("Cập nhật thông tin thất bại!");
    }
  };

  if (isPending)
    return (
      <Spin
        size="large"
        className="flex justify-center items-center h-screen"
      />
    );
  if (error) return <p className="text-red-500">Lỗi: {error.message}</p>;

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
                  {isEditing ? (
                    <div>
                      <Input
                        placeholder="Tên"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={{ marginBottom: 10 }}
                      />
                      <Input
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={{ marginBottom: 10 }}
                      />
                      <Input
                        placeholder="Số điện thoại"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        style={{ marginBottom: 10 }}
                      />
                      <Button type="primary" onClick={handleUpdateClick}>
                        Cập nhật
                      </Button>
                      <Button
                        style={{ marginLeft: 10 }}
                        onClick={handleCancelClick}
                      >
                        Hủy
                      </Button>
                    </div>
                  ) : (
                    <>
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
                      <Button type="primary" onClick={handleEditClick}>
                        Sửa thông tin
                      </Button>
                    </>
                  )}
                </div>
              )}
              {activeTab === "schedule" &&
                (isBookingLoading ? (
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
                    itemLayout="vertical"
                    dataSource={bookings}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      pageSizeOptions: ["5", "10", "20"],
                    }}
                    renderItem={(booking) => (
                      <List.Item
                        style={{
                          cursor: "pointer",
                          padding: "16px",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          marginBottom: "12px",
                        }}
                        onClick={() =>
                          handleNavigateToBookingDetail(booking.bookingId)
                        }
                      >
                        <List.Item.Meta
                          title={<strong>{booking.serviceName}</strong>}
                          description={
                            <>
                              <p>
                                <strong>Ngày:</strong>{" "}
                                {dayjs(booking.date).format("DD-MM-YYYY")}
                              </p>
                              <p>
                                <strong>Trạng thái:</strong> {booking.status}
                              </p>
                              <p>
                                <strong>Địa điểm:</strong> {booking.location}
                              </p>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Alert message="Không có lịch sử đặt lịch." type="warning" />
                ))}
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default CustomerProfile;

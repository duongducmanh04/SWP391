import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Card,
  Spin,
  Avatar,
  List,
  Button,
  Input,
  message,
  Alert,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useBookingHistory } from "../features/user/hook/useBookingHistory";
import { PagePath } from "../enums/page-path.enum";
import useAuthStore from "../features/authentication/hooks/useAuthStore";
import { useGetCustomerById } from "../features/user/hook/useGetCustomerById";
import { useUpdateCustomerById } from "../features/user/hook/useUpdateCustomerById";
import dayjs from "dayjs";
import axios from "axios";

const { Sider, Content } = Layout;
type TabKey = "personal" | "schedule" | "password";

const CustomerProfile = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = (searchParams.get("tab") as TabKey) || "personal";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const customerId = user?.accountId ?? 0;
  const { data: customer, isPending, error, refetch } = useGetCustomerById();
  const updateCustomer = useUpdateCustomerById();
  const { data: bookings, isLoading: isBookingLoading } = useBookingHistory();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  // Lấy dữ liệu khi user?.accountId thay đổi
  useEffect(() => {
    if (user?.accountId) {
      refetch();
    }
  }, [user?.accountId, refetch]);

  // Cập nhật formData ngay khi API trả về dữ liệu
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phoneNumber: customer.phoneNumber?.toString() || "",
      });
    }
  }, [customer]);

  const handleTabChange = (key: string) => {
    setActiveTab(key as TabKey);
    navigate(`?tab=${key}`);
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => setIsEditing(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateClick = async () => {
    try {
      const updatedData = {
        customerId: customer?.customerId ?? 0,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        skintypeId: customer?.skintypeId ?? 0,
        accountId: customer?.accountId ?? 0,
        image: customer?.image || "",
      };

      await updateCustomer.mutateAsync(updatedData);
      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      refetch();
    } catch (error) {
      message.error("Cập nhật thông tin thất bại!");
    }
  };

  const handleNavigateToBookingDetail = (bookingId: number) => {
    navigate(`${PagePath.CUSTOMER_BOOKING_DETAIL}?tab=schedule`, {
      state: { bookingId },
    });
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
            onClick={(e) => handleTabChange(e.key)}
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
                  <Avatar size={100} src={customer?.image} />
                  {isEditing ? (
                    <div>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={{ marginBottom: 10 }}
                      />
                      <Input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={{ marginBottom: 10 }}
                      />
                      <Input
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
                      <h3>{formData.name}</h3>
                      <p>
                        <strong>Email:</strong> {formData.email}
                      </p>
                      <p>
                        <strong>Số điện thoại:</strong> {formData.phoneNumber}
                      </p>
                      <Button type="primary" onClick={handleEditClick}>
                        Sửa thông tin
                      </Button>
                    </>
                  )}
                </div>
              )}

              {activeTab === "schedule" && (
                <>
                  {isBookingLoading ? (
                    <Spin tip="Đang tải lịch sử đặt lịch..." />
                  ) : bookings?.length > 0 ? (
                    <List
                      itemLayout="vertical"
                      dataSource={bookings}
                      pagination={{
                        pageSize: 5, // Số lượng booking hiển thị trên mỗi trang
                      }}
                      renderItem={(booking) => (
                        <List.Item
                          onClick={() =>
                            handleNavigateToBookingDetail(booking.bookingId)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <List.Item.Meta
                            title={<strong>{booking.serviceName}</strong>}
                          />
                          <p>
                            <strong>Ngày:</strong>{" "}
                            {dayjs(booking.date).format("DD-MM-YYYY")}
                          </p>
                          <p>
                            <strong>Trạng thái:</strong> {booking.status}
                          </p>
                          <Button
                            onClick={() =>
                              handleNavigateToBookingDetail(booking.bookingId)
                            }
                          >
                            Xem chi tiết
                          </Button>
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
                <p>Chức năng đổi mật khẩu sẽ được cập nhật sau!</p>
              )}
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default CustomerProfile;

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
import { CustomerDto } from "../features/user/hook/useGetCustomerById";

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

  const customerId = user?.accountId ?? 0; // Lấy ID khách hàng từ user
  const { data: customer, isPending, error, refetch } = useGetCustomerById();

  const updateCustomer = useUpdateCustomerById();
  const { data: bookings } = useBookingHistory();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  // 🛠 Kiểm tra và gọi lại API khi user?.accountId thay đổi
  useEffect(() => {
    if (user?.accountId) {
      refetch();
    }
  }, [user?.accountId, refetch]);

  // 🚀 Cập nhật formData ngay khi API trả về dữ liệu
  useEffect(() => {
    if (customer) {
      console.log("🆕 Cập nhật dữ liệu từ API:", customer);
      setFormData((prev) => ({
        ...prev, // Giữ lại giá trị cũ nếu API không trả về đủ dữ liệu
        name: customer.name || prev.name || "",
        email: customer.email || prev.email || "",
        phoneNumber: customer.phoneNumber?.toString() || prev.phoneNumber || "",
      }));
    }
  }, [customer]);

  const handleTabChange = (key: string) => {
    setActiveTab(key as TabKey);
    navigate(`?tab=${key}`);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async () => {
    try {
      const updatedData: CustomerDto = {
        customerId: customer?.customerId ?? 0,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        skintypeId: customer?.skintypeId ?? 0,
        accountId: customer?.accountId ?? 0,
        image: customer?.image || "",
      };

      console.log("📤 Dữ liệu gửi API:", updatedData);

      await updateCustomer.mutateAsync(updatedData);
      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("❌ Lỗi cập nhật:", error);
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
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        style={{ marginBottom: 10 }}
                      />
                      <Input
                        name="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        style={{ marginBottom: 10 }}
                      />
                      <Input
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                        style={{ marginBottom: 10 }}
                      />
                      <Button type="primary" onClick={handleUpdateClick}>
                        Cập nhật
                      </Button>
                      <Button
                        style={{ marginLeft: 10 }}
                        onClick={() => setIsEditing(false)}
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
                <List
                  dataSource={bookings || []}
                  renderItem={(booking) => (
                    <List.Item>
                      <List.Item.Meta
                        title={`Lịch đặt #${booking.bookingId}`}
                        description={`Ngày: ${booking.date}`}
                      />
                      <Button
                        onClick={() =>
                          navigate(
                            `${PagePath.CUSTOMER_BOOKING_DETAIL}?tab=schedule`,
                            { state: { bookingId: booking.bookingId } }
                          )
                        }
                      >
                        Xem chi tiết
                      </Button>
                    </List.Item>
                  )}
                />
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

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Layout,
//   Menu,
//   Card,
//   Spin,
//   Alert,
//   List,
//   Button,
//   Pagination,
//   Input,
//   message,
// } from "antd";
// import {
//   UserOutlined,
//   ClockCircleOutlined,
//   LockOutlined,
// } from "@ant-design/icons";
// import { useBookingHistory } from "../features/booking/hooks/useBookingHistory";
// import { BookingDto } from "../features/booking/dto/booking.dto";
// import type { MenuProps } from "antd";
// import "../style/CustomerInformation.css"; // ✅ Import file CSS mới

// const { Sider, Content } = Layout;
// const PAGE_SIZE = 5;

// const ProfilePage = () => {
//   const [activeTab, setActiveTab] = useState("personal");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [currentBookings, setCurrentBookings] = useState<BookingDto[]>([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [customerInfo, setCustomerInfo] = useState({
//     name: "Nguyễn Văn A",
//     email: "nguyenvana@example.com",
//     phone: "0123456789",
//   });
//   const [tempInfo, setTempInfo] = useState({ ...customerInfo });

//   const navigate = useNavigate();
//   const { data: bookings, isLoading, isError, error } = useBookingHistory();

//   useEffect(() => {
//     if (bookings) {
//       setCurrentBookings(
//         bookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
//       );
//     }
//   }, [bookings, currentPage]);

//   const handleMenuClick: MenuProps["onClick"] = (e) => {
//     setActiveTab(e.key);
//   };

//   const handleEditClick = () => setIsEditing(true);
//   const handleCancelClick = () => {
//     setTempInfo({ ...customerInfo });
//     setIsEditing(false);
//   };
//   const handleSaveClick = () => {
//     setCustomerInfo({ ...tempInfo });
//     setIsEditing(false);
//     message.success("Cập nhật thông tin thành công!");
//   };
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTempInfo({ ...tempInfo, [e.target.name]: e.target.value });
//   };

//   return (
//     <Layout className="profile-layout">
//       <Layout>
//         <Sider className="profile-sider">
//           <Menu
//             mode="inline"
//             selectedKeys={[activeTab]}
//             onClick={handleMenuClick}
//           >
//             <Menu.Item key="personal" icon={<UserOutlined />}>
//               Thông tin cá nhân
//             </Menu.Item>
//             <Menu.Item key="schedule" icon={<ClockCircleOutlined />}>
//               Lịch sử đặt lịch
//             </Menu.Item>
//             <Menu.Item key="password" icon={<LockOutlined />}>
//               Đổi mật khẩu
//             </Menu.Item>
//           </Menu>
//         </Sider>

//         <Layout>
//           <Content className="profile-content">
//             {activeTab === "personal" ? (
//               <Card title="Thông tin cá nhân" className="card-container">
//                 <div>
//                   <b>Tên:</b>{" "}
//                   {isEditing ? (
//                     <Input
//                       name="name"
//                       value={tempInfo.name}
//                       onChange={handleChange}
//                       className="input-full"
//                     />
//                   ) : (
//                     customerInfo.name
//                   )}
//                 </div>
//                 <div>
//                   <b>Email:</b>{" "}
//                   {isEditing ? (
//                     <Input
//                       name="email"
//                       value={tempInfo.email}
//                       onChange={handleChange}
//                       className="input-full"
//                     />
//                   ) : (
//                     customerInfo.email
//                   )}
//                 </div>
//                 <div>
//                   <b>Số điện thoại:</b>{" "}
//                   {isEditing ? (
//                     <Input
//                       name="phone"
//                       value={tempInfo.phone}
//                       onChange={handleChange}
//                       className="input-full"
//                     />
//                   ) : (
//                     customerInfo.phone
//                   )}
//                 </div>
//                 useEffect(() => {
//   console.log("isEditing thay đổi:", isEditing);
// }, [isEditing]);
//                 return (
//                 <div className="text-center">
//                   {isEditing ? (
//                     <>
//                       <Button
//                         type="primary"
//                         onClick={handleSaveClick}
//                         style={{ marginRight: 10 }}
//                       >
//                         Cập nhật
//                       </Button>
//                       <Button onClick={handleCancelClick}>Hủy</Button>
//                     </>
//                   ) : (
//                     <Button type="primary" onClick={handleEditClick}>
//                       Sửa thông tin
//                     </Button>
//                   )}
//                 </div>
//                 );
//               </Card>
//             ) : (
//               <Card title="Lịch sử đặt lịch">
//                 {isLoading ? (
//                   <Spin tip="Đang tải lịch sử đặt lịch..." />
//                 ) : isError ? (
//                   <Alert
//                     message={error?.message || "Lỗi tải lịch sử đặt lịch"}
//                     type="error"
//                   />
//                 ) : bookings && bookings.length > 0 ? (
//                   <>
//                     <List
//                       dataSource={currentBookings}
//                       renderItem={(booking: BookingDto) => (
//                         <List.Item className="booking-list-item">
//                           <div className="booking-info">
//                             <div className="booking-row">
//                               <b>Dịch vụ:</b> {booking.serviceName}
//                             </div>
//                             <div className="booking-row">
//                               <b>Ngày đặt:</b> {booking.date}
//                             </div>
//                             <div className="booking-row">
//                               <b>Trạng thái:</b> {booking.status}
//                             </div>
//                             <div className="booking-row">
//                               <b>Địa điểm:</b> {booking.location}
//                             </div>
//                           </div>
//                           <Button
//                             type="primary"
//                             className="booking-button"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               navigate(
//                                 `/CustomerBookingDetail/${booking.bookingId}`
//                               );
//                             }}
//                           >
//                             Xem Chi Tiết
//                           </Button>
//                         </List.Item>
//                       )}
//                     />

//                     <Pagination
//                       current={currentPage}
//                       total={bookings.length}
//                       pageSize={PAGE_SIZE}
//                       onChange={(page) => setCurrentPage(page)}
//                       className="pagination-container"
//                     />
//                   </>
//                 ) : (
//                   <Alert message="Không có lịch sử đặt lịch." type="warning" />
//                 )}
//               </Card>
//             )}
//           </Content>
//         </Layout>
//       </Layout>
//     </Layout>
//   );
// };

// export default ProfilePage;

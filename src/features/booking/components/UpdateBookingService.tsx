import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Select, Button, Typography, message } from "antd";
// import { useGetBookingById } from "../hooks/useGetBookingById";
// import { useUpdateBookingService } from "../hooks/useUpdateBookingService";
// import { useGetServices } from "../hooks/useGetServices";

const { Title, Text } = Typography;

const UpdateBookingService = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const mockBooking = {
    bookingId: "123",
    customerName: "Nguyễn Văn A",
    date: "2024-02-20 14:30",
    serviceId: 2,
    serviceName: "Massage Thái",
  };

  const mockServices = [
    { id: 1, name: "Cắt tóc nam" },
    { id: 2, name: "Massage Thái" },
    { id: 3, name: "Làm móng tay" },
    { id: 4, name: "Chăm sóc da mặt" },
  ];

  useEffect(() => {
    // Giả lập dữ liệu booking từ API
    if (mockBooking) {
      setSelectedService(mockBooking.serviceId);
    }
  }, []);

  const handleUpdate = () => {
    if (!selectedService) {
      message.error("Vui lòng chọn dịch vụ!");
      return;
    }

    // Giả lập cập nhật dịch vụ
    message.success("Cập nhật dịch vụ thành công!");
    navigate("/bookings");
  };

  //   const { data: booking, isLoadingBooking } = useGetBookingById(bookingId);
  //   const { data: services, isLoadingService } = useGetServices();
  //   const { mutate: updateService } = useUpdateBookingService();

  //   useEffect(() => {
  //     if (booking) {
  //       setSelectedService(booking.serviceId);
  //     }
  //   }, [booking]);

  //   const handleUpdate = () => {
  //     if (!selectedService) {
  //       message.error("Vui lòng chọn dịch vụ!");
  //       return;
  //     }

  //     updateService(
  //       { bookingId, serviceId: selectedService },
  //       {
  //         onSuccess: () => {
  //           message.success("Cập nhật dịch vụ thành công!");
  //           navigate("/bookings");
  //         },
  //         onError: () => {
  //           message.error("Cập nhật thất bại, vui lòng thử lại!");
  //         },
  //       }
  //     );
  //   };

  //   if (isLoading) return <p>Loading...</p>;
  return (
    <Card title="Cập nhật dịch vụ" style={{ maxWidth: 600, margin: "auto" }}>
      <Title level={4}>Khách hàng: {mockBooking.customerName}</Title>
      <Text>Thời gian: {mockBooking.date}</Text>
      <br />
      <Text>Dịch vụ hiện tại: {mockBooking.serviceName}</Text>

      <Select
        style={{ width: "100%", marginTop: 16 }}
        value={selectedService}
        onChange={setSelectedService}
        options={mockServices.map((service) => ({
          label: service.name,
          value: service.id,
        }))}
      />

      <Button type="primary" onClick={handleUpdate} style={{ marginTop: 16 }}>
        Cập nhật
      </Button>
    </Card>
  );
  //   return (
  //     <Card title="Cập nhật dịch vụ" style={{ maxWidth: 600, margin: "auto" }}>
  //       <Title level={4}>Khách hàng: {booking?.customerName}</Title>
  //       <Text>Thời gian: {booking?.date}</Text>
  //       <br />
  //       <Text>Dịch vụ hiện tại: {booking?.serviceName}</Text>

  //       <Select
  //         style={{ width: "100%", marginTop: 16 }}
  //         value={selectedService}
  //         onChange={setSelectedService}
  //         options={services?.map((service) => ({
  //           label: service.name,
  //           value: service.id,
  //         }))}
  //       />

  //       <Button type="primary" onClick={handleUpdate} style={{ marginTop: 16 }}>
  //         Cập nhật
  //       </Button>
  //     </Card>
  //   );
};

export default UpdateBookingService;

// import { Card, Typography, Row, Col, Image, Divider, Spin } from "antd";
// import { useLocation } from "react-router-dom";
// import { useTherapistById } from "../hooks/useGetTherapistId";

// const { Title, Text } = Typography;

// const SkinTherapistDetail = () => {
//   // const { skintherapistId } = useParams();
//   const location = useLocation();
//   const { skintherapistId } = location.state || {};
//   const {
//     data: therapist,
//     isLoading,
//     isError,
//   } = useTherapistById(skintherapistId || "");

//   if (isLoading) {
//     return <Spin size="large" />;
//   }

//   if (isError || !therapist) {
//     return <div>Không tìm thấy thông tin chuyên viên chăm sóc da</div>;
//   }

//   return (
//     <div style={{ padding: "20px", backgroundColor: "#FBFEFB" }}>
//       <Card
//         style={{
//           maxWidth: 1200,
//           margin: "20px auto",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         }}
//         bodyStyle={{ padding: 24 }}
//       >
//         <Row gutter={24}>
//           <Col xs={24} md={10}>
//             <Image
//               src={therapist.image}
//               alt={therapist.name}
//               style={{ borderRadius: 8 }}
//             />
//           </Col>
//           <Col xs={24} md={14}>
//             <Title level={2} style={{ marginBottom: 16 }}>
//               {therapist.name}
//             </Title>
//             <Text style={{ fontSize: 16, color: "#555" }}>
//               {therapist.speciality}
//             </Text>
//             <Divider />
//             <div style={{ marginBottom: 16 }}>
//               <Text strong>Email:</Text> {therapist.email}
//             </div>
//             <Divider />
//             <div style={{ marginBottom: 16 }}>
//               <Text strong>Kinh nghiệm:</Text> {therapist.experience}
//             </div>
//             <Divider />
//             <div style={{ marginBottom: 16 }}>
//               <Text strong>Bằng cấp:</Text> {therapist.degree}
//             </div>
//             <Divider />
//             <div style={{ marginBottom: 16 }}>
//               <Text strong>Chuyên môn:</Text> {therapist.expertise}
//             </div>
//           </Col>
//         </Row>
//       </Card>
//     </div>
//   );
// };

// export default SkinTherapistDetail;
import { Card, Typography, Row, Col, Image, Divider, Spin, List } from "antd";
import { useLocation } from "react-router-dom";
import { useTherapistById } from "../hooks/useGetTherapistId";
import { useGetServiceByTherapistId } from "../../services/hooks/useGetServiceByTherapistId";

const { Title, Text } = Typography;

const SkinTherapistDetail = () => {
  const location = useLocation();
  const { skintherapistId } = location.state || {};

  // Lấy thông tin chuyên viên
  const {
    data: therapist,
    isLoading: therapistLoading,
    isError: therapistError,
  } = useTherapistById(skintherapistId || "");

  // Lấy các dịch vụ của chuyên viên
  const {
    data: services,
    isLoading: servicesLoading,
    isError: servicesError,
  } = useGetServiceByTherapistId(skintherapistId || "");

  if (therapistLoading || servicesLoading) return <Spin size="large" />;
  if (therapistError || !therapist)
    return <div>Không tìm thấy thông tin chuyên viên chăm sóc da</div>;
  if (servicesError)
    return <div>Không thể lấy danh sách dịch vụ của chuyên viên</div>;

  return (
    <div style={{ padding: "20px" }}>
      <Card
        style={{
          maxWidth: 1200,
          margin: "20px auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: 24,
        }}
      >
        <Row gutter={24}>
          <Col xs={24} md={10}>
            <Image
              src={therapist.image}
              alt={therapist.name}
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} md={14}>
            <Title level={2}>{therapist.name}</Title>
            <Text>{therapist.speciality}</Text>
            <Divider />
            <Text strong>Email:</Text> {therapist.email}
            <Divider />
            <Text strong>Kinh nghiệm:</Text> {therapist.experience}
            <Divider />
            <Text strong>Bằng cấp:</Text> {therapist.degree}
            <Divider />
            <Title level={4}>Dịch vụ có thể thực hiện:</Title>
            <List
              dataSource={services}
              renderItem={(service) => (
                <List.Item>
                  <div>
                    <Text strong>{service.name}</Text> - {service.description}
                  </div>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SkinTherapistDetail;

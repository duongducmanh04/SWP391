import { Card, Typography, Row, Col, Image, Divider, Spin } from "antd";
import { useParams } from "react-router-dom";
import { useTherapistById } from "../hooks/useGetTherapistId";

const { Title, Text } = Typography;

const SkinTherapistDetail = () => {
  const { skintherapistId } = useParams();
  const {
    data: therapist,
    isLoading,
    isError,
  } = useTherapistById(skintherapistId || "");

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (isError || !therapist) {
    return <div>Không tìm thấy thông tin chuyên viên chăm sóc da</div>;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#FBFEFB" }}>
      <Card
        style={{
          maxWidth: 1200,
          margin: "20px auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: 24 }}
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
            <Title level={2} style={{ marginBottom: 16 }}>
              {therapist.name}
            </Title>
            <Text style={{ fontSize: 16, color: "#555" }}>
              {therapist.speciality}
            </Text>
            <Divider />
            <div style={{ marginBottom: 16 }}>
              <Text strong>Email:</Text> {therapist.email}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SkinTherapistDetail;

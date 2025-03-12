/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Typography, Button, List, Divider, Spin } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTherapists } from "../hooks/useGetTherapist";
import { useTherapistStore } from "../hooks/useTherapistStore";
import { useGetServiceByTherapistId } from "../../services/hooks/useGetServiceByTherapistId";
import { PagePath } from "../../../enums/page-path.enum";

const { Title, Text } = Typography;

const SkinTherapistList = () => {
  const navigate = useNavigate();
  const {
    data: therapistData,
    isLoading: isLoadingTherapist,
    error: errorTherapist,
  } = useTherapists();

  const { setTherapists } = useTherapistStore();

  const handleNavigate = (skintherapistId: number) => {
    navigate(PagePath.SKIN_THERAPIST_DETAIL, {
      state: { skintherapistId },
    });
  };

  useEffect(() => {
    if (therapistData && !isLoadingTherapist && !errorTherapist) {
      setTherapists(therapistData);
    }
  }, [therapistData, isLoadingTherapist, errorTherapist, setTherapists]);

  if (isLoadingTherapist) return <Spin size="large" />;
  if (errorTherapist) return <div>Không thể lấy danh sách chuyên viên</div>;

  return (
    <div style={{ padding: "20px" }}>
      <Title
        level={2}
        style={{ textAlign: "center", marginBottom: "30px", color: "#6f4e37" }}
      >
        Chọn chuyên viên trị liệu da cho bạn
      </Title>
      <Row gutter={[16, 16]}>
        {therapistData?.map((therapist) => (
          <TherapistCard
            key={therapist.skintherapistId}
            therapist={therapist}
            handleNavigate={handleNavigate}
          />
        ))}
      </Row>
    </div>
  );
};

const TherapistCard = ({ therapist, handleNavigate }: any) => {
  const {
    data: services,
    isLoading,
    isError,
  } = useGetServiceByTherapistId(therapist.skintherapistId);

  return (
    <Col xs={24} sm={12} md={8} lg={6}>
      <Card
        hoverable
        style={{ borderRadius: "10px", textAlign: "center" }}
        cover={
          <img
            alt={therapist.name}
            src={therapist.image}
            style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              objectFit: "cover",
              width: "70%",
              margin: "0 auto",
            }}
          />
        }
        actions={[
          <Button
            type="text"
            key="wishlist"
            onClick={() => handleNavigate(therapist.skintherapistId)}
          >
            Thông tin chi tiết
          </Button>,
        ]}
      >
        <Title level={4} style={{ marginBottom: "5px" }}>
          {therapist.name}
        </Title>
        <Text strong>{therapist.expertise}</Text>
        <br />
        <Text type="secondary">Kinh nghiệm: {therapist.experience}</Text>
        <br />
        <Text type="secondary">Bằng cấp: {therapist.degree}</Text>
        <Divider />

        <Title level={5}>Dịch vụ cung cấp:</Title>
        {isLoading ? (
          <Spin size="small" />
        ) : isError ? (
          <Text type="danger">Không thể tải dịch vụ</Text>
        ) : (
          <List
            size="small"
            dataSource={services}
            renderItem={(service: any) => (
              <List.Item>
                <Text>{service.name}</Text>
              </List.Item>
            )}
          />
        )}
      </Card>
    </Col>
  );
};

export default SkinTherapistList;

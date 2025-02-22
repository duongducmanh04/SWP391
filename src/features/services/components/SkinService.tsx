import { useEffect } from "react";
import { Card, Button, Row, Col, Typography } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useServices } from "../hooks/useGetService";
import { useServiceStore } from "../hooks/useServiceStore";

const { Title, Text } = Typography;

const SkincareServices = () => {
  const navigate = useNavigate();
  const {
    data: serviceData,
    isLoading: isLoadingService,
    error: errorService,
  } = useServices();

  const { setServices } = useServiceStore();

  const handleNavigate = (serviceId: number) => {
    navigate(`/Homepage/Service/${serviceId}`);
  };

  useEffect(() => {
    if (serviceData && !isLoadingService && !errorService) {
      setServices(serviceData);
    }
  }, [serviceData, isLoadingService, errorService, setServices]);

  return (
    <div style={{ padding: "20px" }}>
      <Title
        level={2}
        style={{ textAlign: "center", marginBottom: "30px", color: "#6f4e37" }}
      >
        Dịch Vụ Chăm Sóc Da Chuyên Nghiệp
      </Title>
      <Row gutter={[16, 16]} justify="center">
        {serviceData?.map((service) => (
          <Col
            key={service.serviceId}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            style={{ display: "flex" }}
          >
            <Card
              hoverable
              cover={
                <img
                  alt={service.name}
                  src={service.image}
                  style={{ height: 222 }}
                />
              }
              actions={[
                <Button type="text" icon={<HeartOutlined />} key="wishlist">
                  Yêu thích
                </Button>,
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  key="book"
                  onClick={() => handleNavigate(service.serviceId)}
                >
                  Đặt ngay
                </Button>,
              ]}
            >
              <Title level={4}>{service.name}</Title>
              <Text>{service.description}</Text>
              <div
                style={{
                  marginTop: "10px",
                  fontWeight: "bold",
                  color: "#fa541c",
                }}
              >
                {service.price}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SkincareServices;

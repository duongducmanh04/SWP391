import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Typography, Input } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useServices } from "../hooks/useGetService";
import { useServiceStore } from "../hooks/useServiceStore";
import { PagePath } from "../../../enums/page-path.enum";
import { ServiceDto } from "../dto/get-service.dto";

const { Title, Text } = Typography;

const SkincareServices = () => {
  const navigate = useNavigate();
  const {
    data: serviceData,
    isLoading: isLoadingService,
    error: errorService,
  } = useServices();

  const { setServices } = useServiceStore();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredTherapists, setFilteredTherapists] = useState<ServiceDto[]>(
    []
  );

  // const handleNavigate = (serviceId: number) => {
  //   navigate(`/Homepage/Service/${serviceId}`);
  // };
  const handleNavigate = (serviceId: number) => {
    navigate(PagePath.SKIN_SERVICE_DETAIL, {
      state: {
        serviceId: serviceId,
      },
    });
  };

  useEffect(() => {
    const filtered = serviceData?.filter((service: ServiceDto) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
    setFilteredTherapists(filtered || []);
  }, [searchTerm, serviceData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          justifyContent: "end",
        }}
      >
        <Input
          placeholder="Tìm kiếm dịch vụ..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ width: 300 }}
        />
      </div>
      <Row gutter={[16, 16]} justify="start">
        {filteredTherapists?.map((service) => (
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
                  style={{ background: "#af8d70" }}
                  onClick={() => handleNavigate(service.serviceId)}
                >
                  Chi tiết
                </Button>,
              ]}
              style={{ width: "-webkit-fill-available" }}
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

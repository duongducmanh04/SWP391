import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Typography, Input } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useServices } from "../hooks/useGetService";
import { useServiceStore } from "../hooks/useServiceStore";
import { useSkinTypes } from "../../skin_type/hooks/useGetSkin";
import { PagePath } from "../../../enums/page-path.enum";
import { ServiceDto } from "../dto/get-service.dto";

const { Title, Text } = Typography;
const { Option } = Select;

interface ServiceSkinType extends ServiceDto {
  skinTypeIds?: number[];
  skinTypeNames?: string;
}

const fetchSkinTypeByServiceId = async (
  serviceId: number
): Promise<number[]> => {
  try {
    console.log(`Fetching skin types for serviceId: ${serviceId}`);
    const response = await axios.get<SkintypeServiceDto[]>(
      `https://localhost:7071/getSkintypeServiceByServiceId/${serviceId}`
    );
    return response.data.map((item) => item.skintypeId) ?? [];
  } catch (error: unknown) {
    console.error(
      `Lỗi khi tải loại da cho serviceId ${serviceId}:`,
      error instanceof Error ? error.message : "Lỗi không xác định"
    );
    return [];
  }
};

const SkincareServices = () => {
  const navigate = useNavigate();
  const { data: serviceData } = useServices();
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
    if (serviceSkinTypes) {
      setServices(serviceSkinTypes);
      setFilteredData(serviceSkinTypes);
    }
  }, [serviceSkinTypes, setServices]);

  const handleNavigate = (serviceId: number) => {
    navigate(PagePath.SKIN_SERVICE_DETAIL, { state: { serviceId } });
  };

  return (
    <div className="skincare-container">
      <Title level={2} className="skincare-title">
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

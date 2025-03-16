import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Typography,
  Modal,
  Slider,
  Select,
} from "antd";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useServices } from "../hooks/useGetService";
import { useServiceStore } from "../hooks/useServiceStore";
import { useSkinTypes } from "../../skin_type/hooks/useGetSkin";
import { PagePath } from "../../../enums/page-path.enum";
import axios from "axios";
import { SkinDto } from "../../skin_type/dto/skin.dto";
import { ServiceDto } from "../dto/get-service.dto";
import { SkintypeServiceDto } from "../../services/dto/skintype-service.dto";

import "../../../style/Service.css";

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
  const { data: skinTypes } = useSkinTypes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedSkinType, setSelectedSkinType] = useState<number | null>(null);
  const [filteredData, setFilteredData] = useState<ServiceSkinType[]>([]);

  const { data: serviceSkinTypes, isFetching } = useQuery<ServiceSkinType[]>({
    queryKey: ["serviceSkinTypes", serviceData],
    queryFn: async () => {
      if (!serviceData || !skinTypes) return [];
      return await Promise.all(
        serviceData.map(async (service) => {
          const skinData = await fetchSkinTypeByServiceId(service.serviceId);
          const matchedSkinTypes = skinTypes.filter((st) =>
            skinData.includes(st.skintypeId)
          );
          return {
            ...service,
            skinTypeIds: skinData,
            skinTypeNames: matchedSkinTypes.length
              ? matchedSkinTypes.map((st) => st.skintypeName).join(", ")
              : "Không xác định",
          } as ServiceSkinType;
        })
      );
    },
    enabled: !!serviceData && !!skinTypes,
  });

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

      <div className="filter-container">
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Bộ lọc
        </Button>
      </div>

      <Modal
        title="Bộ lọc"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          let filtered = serviceSkinTypes || [];
          filtered = filtered.filter(
            (service) =>
              service.price >= priceRange[0] && service.price <= priceRange[1]
          );
          if (selectedSkinType !== null) {
            filtered = filtered.filter((service) =>
              service.skinTypeIds?.includes(selectedSkinType)
            );
          }
          setFilteredData(filtered);
          setIsModalOpen(false);
        }}
      >
        <Title level={4}>Lọc theo giá</Title>
        <Slider
          range
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onChange={(value) => setPriceRange(value as [number, number])}
        />

        <Title level={4} style={{ marginTop: "16px" }}>
          Lọc theo loại da
        </Title>
        <Select
          placeholder="Chọn loại da"
          allowClear
          style={{ width: "100%" }}
          value={selectedSkinType}
          onChange={(value) => setSelectedSkinType(value)}
        >
          {skinTypes?.map((skin: SkinDto) => (
            <Option key={skin.skintypeId} value={skin.skintypeId}>
              {skin.skintypeName ?? `Loại da ${skin.skintypeId}`}
            </Option>
          ))}
        </Select>
      </Modal>

      <Row gutter={[16, 16]} justify="start">
        {isFetching ? (
          <Col span={24}>
            <Text>Đang tải dữ liệu...</Text>
          </Col>
        ) : (
          filteredData.map((service) => (
            <Col key={service.serviceId} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={service.name}
                    src={service.image}
                    className="service-image"
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
                    Chi tiết
                  </Button>,
                ]}
              >
                <Title level={4}>{service.name}</Title>
                <Text>{service.description}</Text>
                <Text strong>Giá: {service.price.toLocaleString()} VNĐ</Text>
                <Text type="secondary">Loại da: {service.skinTypeNames}</Text>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default SkincareServices;

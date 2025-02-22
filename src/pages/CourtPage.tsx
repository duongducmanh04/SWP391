import { Card, Row, Col, Button, Typography } from "antd";
import { Court } from "../models/court.model";
import courtData from "../json/Court.json";
import "../style/Product.css";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const courts: Court[] = courtData;

const CourtList = () => {
  const navigate = useNavigate();

  const handleDetailClick = (courtId: number) => {
    navigate(`/Homepage/Court/${courtId}`);
  };

  return (
    <div className="product-list-container">
      <Row gutter={[16, 16]}>
        {courts.map((court) => (
          <Col xs={24} sm={12} md={8} lg={6} key={court.CourtId}>
            <Card
              hoverable
              cover={
                <img
                  alt={court.CourtName}
                  src={court.Image}
                  className="product-image"
                />
              }
              className="product-card"
            >
              <Title level={5}>{court.CourtName}</Title>
              <div className="price-container">
                <Text strong style={{ marginLeft: 8, color: "#1890ff" }}>
                  ${court.PricePerHour}
                </Text>
              </div>
              <Button
                type="primary"
                block
                style={{ marginTop: 8 }}
                onClick={() => handleDetailClick(court.CourtId)}
              >
                Detail
              </Button>
              <Button type="primary" block style={{ marginTop: 8 }}>
                Add to Cart
              </Button>
            </Card>
          </Col>
        ))}

        {/* Promotional Banners */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="promo-card">
            <Title level={4} style={{ color: "#ff4d4f" }}>
              Don't Miss It
            </Title>
            <Text>30% Sale</Text>
            <Text>On Coffee Products</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="promo-card">
            <Title level={4} style={{ color: "#ffa940" }}>
              10% Sale
            </Title>
            <Text>On Packed Fruits</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CourtList;

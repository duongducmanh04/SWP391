import { useParams } from "react-router-dom";
import { Card, Typography, Row } from "antd";
import { Court } from "../models/court.model";
import courtData from "../json/Court.json";

const { Title } = Typography;

const CourtDetail = () => {
  const { id } = useParams<{ id: string }>();
  const courtId = id ? parseInt(id, 10) : undefined;
  console.log(id);

  const court: Court | undefined = courtId
    ? courtData.find((court) => court.CourtId === courtId)
    : undefined;

  if (!court) {
    return <div>Không tìm thấy sân.</div>;
  }

  return (
    <div className="court-detail-container">
      <Card>
        <img alt={court.CourtName} src={court.Image} className="court-image" />
        <Title level={4}>{court.CourtName}</Title>
        <Row>Địa chỉ: {court.Address}</Row>
        <Row>
          Giờ mở cửa: {court.OpenTime} - {court.CloseTime}
        </Row>
        <Row>Giá mỗi giờ: ${court.PricePerHour}</Row>
        <Row>Quy tắc: {court.Rules}</Row>
        <Row>Đánh giá: {court.TotalRate}</Row>
      </Card>
    </div>
  );
};

export default CourtDetail;

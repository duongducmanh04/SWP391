/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  Spin,
  Descriptions,
  Row,
  Col,
  Breadcrumb,
  message,
  Select,
  Button,
  Table,
} from "antd";
import { useParams, Link } from "react-router-dom";
import { useBookingById } from "../hooks/useGetBookingId";
import dayjs from "dayjs";
import StatusTag from "../../../components/TagStatus";
import ActionButtons from "../../../components/ButtonStatus";
import { useCheckInBooking } from "../hooks/useCheckInBooking";
import { useCompletedBooking } from "../hooks/useCompletedBooking";
import { useCancelledBooking } from "../hooks/useCancelledBooking";
import { useDeniedBooking } from "../hooks/useDeniedBooking";
import { useFinishedBooking } from "../hooks/useFinishedBooking";
import { useEffect, useState } from "react";
import { CloseOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useUpdateServiceName } from "../hooks/useUpdateService";
import { useUpdateServiceAmount } from "../hooks/useUpdateServiceAmount";
import { useServices } from "../../services/hooks/useGetService";
import { useTherapists } from "../../skin_therapist/hooks/useGetTherapist";
import { TherapistDto } from "../../skin_therapist/dto/get-therapist.dto";
import useAuthStore from "../../authentication/hooks/useAuthStore";
import { RoleCode } from "../../../enums/role.enum";

const BookingDetail = () => {
  const { bookingId } = useParams();
  const { user } = useAuthStore();
  const { mutate: updateCheckIn } = useCheckInBooking();
  const { mutate: updateCompleted } = useCompletedBooking();
  const { mutate: updateCancelled } = useCancelledBooking();
  const { mutate: updateDenied } = useDeniedBooking();
  const { mutate: updateFinished } = useFinishedBooking();
  const { data: booking, isLoading, isError } = useBookingById(bookingId || "");
  const { data: service } = useServices();
  const { data: therapists } = useTherapists();

  const { mutate: updateServiceName } = useUpdateServiceName();
  const { mutate: updateServiceAmount } = useUpdateServiceAmount();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedServiceAmount, setSelectedServiceAmount] = useState<number>(0);

  useEffect(() => {
    if (booking) {
      setSelectedService(booking.serviceName);
      setSelectedServiceAmount(booking.amount);
    }
  }, [booking]);

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (isError || !booking) {
    return <div>Không tìm thấy lịch đặt</div>;
  }

  const therapistMap = new Map<number, TherapistDto>();
  if (therapists) {
    therapists.forEach((therapist) => {
      therapistMap.set(therapist.skintherapistId, therapist);
    });
  }

  const handleCheckIn = async (bookingId: number) => {
    updateCheckIn({ BookingId: bookingId });
  };

  const handleCompleted = async (bookingId: number) => {
    updateCompleted({ BookingId: bookingId });
  };

  const handleCancelled = async (bookingId: number) => {
    updateCancelled({ BookingId: bookingId });
  };

  const handleDenied = async (bookingId: number) => {
    updateDenied({ BookingId: bookingId });
  };

  const handleFinished = async (bookingId: number) => {
    updateFinished({ BookingId: bookingId });
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    const selected = service?.find((service) => service.name === value);
    if (selected) {
      setSelectedServiceAmount(selected.price);
    }
  };

  const handleUpdateService = () => {
    if (!selectedService) {
      message.warning("Vui lòng chọn một dịch vụ!");
      return;
    }

    updateServiceName(
      {
        bookingId: booking.bookingId,
        serviceName: selectedService,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          message.success("Cập nhật tên dịch vụ thành công");
        },
        onError: () => {
          message.error("Không thể cập nhật tên dịch vụ");
        },
      }
    );

    updateServiceAmount(
      {
        bookingId: booking.bookingId,
        amount: selectedServiceAmount,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          message.success("Cập nhật giá thành công");
        },
        onError: () => {
          message.error("Không thể cập nhật giá");
        },
      }
    );
  };

  const serviceData = [
    {
      key: "1",
      name: "Tên dịch vụ",
      value: booking.serviceName,
      editable: true,
    },
    {
      key: "2",
      name: "Giá",
      value: selectedServiceAmount,
      editable: false,
    },
    {
      key: "3",
      name: "Chuyên viên",
      value:
        therapistMap.get(booking.skintherapistId)?.name ||
        booking.skintherapistId,
      editable: false,
    },
  ];

  const serviceColumns = [
    {
      title: "Thông tin",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      render: (text: string, record: any) => {
        if (record.editable && isEditing && record.key === "1") {
          return (
            <Select
              style={{ width: "100%" }}
              value={selectedService}
              onChange={handleServiceChange}
            >
              {service?.map((service: any) => (
                <Select.Option key={service.serviceId} value={service.name}>
                  {service.name}
                </Select.Option>
              ))}
            </Select>
          );
        }
        return text;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: "20%",
      render: (_: any, record: any) => {
        if (record.editable) {
          if (isEditing && record.key === "1") {
            return (
              <>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleUpdateService}
                  style={{ marginRight: 8 }}
                >
                  Lưu
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => setIsEditing(false)}
                >
                  Hủy
                </Button>
              </>
            );
          }
          return (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedService(booking.serviceName);
                setIsEditing(true);
              }}
              disabled={isEditing}
            >
              Sửa
            </Button>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div style={{ margin: "auto" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <Link to="/Home/Booking">Danh sách đặt lịch</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết lịch đặt</Breadcrumb.Item>
      </Breadcrumb>
      <h2>Chi tiết lịch đặt #{booking.bookingId}</h2>
      <Row gutter={16}>
        <Col span={15}>
          <Card>
            <Descriptions title="Thông tin chung" bordered column={1}>
              <Descriptions.Item label="Khách hàng">
                {booking.customerId}
              </Descriptions.Item>
              <Descriptions.Item label="Điện thoại">
                {booking.amount}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {booking.location}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt lịch">
                {dayjs(booking.date).format("DD/MM/YYYY HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng thanh toán">
                <StatusTag status={booking.status} />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={9}>
          <Card>
            <p>
              <b>Trạng thái:</b>{" "}
              <StatusTag status={booking.status} showLabel={true} />
            </p>
            <ActionButtons
              status={booking.status}
              bookingId={booking.bookingId}
              onCheckIn={handleCheckIn}
              onCancelled={handleCancelled}
              onCompleted={handleCompleted}
              onDenied={handleDenied}
              onFinished={handleFinished}
            />
            <h4 style={{ marginTop: 20 }}>Lịch sử trạng thái</h4>
            <p>
              🟢 {dayjs(booking.updateAt).format("DD/MM/YYYY HH:mm:ss")} -{" "}
              {booking.status}
            </p>
          </Card>
        </Col>
      </Row>
      {user?.role == RoleCode.STAFF && (
        <Card
          title="Chi tiết dịch vụ"
          style={{ marginBottom: 16, marginTop: 16 }}
        >
          <Table
            columns={serviceColumns}
            dataSource={serviceData}
            pagination={false}
            rowKey="key"
          />
        </Card>
      )}
    </div>
  );
};

export default BookingDetail;

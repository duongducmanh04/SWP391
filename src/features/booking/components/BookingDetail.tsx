/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  Spin,
  Descriptions,
  Row,
  Col,
  Breadcrumb,
  Typography,
  message,
  Select,
  Button,
  Table,
} from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { useCustomers } from "../../user/hook/useGetCustomer";
import { CustomerDto } from "../../user/dto/customer.dto";
import useAuthStore from "../../authentication/hooks/useAuthStore";
import { RoleCode } from "../../../enums/role.enum";
import { Status } from "../../../enums/status-booking";
import TextArea from "antd/es/input/TextArea";
import { PagePath } from "../../../enums/page-path.enum";
import { useUpdateNote } from "../hooks/useUpdateNoteBooking";
// import { useUpdateTherapist } from "../hooks/useUpdateTherapist";
import { useSlots } from "../../services/hooks/useGetSlot";
import { SlotDto } from "../../services/dto/slot.dto";
import { useGetServiceByTherapistId } from "../../services/hooks/useGetServiceByTherapistId";
import { ServiceDto } from "../../services/dto/get-service.dto";
const { Title } = Typography;

const BookingDetail = () => {
  // const { bookingId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = location.state || {};
  const { mutate: updateCheckIn } = useCheckInBooking();
  const { mutate: updateCompleted } = useCompletedBooking();
  const { mutate: updateCancelled } = useCancelledBooking();
  const { mutate: updateDenied } = useDeniedBooking();
  const { mutate: updateFinished } = useFinishedBooking();
  const {
    data: booking,
    isLoading,
    isError,
    refetch,
  } = useBookingById(bookingId || "");
  const { data: service } = useServices();
  const { data: therapists } = useTherapists();
  const { data: customers } = useCustomers();
  const { data: slots } = useSlots();

  const { data: serviceTherapist } = useGetServiceByTherapistId(
    booking?.skintherapistId || 0
  );

  const { mutate: updateServiceName } = useUpdateServiceName();
  const { mutate: updateServiceAmount } = useUpdateServiceAmount();
  // const { mutate: updateTherapist } = useUpdateTherapist();
  const { mutate: updateNote, isPending: isUpdatingNote } = useUpdateNote();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  // const [selectedTherapist, setSelectedTherapist] = useState<number>(0);
  const [selectedServiceAmount, setSelectedServiceAmount] = useState<number>(0);
  const [note, setNote] = useState<string>(booking?.note || "");

  useEffect(() => {
    if (booking?.note !== undefined) {
      setNote(booking.note);
    }
  }, [booking]);

  useEffect(() => {
    if (booking) {
      setSelectedService(booking.serviceName);
      setSelectedServiceAmount(booking.amount);
      // setSelectedTherapist(booking.skintherapistId);
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

  const customerMap = new Map<number, CustomerDto>();
  if (customers) {
    customers.forEach((customer) => {
      customerMap.set(customer.customerId, customer);
    });
  }

  const slotMap = new Map<number, SlotDto>();
  if (slots) {
    slots.forEach((slot) => {
      slotMap.set(slot.bookingId, slot);
    });
  }

  const handleCheckIn = async (bookingId: number) => {
    updateCheckIn(
      { BookingId: bookingId },
      {
        onSuccess: () => {
          refetch();
          navigate(PagePath.BOOKING);
        },
      }
    );
  };

  const handleCompleted = async (bookingId: number) => {
    updateCompleted(
      { BookingId: bookingId },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleCancelled = async (bookingId: number) => {
    updateCancelled(
      { BookingId: bookingId },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleDenied = async (bookingId: number) => {
    updateDenied(
      { BookingId: bookingId },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleFinished = async (bookingId: number) => {
    updateFinished(
      { BookingId: bookingId },
      {
        onSuccess: () => {
          refetch();
          navigate(PagePath.BOOKING);
        },
      }
    );
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    const selected = service?.find((service) => service.name === value);
    if (selected) {
      setSelectedServiceAmount(selected.price);
    }
  };

  const handleUpdateNote = () => {
    updateNote(
      { bookingId: booking.bookingId, note },
      {
        onSuccess: () => {
          message.success("Cập nhật ghi chú thành công!");
          refetch();
        },
        onError: () => {
          message.error("Không thể cập nhật ghi chú!");
        },
      }
    );
  };

  const handleUpdateService = async () => {
    if (!selectedService) {
      message.warning("Vui lòng chọn một dịch vụ!");
      return;
    }

    try {
      await new Promise((resolve, reject) => {
        updateServiceName(
          { bookingId: booking.bookingId, serviceName: selectedService },
          {
            onSuccess: () => {
              message.success("Cập nhật tên dịch vụ thành công");
              resolve(null);
            },
            onError: reject,
          }
        );
      });

      await new Promise((resolve, reject) => {
        updateServiceAmount(
          { bookingId: booking.bookingId, amount: selectedServiceAmount },
          {
            onSuccess: () => {
              message.success("Cập nhật giá thành công");
              resolve(null);
            },
            onError: reject,
          }
        );
      });

      // await new Promise((resolve, reject) => {
      //   updateTherapist(
      //     { bookingId: booking.bookingId, skintherapistId: selectedTherapist },
      //     {
      //       onSuccess: () => {
      //         message.success("Cập nhật chuyên viên thành công");
      //         resolve(null);
      //       },
      //       onError: reject,
      //     }
      //   );
      // });

      await refetch();
      setIsEditing(false);
    } catch {
      message.error("Có lỗi xảy ra khi cập nhật!");
    }
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
        if (isEditing) {
          if (record.key === "1") {
            return (
              <Select
                style={{ width: "100%" }}
                value={selectedService}
                onChange={handleServiceChange}
              >
                {/* {service?.map((service: any) => (
                  <Select.Option key={service.serviceId} value={service.name}>
                    {service.name}
                  </Select.Option>
                ))} */}
                {serviceTherapist?.map((service: ServiceDto) => (
                  <Select.Option key={service.serviceId} value={service.name}>
                    {service.name}
                  </Select.Option>
                ))}
              </Select>
            );
          }
          // if (record.key === "3") {
          //   return (
          //     <Select
          //       style={{ width: "100%" }}
          //       value={
          //         (therapists?.find(
          //           (t) => t.skintherapistId === selectedTherapist
          //         )?.name as unknown as number) ?? selectedTherapist
          //       }
          //       onChange={handleTherapistChange}
          //     >
          //       {therapists?.map((therapist: any) => (
          //         <Select.Option
          //           key={therapist.skintherapistId}
          //           value={therapist.therapistId}
          //         >
          //           {therapist.name}
          //         </Select.Option>
          //       ))}
          //     </Select>
          //   );
          // }
        }
        return text;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: "20%",
      render: (_: any, record: any) => {
        if (record.key === "1") {
          return isEditing ? (
            <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleUpdateService}
                style={{ width: "100%" }}
              >
                Lưu
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={() => setIsEditing(false)}
                style={{ width: "100%" }}
              >
                Hủy
              </Button>
            </div>
          ) : (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedService(booking.serviceName);
                // setSelectedTherapist(booking.skintherapistId);
                setIsEditing(true);
              }}
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
                {customerMap.get(booking.customerId)?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                {booking.amount}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {booking.location}
              </Descriptions.Item>
              <Descriptions.Item label="Dịch vụ">
                {booking.serviceName}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt lịch">
                {dayjs(booking.date).format("DD/MM/YYYY")}{" "}
                {slotMap.get(booking.bookingId)?.time
                  ? ` - ${slotMap.get(booking.bookingId)?.time}`
                  : ""}
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
            {/* <h4 style={{ marginTop: 20 }}>Lịch sử trạng thái</h4>
            <p>
              🟢 {dayjs(booking.updateAt).format("DD/MM/YYYY HH:mm:ss")} -{" "}
              {booking.status}
            </p> */}
          </Card>
          {user?.role == RoleCode.THERAPIST &&
            booking?.status === Status.CHECK_IN && (
              <Card style={{ marginTop: "10px" }}>
                <Title level={4}>Ghi chú</Title>
                <TextArea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                >
                  {booking.note}
                </TextArea>
                <Button
                  type="primary"
                  onClick={handleUpdateNote}
                  loading={isUpdatingNote}
                  style={{ marginTop: "10px" }}
                >
                  Lưu ghi chú
                </Button>
              </Card>
            )}
        </Col>
      </Row>
      {booking?.status === Status.BOOKED && user?.role == RoleCode.STAFF && (
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

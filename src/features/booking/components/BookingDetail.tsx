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
import { useSlots } from "../../services/hooks/useGetSlot";
import { SlotDto } from "../../services/dto/slot.dto";
import { useGetServiceByTherapistId } from "../../services/hooks/useGetServiceByTherapistId";
import { ServiceDto } from "../../services/dto/get-service.dto";

import { useGetServiceByTherapistId } from "../../services/hooks/useGetServiceByTherapistId";
import { ServiceDto } from "../../services/dto/get-service.dto";

const { Title } = Typography;

const BookingDetail = () => {
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
  const { data: therapists } = useTherapists();
  const { data: customers } = useCustomers();
  const { data: slots } = useSlots();
  const { data: serviceTherapist } = useGetServiceByTherapistId(
    booking?.skintherapistId || 0
  );
  const { data: serviceTherapist } = useGetServiceByTherapistId(
    booking?.skintherapistId || 0
  );

  const { mutate: updateServiceName } = useUpdateServiceName();
  const { mutate: updateServiceAmount } = useUpdateServiceAmount();
  const { mutate: updateNote, isPending: isUpdatingNote } = useUpdateNote();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  ); // Lưu serviceId thay vì serviceName
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [selectedServiceAmount, setSelectedServiceAmount] = useState<number>(0);
  const [note, setNote] = useState<string>(booking?.note || "");

  const activeServiceTherapist = serviceTherapist?.filter(
    (service) => service.status === "Active"
  );

  const activeServiceTherapist = serviceTherapist?.filter(
    (service) => service.status === "Active"
  );

  // Chỉ khởi tạo state ban đầu khi component mount lần đầu
  useEffect(() => {
    if (booking && activeServiceTherapist && !selectedServiceId && !isEditing) {
      const currentService = activeServiceTherapist.find(
        (s: ServiceDto) => s.name === booking.serviceName
      );
      setSelectedServiceId(
        currentService
          ? currentService.serviceId
          : activeServiceTherapist?.[0]?.serviceId ?? null
      );
      setSelectedServiceAmount(
        booking.amount || activeServiceTherapist[0]?.price || 0
      );
    }
  }, [booking, activeServiceTherapist, selectedServiceId, isEditing]);

  useEffect(() => {
    if (booking?.note !== undefined) {
      setNote(booking.note);
    }
  }, [booking]);

  // useEffect(() => {
  //   if (booking && serviceTherapist) {
  //     const currentService = serviceTherapist.find(
  //       (s: ServiceDto) => s.name === booking.serviceName
  //     );
  //     setSelectedServiceId(currentService ? currentService.serviceId : null);
  //     setSelectedServiceAmount(booking.amount);
  //   }
  // }, [booking, serviceTherapist]);
  useEffect(() => {
    if (booking && activeServiceTherapist) {
      const currentService = activeServiceTherapist.find(
        (s: ServiceDto) => s.name === booking.serviceName
      );
      setSelectedServiceId(currentService ? currentService.serviceId : null);
      setSelectedServiceAmount(booking.amount);
    }
  }, [booking, activeServiceTherapist]);

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

  // const handleServiceChange = (serviceId: number) => {
  //   setSelectedServiceId(serviceId);
  //   const selected = serviceTherapist?.find(
  //     (service: ServiceDto) => service.serviceId === serviceId
  //   );
  //   if (selected) {
  //     setSelectedServiceAmount(selected.price);
  //   }
  // };
  const handleServiceChange = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    const selected = activeServiceTherapist?.find(
      (service: ServiceDto) => service.serviceId === serviceId
    );
    if (selected) {
      setSelectedServiceAmount(selected.price);
  const handleServiceChange = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    const selectedService = activeServiceTherapist?.find(
      (service: ServiceDto) => service.serviceId === serviceId
    );
    if (selectedService) {
      setSelectedServiceAmount(selectedService.price);
    } else {
      message.warning("Dịch vụ không hợp lệ!");
      setSelectedServiceAmount(0); // Đặt giá về 0 nếu dịch vụ không hợp lệ
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
    if (!selectedServiceId) {
    if (!selectedServiceId) {
      message.warning("Vui lòng chọn một dịch vụ!");
      return;
    }

    try {
      await new Promise((resolve, reject) => {
        updateServiceName(
          { bookingId: booking.bookingId, serviceId: selectedServiceId }, // Truyền serviceId thay vì serviceName
          { bookingId: booking.bookingId, serviceId: selectedServiceId },
          {
            onSuccess: () => {
              message.success("Cập nhật dịch vụ thành công");
              message.success("Cập nhật dịch vụ thành công");
              resolve(null);
            },
            onError: (error) => {
              message.error(
                "Lỗi cập nhật dịch vụ: " + (error as Error).message
              );
              reject(error);
            },
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
            onError: (error) => {
              message.error("Lỗi cập nhật giá: " + (error as Error).message);
              reject(error);
            },
          }
        );
      });

      await refetch();
      setIsEditing(false);
    } catch {
      message.error("Có lỗi xảy ra khi cập nhật dịch vụ!");
    }
  };

  const serviceData = [
    {
      key: "1",
      name: "Tên dịch vụ",
      value:
        activeServiceTherapist?.find((s) => s.serviceId === selectedServiceId)
          ?.name || booking.serviceName,
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
        if (isEditing && record.key === "1") {
          return (
            <Select
              style={{ width: "100%" }}
              value={selectedServiceId} // Hiển thị serviceId trong Select
              onChange={handleServiceChange}
              placeholder="Chọn dịch vụ"
            >
              {/* {serviceTherapist?.map((service: ServiceDto) => (
                <Select.Option
                  key={service.serviceId}
                  value={service.serviceId}
                >
                  {service.name}
                </Select.Option>
              ))} */}
              {activeServiceTherapist?.map((service: ServiceDto) => (
                <Select.Option
                  key={service.serviceId}
                  value={service.serviceId}
                >
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
                onClick={() => {
                  setIsEditing(false);
                  // Reset về giá trị ban đầu khi hủy
                  const currentService = activeServiceTherapist?.find(
                    (s: ServiceDto) => s.name === booking.serviceName
                  );
                  setSelectedServiceId(
                    currentService ? currentService.serviceId : null
                  );
                  setSelectedServiceAmount(booking.amount || 0);
                }}
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
                const currentService = activeServiceTherapist?.find(
                  (s: ServiceDto) => s.name === booking.serviceName
                );
                setSelectedServiceId(
                  currentService ? currentService.serviceId : null
                );
                const currentService = activeServiceTherapist?.find(
                  (s: ServiceDto) => s.name === booking.serviceName
                );
                setSelectedServiceId(
                  currentService
                    ? currentService.serviceId
                    : activeServiceTherapist?.[0]?.serviceId ?? null
                );
                setSelectedServiceAmount(booking.amount || 0);
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
          </Card>
          {user?.role === RoleCode.THERAPIST &&
            booking?.status === Status.CHECK_IN && (
              <Card style={{ marginTop: "10px" }}>
                <Title level={4}>Ghi chú</Title>
                <TextArea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
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
          {user?.role === RoleCode.THERAPIST &&
            booking?.status === Status.CHECK_IN && (
              <Card style={{ marginTop: "10px" }}>
                <Title level={4}>Ghi chú</Title>
                <TextArea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
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
      {booking?.status === Status.BOOKED && user?.role === RoleCode.STAFF && (
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
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Tooltip, Flex } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  PayCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useBookings } from "../hooks/useGetBooked";
import { useBookingStore } from "../hooks/useBookedStore";
import { useCheckInBooking } from "../hooks/useCheckInBooking";
import { useCompletedBooking } from "../hooks/useCompletedBooking";
import { useCancelledBooking } from "../hooks/useCancelledBooking";
import { useDeniedBooking } from "../hooks/useDeniedBooking";
import { Status } from "../../../enums/status-booking";
import { showActionConfirmModal } from "../../../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { BookingDto } from "../dto/booking.dto";
import { ColumnsType } from "antd/es/table";

const BookingTableForStaff = () => {
  const {
    data: bookedData,
    isLoading: isLoadingBooked,
    error: errorBooked,
    refetch: refetchBooked,
  } = useBookings(Status.BOOKED);

  const {
    data: finishedData,
    isLoading: isLoadingFinished,
    error: errorFinished,
    refetch: refetchFinished,
  } = useBookings(Status.FINISHED);

  const { bookings, setBookings } = useBookingStore();
  const { mutate: updateCheckIn } = useCheckInBooking();
  const { mutate: updateCompleted } = useCompletedBooking();
  const { mutate: updateCancelled } = useCancelledBooking();
  const { mutate: updateDenied } = useDeniedBooking();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  useEffect(() => {
    if (bookedData && !isLoadingBooked && !errorBooked) {
      setBookings(bookedData);
    }
    if (finishedData && !isLoadingFinished && !errorFinished) {
      setBookings(finishedData);
    }
  }, [
    bookedData,
    isLoadingBooked,
    errorBooked,
    setBookings,
    finishedData,
    isLoadingFinished,
    errorFinished,
  ]);

  const handleConfirmAction = async (
    action: "checkin" | "checkout" | "cancel" | "deny",
    bookingId: number
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const actionFunctions = {
        checkin: updateCheckIn,
        checkout: updateCompleted,
        cancel: updateCancelled,
        deny: updateDenied,
      };

      actionFunctions[action](
        { BookingId: bookingId },
        {
          onSuccess: () => {
            if (action === "checkin" || action === "cancel") {
              refetchBooked();
            } else {
              refetchFinished();
            }
            resolve();
          },
          onError: (error) => {
            reject(error);
          },
        }
      );
    });
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const columns: ColumnsType<BookingDto> = [
    {
      title: "No",
      dataIndex: "No",
      fixed: "left",
      width: 50,
      render: (_value: any, _record: any, index: number) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "BookingID",
      dataIndex: "bookingId",
      key: "bookingId",
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerId",
      key: "customerId",
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap: Record<string, JSX.Element> = {
          [Status.BOOKED]: <Tag color="blue">Booked</Tag>,
          [Status.FINISHED]: <Tag color="green">Finished</Tag>,
        };
        return statusMap[status] || <Tag color="default">Unknown</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: unknown, record: { bookingId: number; status: string }) => (
        <Space>
          {record.status === Status.BOOKED && (
            <Tooltip title="Check-in">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() =>
                  showActionConfirmModal({
                    action: "checkin",
                    bookingId: record.bookingId,
                    onConfirm: (bookingId) =>
                      handleConfirmAction("checkin", bookingId),
                  })
                }
              />
            </Tooltip>
          )}
          {record.status === Status.FINISHED && (
            <Tooltip title="Không thanh toán">
              <Button
                icon={<PayCircleOutlined />}
                onClick={() =>
                  showActionConfirmModal({
                    action: "deny",
                    bookingId: record.bookingId,
                    onConfirm: (bookingId) =>
                      handleConfirmAction("deny", bookingId),
                  })
                }
              />
            </Tooltip>
          )}
          <Tooltip title="Cập nhật">
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate("/Staff/UpdateBooking")}
            />
          </Tooltip>
          <Tooltip title="Hủy">
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={() =>
                showActionConfirmModal({
                  action: "cancel",
                  bookingId: record.bookingId,
                  onConfirm: (bookingId) =>
                    handleConfirmAction("cancel", bookingId),
                })
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Flex gap="middle" justify="space-between">
        <div className="content-header">Danh sách đặt lịch</div>
      </Flex>
      <hr style={{ opacity: 0.1 }} />
      <Table
        dataSource={bookings}
        columns={columns}
        loading={isLoadingBooked || isLoadingFinished}
        rowKey="bookingId"
        bordered
        onChange={handleTableChange}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default BookingTableForStaff;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Table,
  Space,
  Input as AntInput,
  Skeleton,
  Tooltip,
  Tabs,
  Button,
  Modal,
  Form,
  message,
  Flex,
  Tag,
  DatePicker,
  TimePicker,
  Select,
} from "antd";
import { useSlots } from "../hooks/useGetSlot";
import { useAvailableSlot } from "../hooks/useAvailableSlot";
import { useBookedSlot } from "../hooks/useGetBookedSlot";
import { useCreateSlot } from "../hooks/useCreateSlot";
import { useCreateSchedule } from "../../schedule/hooks/useCreateSchedule";
import { EditOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import type { DatePickerProps } from "antd";
import { ColumnsType } from "antd/es/table";
import { SlotDto } from "../dto/slot.dto";
import dayjs from "dayjs";
import useAuthStore from "../../authentication/hooks/useAuthStore";
import { RoleCode } from "../../../enums/role.enum";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useTherapists } from "../../skin_therapist/hooks/useGetTherapist";
import { TherapistDto } from "../../skin_therapist/dto/get-therapist.dto";

dayjs.extend(customParseFormat);

const SlotTable = () => {
  const { user } = useAuthStore();
  const {
    data: allSlots,
    isLoading: isLoadingAll,
    refetch: refetchSlot,
  } = useSlots();
  const { data: availableSlots, isLoading: isLoadingAvailable } =
    useAvailableSlot();
  const { data: bookedSlots, isLoading: isLoadingBooked } = useBookedSlot();
  const { mutate: createSlot, isPending: isCreatingSlot } = useCreateSlot();
  const { mutate: createSchedule, isPending: isCreatingSchedule } =
    useCreateSchedule();
  const { data: therapists } = useTherapists();

  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filterSlots = (slots: SlotDto[] | undefined) =>
    slots?.filter((slot) =>
      slot.slotId.toString().includes(searchText.toLowerCase())
    ) || [];

  const dateFormat = "DD-MM-YYYY";

  const customFormat: DatePickerProps["format"] = (value) =>
    `${value.format(dateFormat)}`;

  const columns: ColumnsType<SlotDto> = [
    { title: "ID", dataIndex: "slotId", key: "slotId" },
    { title: "Time", dataIndex: "time", key: "time" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => <div>{dayjs(date).format("DD/MM/YYYY")}</div>,
      sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Available" ? "green" : "red"}>{status}</Tag>
      ),
    },
    ...(user?.role === RoleCode.STAFF
      ? [
          {
            title: "Actions",
            render: () => (
              // _: unknown, record: SlotDto
              <Space>
                <Tooltip title="Edit">
                  <Button icon={<EditOutlined />} />
                </Tooltip>
              </Space>
            ),
          },
        ]
      : []),
  ];

  const renderTable = () => {
    if (activeTab === "all") return filterSlots(allSlots);
    if (activeTab === "available") return filterSlots(availableSlots);
    if (activeTab === "booked") return filterSlots(bookedSlots);
  };

  const handleCreate = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCreateSlotAndSchedule = () => {
    form
      .validateFields()
      .then((values) => {
        const { skinTherapistId, time, date } = values;

        const slotData: SlotDto = {
          slotId: 0,
          time: dayjs(time).format("HH:mm A"),
          date: date.format("YYYY-MM-DD"),
          status: "Available",
          bookingId: 0,
        };

        createSlot(slotData, {
          onSuccess: (response) => {
            const createdSlotId = response.slotId;

            const scheduleData = {
              scheduleId: 0,
              skinTherapistId: skinTherapistId,
              slotId: createdSlotId,
              date: date.format("YYYY-MM-DD"),
            };

            createSchedule(scheduleData, {
              onSuccess: () => {
                message.success("Tạo slot và lịch thành công");
                setIsModalOpen(false);
                form.resetFields();
                refetchSlot();
              },
              onError: (scheduleError: any) => {
                message.error(`Tạo lịch thất bại: ${scheduleError.message}`);
              },
            });
          },
          onError: (slotError: any) => {
            message.error(`Tạo slot thất bại: ${slotError.message}`);
          },
        });
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  };

  const isLoading =
    isLoadingAll ||
    isLoadingAvailable ||
    isLoadingBooked ||
    isCreatingSlot ||
    isCreatingSchedule;

  if (isLoading && !isCreatingSlot && !isCreatingSchedule) {
    return <Skeleton />;
  }

  return (
    <div>
      <Flex gap="middle" justify="space-between">
        <div className="content-header">Danh sách slot</div>
        {user?.role === RoleCode.STAFF && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Tạo slot
          </Button>
        )}
      </Flex>
      <hr style={{ opacity: 0.1 }} />
      <Space direction="vertical" style={{ width: "100%" }}>
        <AntInput
          prefix={<SearchOutlined />}
          placeholder="Nhập slot cần tìm"
          style={{ border: "none", backgroundColor: "transparent" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Space>
      <hr style={{ opacity: 0.1 }} />
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={[
          { label: "Tất cả Slot", key: "all" },
          { label: "Slot Có Sẵn", key: "available" },
          { label: "Slot Đã Đặt", key: "booked" },
        ]}
      />
      <Table dataSource={renderTable()} columns={columns} rowKey="slotId" />

      <Modal
        title="Thêm Slot và Lịch"
        open={isModalOpen}
        onOk={handleCreateSlotAndSchedule}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isCreatingSlot || isCreatingSchedule}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: "Available" }}
        >
          <Form.Item
            name="skinTherapistId"
            label="Chuyên viên"
            rules={[{ required: true, message: "Vui lòng chọn chuyên viên" }]}
          >
            <Select style={{ width: "100%" }}>
              {therapists?.map((therapist: TherapistDto) => (
                <Select.Option
                  key={therapist.skintherapistId}
                  value={therapist.skintherapistId}
                >
                  {therapist.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="time"
            label="Thời gian"
            rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
          >
            <TimePicker
              use12Hours
              format="h:mm A"
              placeholder="Chọn thời gian"
            />
          </Form.Item>
          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker format={customFormat} placeholder="Chọn ngày" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SlotTable;

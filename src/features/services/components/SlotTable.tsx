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
  Input,
  message,
  Flex,
  Tag,
  DatePicker,
  TimePicker,
} from "antd";
import { useSlots } from "../hooks/useGetSlot";
import { useAvailableSlot } from "../hooks/useAvailableSlot";
import { useBookedSlot } from "../hooks/useGetBookedSlot";
import { useCreateSlot } from "../hooks/useCreateSlot";
import { useDeleteSlot } from "../hooks/useDeleteSlot";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { DatePickerProps } from "antd";
import { ColumnsType } from "antd/es/table";
import { SlotDto } from "../dto/slot.dto";
import dayjs from "dayjs";
import useAuthStore from "../../authentication/hooks/useAuthStore";
import { RoleCode } from "../../../enums/role.enum";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const SlotTable = () => {
  const { user } = useAuthStore();
  const { data: allSlots, isLoading: isLoadingAll } = useSlots();
  const { data: availableSlots, isLoading: isLoadingAvailable } =
    useAvailableSlot();
  const { data: bookedSlots, isLoading: isLoadingBooked } = useBookedSlot();
  const { mutate: createSlot } = useCreateSlot();
  const { mutate: deleteSlot } = useDeleteSlot();

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

  const handleDeleteSlot = (slotId: number) => {
    deleteSlot(slotId, {
      onSuccess: () => {
        message.success("Xoá slot thành công");
      },
      onError: () => {
        message.error("Xoá slot thất bại");
      },
    });
  };

  const columns: ColumnsType<SlotDto> = [
    { title: "ID", dataIndex: "slotId", key: "slotId" },
    { title: "Time", dataIndex: "time", key: "time" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => <div>{dayjs(date).format("DD/MM/YYYY")}</div>,
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
            render: (_: unknown, record: SlotDto) => (
              <Space>
                <Tooltip title="Edit">
                  <Button icon={<EditOutlined />} />
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteSlot(record.slotId)}
                  />
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

  const handleCreateSlot = () => {
    form
      .validateFields()
      .then((values) => {
        createSlot(values, {
          onSuccess: () => {
            message.success("Tạo slot thành công");
            setIsModalOpen(false);
            form.resetFields();
          },
          onError: (err: { message: any }) => {
            message.error(`Lỗi tạo người dùng: ${err.message}`);
          },
        });
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  };

  if (isLoadingAll || isLoadingAvailable || isLoadingBooked)
    return <Skeleton />;

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
        title="Thêm Slot"
        open={isModalOpen}
        onOk={handleCreateSlot}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: "Available" }}
        >
          <Form.Item name="time" label="Time" rules={[{ required: true }]}>
            <TimePicker format="HH:mm A" placeholder="Choose time" />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker format={customFormat} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SlotTable;

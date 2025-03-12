/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
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
} from "antd";
import { useSlots } from "../hooks/useGetSlot";
import { useAvailableSlot } from "../hooks/useAvailableSlot";
import { useBookedSlot } from "../hooks/useGetBookedSlot";
import { useCreateSlot, useDeleteSlot } from "../hooks/useCreateSlot";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { SlotDto } from "../dto/slot.dto";

const SlotTable = () => {
  const { data: allSlots, isLoading: isLoadingAll } = useSlots();
  const { data: availableSlots, isLoading: isLoadingAvailable } =
    useAvailableSlot();
  const { data: bookedSlots, isLoading: isLoadingBooked } = useBookedSlot();
  const { mutate: createSlot } = useCreateSlot();
  const { mutate: deleteSlot } = useDeleteSlot();

  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filterSlots = (slots: SlotDto[] | undefined) =>
    slots?.filter((slot) =>
      slot.slotId.toString().includes(searchText.toLowerCase())
    ) || [];

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
    { title: "ID", dataIndex: "slotId" },
    { title: "Status", dataIndex: "status" },
    { title: "Time", dataIndex: "time" },
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
  ];

  const renderTable = () => {
    if (activeTab === "all") return filterSlots(allSlots);
    if (activeTab === "available") return filterSlots(availableSlots);
    if (activeTab === "booked") return filterSlots(bookedSlots);
  };

  const handleAddSlot = () => {
    form.validateFields().then((values) => {
      createSlot(values, {
        onSuccess: () => {
          message.success("Thêm slot mới thành công");
          setIsModalVisible(false);
          form.resetFields();
        },
      });
    });
  };

  if (isLoadingAll || isLoadingAvailable || isLoadingBooked)
    return <Skeleton />;

  return (
    <div>
      <div className="content-header">Danh sách slot</div>
      <AntInput
        prefix={<SearchOutlined />}
        placeholder="Tìm kiếm slot"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Thêm Slot
      </Button>
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
        visible={isModalVisible}
        onOk={handleAddSlot}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="time" label="Time" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SlotTable;

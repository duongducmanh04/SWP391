/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Table,
  Space,
  Input as AntInput,
  Form,
  message,
  Button,
  Modal,
  Flex,
  Switch,
  Image,
  Skeleton,
  Empty,
  Tooltip,
} from "antd";
import { useServices } from "../hooks/useGetService";
import { useServiceStore } from "../hooks/useServiceStore";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useCreateService } from "../hooks/useCreateService";
import { useUpdateService } from "../hooks/useUpdateService";
import { useDeleteService } from "../hooks/useDeleteService";
import { ColumnsType } from "antd/es/table";
import { ServiceDto } from "../dto/get-service.dto";

const ServiceTable = () => {
  const { data, isLoading, error } = useServices();
  const { mutate: createService } = useCreateService();
  const { mutate: updateService } = useUpdateService();
  const { mutate: deleteService } = useDeleteService();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [form] = Form.useForm();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<any>(null);
  const { services, setServices } = useServiceStore();
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  // const dateFormat = "DD/MM/YYYY";

  useEffect(() => {
    if (data) {
      setServices(data);
    }
  }, [data, setServices]);

  const handleCreate = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleCreateUser = () => {
    form
      .validateFields()
      .then((values) => {
        createService(values, {
          onSuccess: () => {
            message.success("Tạo dịch vụ thành công");
            setIsModalVisible(false);
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

  const handleEdit = (record: any) => {
    setEditingService(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      deleteService(serviceToDelete, {
        onSuccess: () => {
          message.success("Xóa dịch vụ thành công");
          setDeleteModalVisible(false);
          setServiceToDelete(null);
        },
        onError: (err: { message: any }) => {
          message.error(`Lỗi xóa dịch vụ: ${err.message}`);
        },
      });
    }
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        updateService(
          { serviceId: editingService.serviceId, data: values },
          {
            onSuccess: () => {
              message.success("Cập nhật dịch vụ thành công");
              setIsModalVisible(false);
              setEditingService(null);
            },
            onError: (err: { message: any }) => {
              message.error(`Lỗi cập nhật dịch vụ: ${err.message}`);
            },
          }
        );
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const filteredServices = services?.filter((service: any) =>
    service.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<ServiceDto> = [
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
      title: "ID",
      dataIndex: "serviceId",
      key: "serviceId",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "dateofbirth",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <Image
          src={image}
          width={50}
          height={50}
          style={{ borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Procedure Description",
      dataIndex: "procedureDescription",
      key: "procedureDescription",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: any) => (
        <Space>
          <Tooltip title="Chi tiết">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.serviceId)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <Skeleton />;
  }

  if (error) {
    return <div>Error loading users</div>;
  }

  return (
    <div>
      <Flex gap="middle" justify="space-between">
        <div className="content-header">Danh sách dịch vụ</div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Tạo dịch vụ
        </Button>
      </Flex>
      <hr style={{ opacity: 0.1 }} />
      <Space direction="vertical" style={{ width: "100%" }}>
        <AntInput
          prefix={<SearchOutlined />}
          placeholder="Nhập dịch vụ cần tìm"
          style={{ border: "none", backgroundColor: "transparent" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Space>
      <hr style={{ opacity: 0.1 }} />
      <Table
        dataSource={filteredServices || []}
        columns={columns}
        rowKey="serviceId"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30"],
        }}
        onChange={handleTableChange}
        locale={{
          emptyText: isLoading ? <Skeleton active={true} /> : <Empty />,
        }}
      />

      <Modal
        title={editingService ? "Cập nhật dịch vụ" : "Tạo dịch vụ"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={editingService ? handleUpdate : handleCreateUser}
        width={600}
        cancelText="Hủy"
        okText={editingService ? "Cập nhật" : "Tạo"}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name!" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="dateofbirth"
            label="Date of birth"
            rules={[
              { required: true, message: "Please enter the date of birth!" },
            ]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select the gender!" }]}
          >
            <Switch checked={form.getFieldValue("gender")} />
          </Form.Item>
          <Form.Item
            name="class"
            label="Class"
            rules={[{ required: true, message: "Please enter the class!" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item name="feedback" label="Feedback">
            <AntInput />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Deletion"
        visible={isDeleteModalVisible}
        width={200}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDeleteModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="delete" type="primary" danger onClick={confirmDelete}>
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn xóa dịch vụ này không?</p>
      </Modal>
    </div>
  );
};

export default ServiceTable;

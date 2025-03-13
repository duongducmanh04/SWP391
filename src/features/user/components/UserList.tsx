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
  Select,
  Skeleton,
  Empty,
  Tooltip,
} from "antd";
import { useUsers } from "../hook/useGetUser";
import { useUserStore } from "../hook/useUserStore";
import { EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useCreateUser } from "../hook/useCreateUser";
import { useUpdateUser } from "../hook/useUpdateUser";
import { ColumnsType } from "antd/es/table";
import { UserDto } from "../dto/get-user.dto";

const UserTable = () => {
  const { data, isLoading, error } = useUsers();
  const { mutate: createUser } = useCreateUser();
  const { mutate: updateUser } = useUpdateUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();
  const { users, setUsers } = useUserStore();
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data, setUsers]);

  const handleCreate = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCreateUser = () => {
    form
      .validateFields()
      .then((values) => {
        createUser(values, {
          onSuccess: () => {
            message.success("Tạo người dùng thành công");
            setIsModalOpen(false);
            form.resetFields();
          },
          onError: (err) => {
            message.error(`Lỗi tạo người dùng: ${err.message}`);
          },
        });
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  };

  const handleEdit = (record: any) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        updateUser(
          { id: editingUser.id, data: values },
          {
            onSuccess: () => {
              message.success("Cập nhật người dùng thành công");
              setIsModalOpen(false);
              setEditingUser(null);
            },
            onError: (err) => {
              message.error(`Lỗi cập nhật người dùng: ${err.message}`);
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

  const filteredUsers = users?.filter((user: any) =>
    user.accountName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<UserDto> = [
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
      dataIndex: "accountId",
      key: "accountId",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Name",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
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
        <div className="content-header">Danh sách người dùng</div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Tạo User
        </Button>
      </Flex>
      <hr style={{ opacity: 0.1 }} />
      <Space direction="vertical" style={{ width: "100%" }}>
        <AntInput
          prefix={<SearchOutlined />}
          placeholder="Nhập tên người dùng cần tìm"
          style={{ border: "none", backgroundColor: "transparent" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Space>
      <hr style={{ opacity: 0.1 }} />
      <Table
        dataSource={filteredUsers || []}
        columns={columns}
        rowKey="accountId"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "30"],
        }}
        onChange={handleTableChange}
        locale={{
          emptyText: isLoading ? <Skeleton active={true} /> : <Empty />,
        }}
      />

      <Modal
        title={editingUser ? "Cập nhật người dùng" : "Tạo người dùng"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={editingUser ? handleUpdate : handleCreateUser}
        width={600}
        cancelText="Hủy"
        okText={editingUser ? "Cập nhật" : "Tạo"}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="accountName"
            label="Account Name"
            rules={[
              { required: true, message: "Please enter the account name!" },
            ]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ message: "Please enter the password!" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select
              showSearch
              placeholder="Select role"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { value: "Admin", label: "Admin" },
                { value: "Staff", label: "Staff" },
                { value: "Skintherapist", label: "Skintherapist" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserTable;

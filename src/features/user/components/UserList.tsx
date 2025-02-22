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
  Tag,
  Switch,
  Image,
  Skeleton,
  Empty,
} from "antd";
import { useUsers } from "../hook/useGetUser";
import { useUserStore } from "../hook/useUserStore";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useCreateUser } from "../hook/useCreateUser";
import { useUpdateUser } from "../hook/useUpdateUser";
import { useDeleteUser } from "../hook/useDeleteUser";
import { ColumnsType } from "antd/es/table";
import { UserDto } from "../dto/get-user.dto";
import CustomUpdateStatusModal from "../../../components/CustomUpdateStatusModal";
import { Link } from "react-router-dom";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";

// dayjs.extend(customParseFormat);

const UserTable = () => {
  const { data, isLoading, error } = useUsers();
  const { mutate: createUser } = useCreateUser();
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isGenderChangeModalVisible, setIsGenderChangeModalVisible] =
    useState(false);
  const [userToChangeGender, setUserToChangeGender] = useState<any>(null);
  const [genderChangeValue, setGenderChangeValue] = useState<boolean | null>(
    null
  );
  const { users, setUsers } = useUserStore();
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  // const dateFormat = "DD/MM/YYYY";

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data, setUsers]);

  const handleCreate = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleCreateUser = () => {
    form
      .validateFields()
      .then((values) => {
        createUser(values, {
          onSuccess: () => {
            message.success("Tạo người dùng thành công");
            setIsModalVisible(false);
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
    setIsModalVisible(true);
  };

  //   const handleDelete = (id: string) => {
  //     deleteUser(id, {
  //       onSuccess: () => {
  //         message.success("User deleted successfully!");
  //       },
  //       onError: (err) => {
  //         message.error(`Error deleting user: ${err.message}`);
  //       },
  //     });
  //   };

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete, {
        onSuccess: () => {
          message.success("Xóa người dùng thành công");
          setDeleteModalVisible(false);
          setUserToDelete(null);
        },
        onError: (err) => {
          message.error(`Lỗi xóa người dùng: ${err.message}`);
        },
      });
    }
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
              setIsModalVisible(false);
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

  const handleGenderChange = (_checked: boolean, user: any) => {
    setUserToChangeGender(user);
    setGenderChangeValue(_checked);
    setIsGenderChangeModalVisible(true);
  };

  const confirmGenderChange = () => {
    if (userToChangeGender && genderChangeValue !== null) {
      updateUser(
        {
          id: userToChangeGender.id,
          data: { id: userToChangeGender.id, gender: genderChangeValue },
        },
        {
          onSuccess: () => {
            message.success("Cập nhật giới tính thành công");
            setIsGenderChangeModalVisible(false);
            setUserToChangeGender(null);
          },
          onError: (err) => {
            message.error(`Lỗi cập nhật giới tính: ${err.message}`);
          },
        }
      );
    }
  };
  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const filteredUsers = users?.filter(
    (user: any) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.id.toLowerCase().includes(searchText.toLowerCase())
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
      dataIndex: "id",
      key: "id",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date of birth",
      dataIndex: "dateofbirth",
      key: "dateofbirth",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender: boolean, user: any) => (
        <Switch
          checked={gender}
          onChange={(checked) => handleGenderChange(checked, user)}
        />
      ),
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
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
      title: "Feedback",
      dataIndex: "feedback",
      key: "feedback",
      render: (feedback: string) => {
        let color = "blue";

        if (feedback === "good") {
          color = "green";
        } else if (feedback === "bad") {
          color = "red";
        }

        return (
          <Tag color={color} key={feedback}>
            {feedback?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: any) => (
        <div>
          <Button
            color="primary"
            variant="solid"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            <EditOutlined />
          </Button>
          <Button
            onClick={() => handleDelete(record.id)}
            color="danger"
            variant="solid"
          >
            <DeleteOutlined />
          </Button>
          <Link to={`/Home/User/${record.id}`}>
            <Button color="primary" variant="solid" icon={<EyeOutlined />}>
              Xem chi tiết
            </Button>
          </Link>
        </div>
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
        <AntInput // Use AntInput here too
          prefix={<SearchOutlined />}
          placeholder="Enter Contract No. Ref, subcontractor,..."
          style={{ border: "none", backgroundColor: "transparent" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Space>
      <hr style={{ opacity: 0.1 }} />
      <Table
        // dataSource={users || []} // Dữ liệu từ API
        dataSource={filteredUsers || []}
        columns={columns} // Định nghĩa cột
        rowKey="id" // Xác định khóa duy nhất
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
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
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
            {/*<DatePicker format={dateFormat} />*/}
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
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={confirmDelete}>
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>

      <CustomUpdateStatusModal
        custom={genderChangeValue ? "blue" : "red"}
        isOpen={isGenderChangeModalVisible}
        title="Xác nhận thay đổi giới tính"
        subTitle={[
          `Bạn có chắc chắn muốn ${
            genderChangeValue
              ? "thay đổi giới tính nam"
              : "thay đổi giới tính nữ"
          } cho ${userToChangeGender?.name}?`,
        ]}
        textClose="Hủy"
        textConfirm="Confirm"
        handleClose={() => setIsGenderChangeModalVisible(false)}
        handleConfirm={confirmGenderChange}
      />
    </div>
  );
};

export default UserTable;

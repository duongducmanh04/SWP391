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
  Image,
  Skeleton,
  Empty,
  Tooltip,
} from "antd";
import { useQuizAnswer } from "../hooks/useGetQuizAnswer";
import { useQuizQuestion } from "../hooks/useGetQuizQuestion";
import { useCreateQuizAnswer } from "../hooks/useCreateQuizAnswer";
import { useCreateQuizQuestion } from "../hooks/useCreateQuizQuesion";
import { useUpdateQuizAnswer } from "../hooks/useUpdateQuizAnswer";
import { useUpdateQuizQuestion } from "../hooks/useUpdateQuizQuestion";
import { useDeleteQuizAnswer } from "../hooks/useDeleteQuizAnswer";
import { useDeleteQuizQuestion } from "../hooks/useDeleteQuizQuestion";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";

const QuizTable = () => {
  const { data: quizAnswer, isLoadingQuizAnswer } = useQuizAnswer();
  const { data: quizQuestion, isLoadingQuizQuestion } = useQuizQuestion();
  const { mutate: createQuizAnswer } = useCreateQuizAnswer();
  const { mutate: createQuizQuestion } = useCreateQuizQuestion();
  const { mutate: updateQuizAnswer } = useUpdateQuizAnswer();
  const { mutate: updateQuizQuestion } = useUpdateQuizQuestion();
  const { mutate: deleteQuizQuestion } = useDeleteQuizQuestion();
  const { mutate: deleteQuizAnswer } = useDeleteQuizAnswer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuizQuestion, setEditingQuizQuestion] = useState<any>(null);
  const [editingQuizAnswer, setEditingQuizAnswer] = useState<any>(null);
  const [form] = Form.useForm();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizAnswerToDelete, setQuizAnswerToDelete] = useState<any>(null);
  const [quizQuestionToDelete, setQuizQuestionToDelete] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const handleCreate = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCreateQuizAnswer = () => {
    form
      .validateFields()
      .then((values) => {
        createQuizAnswer(values, {
          onSuccess: () => {
            message.success("Tạo câu trả lời thành công");
            setIsModalOpen(false);
            form.resetFields();
          },
          onError: (err: { message: any }) => {
            message.error(`Lỗi tạo câu trả lời: ${err.message}`);
          },
        });
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  };

  const handleEdit = (record: any) => {
    setEditingQuizAnswer(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (serviceId: string) => {
    setQuizAnswerToDelete(serviceId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (quizAnswerToDelete) {
      deleteQuizAnswer(quizAnswerToDelete, {
        onSuccess: () => {
          message.success("Xóa câu trả lời thành công");
          setDeleteModalOpen(false);
          setQuizAnswerToDelete(null);
        },
        onError: (err: { message: any }) => {
          message.error(`Lỗi xóa câu trả lời: ${err.message}`);
        },
      });
    }
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        updateQuizAnswer(
          { id: editingQuizAnswer.answerId, data: values },
          {
            onSuccess: () => {
              message.success("Cập nhật câu trả lời thành công");
              setIsModalOpen(false);
              setEditingQuizAnswer(null);
            },
            onError: (err: { message: any }) => {
              message.error(`Lỗi cập nhật câu trả lời: ${err.message}`);
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

  const filteredQuizQuestions = quizQuestion?.filter((quizQuestion: any) =>
    quizQuestion.content.toLowerCase().includes(searchText.toLowerCase())
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

  if (isLoadingQuizAnswer || isLoadingQuizQuestion) {
    return <Skeleton />;
  }

  return (
    <div>
      <Flex gap="middle" justify="space-between">
        <div className="content-header">Danh sách quiz</div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Tạo quiz
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
        dataSource={filteredQuizQuestions || []}
        columns={columns}
        rowKey="quizquestionId"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30"],
        }}
        onChange={handleTableChange}
        locale={{
          emptyText: isLoadingQuizQuestion ? (
            <Skeleton active={true} />
          ) : (
            <Empty />
          ),
        }}
      />

      <Modal
        title={editingService ? "Cập nhật dịch vụ" : "Tạo dịch vụ"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={editingService ? handleUpdate : handleCreateService}
        width={600}
        centered
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
            name="description"
            label="description"
            rules={[
              { required: true, message: "Please enter the description!" },
            ]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="price"
            label="price"
            rules={[{ required: true, message: "Please enter the price!" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="duration"
            label="duration"
            rules={[{ required: true, message: "Please enter the duration!" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="image"
            label="image"
            rules={[{ required: true, message: "Please enter the image!" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="procedureDescription"
            label="procedureDescription"
            rules={[
              {
                required: true,
                message: "Please enter the procedure description!",
              },
            ]}
          >
            <AntInput />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        width={200}
        onCancel={() => setDeleteModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setDeleteModalOpen(false)}>
            Hủy
          </Button>,
          <Button key="delete" type="primary" danger onClick={confirmDelete}>
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn xóa quiz này không?</p>
      </Modal>
    </div>
  );
};

export default QuizTable;

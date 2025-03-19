import { useEffect, useState } from "react";
import {
  Table,
  Space,
  Input as AntInput,
  Form,
  message,
  Button,
  Modal,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useQuizQuestion } from "../hooks/useGetQuizQuestion";
import { useDeleteQuizQuestion } from "../hooks/useDeleteQuizQuestion";
import { useUpdateQuizQuestion } from "../hooks/useUpdateQuizQuestion";
import { useCreateQuizQuestion } from "../hooks/useCreateQuizQuesion";
import { useQuizAnswer } from "../hooks/useGetQuizAnswer";
import { useCreateQuizAnswer } from "../hooks/useCreateQuizAnswer";
import { useDeleteQuizAnswer } from "../hooks/useDeleteQuizAnswer";
import { useUpdateQuizAnswer } from "../hooks/useUpdateQuizAnswer";

const QuizTable = () => {
  const { data: quizQuestions, isLoading: isLoadingQuizQuestion } = useQuizQuestion();
  const { data: quizAnswers, isLoading: isLoadingQuizAnswer } = useQuizAnswer();
  const { mutate: createQuizAnswer } = useCreateQuizAnswer();
  const { mutate: deleteQuizAnswer } = useDeleteQuizAnswer();
  const { mutate: updateQuizAnswer } = useUpdateQuizAnswer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [form] = Form.useForm();
  

  const handleAddAnswers = (quizquestionId: number) => {
    setSelectedQuizId(quizquestionId);
    setIsModalOpen(true);
    form.resetFields();
  };
  const handleDeleteAnswer = (answerId: number) => {
    console.log("Deleting answer with ID:", answerId, "Type:", typeof answerId);
    
    if (typeof answerId !== "number") {
      message.error("Invalid answer ID");
      return;
    }
  
    deleteQuizAnswer(answerId, {
      onSuccess: () => message.success("Deleted answer successfully"),
    });
  };


 

  const handleSubmitAnswers = () => {
    form.validateFields().then((values) => {
      if (selectedQuizId !== null) {
        const answers = values.answers;
  
        if (!answers || answers.length === 0) {
          message.error("Please add at least one answer.");
          return;
        }
  
        answers.forEach((answer: any) => {
          const answerData = {
            content: answer.answer,  
            quizquestionId: selectedQuizId,  
            skintypeId: Number(answer.skintypeId), 
            serviceImpact: answer.serviceImpact, 
           
          };
  
          console.log(`Submitting answer :`, answerData);
  
          createQuizAnswer(answerData, {
            onSuccess: () => {
             
                message.success("All answers added successfully");
                setIsModalOpen(false);
                form.resetFields();
              
            },
            onError: () => {
              console.error(`Error submitting answer `);
              message.error(`Failed to submit answer `);
            },
          });
        });
      }
    });
  };
  

  const quizColumns: ColumnsType<any> = [
    {
      title: "No",
      dataIndex: "No",
      width: 50,
      render: (_value, _record, index) => index + 1,
    },
    {
      title: "Question",
      dataIndex: "content",
      key: "content",
    },
 
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Add Answers">
            <Button icon={<PlusOutlined />} onClick={() => handleAddAnswers(record.quizquestionId)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const answerColumns: ColumnsType<any> = [
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
    },
    {
      title:"Edit",
      dataIndex :"answer",
      key:"answer",
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Delete">
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteAnswer(record.answerId)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
            loading={isLoadingQuizQuestion || isLoadingQuizAnswer} // Add loading check
            dataSource={quizQuestions || []} // Ensure it's never undefined
            columns={quizColumns}
            rowKey="answerId"
            expandable={{
    expandedRowRender: (quiz) => {
      const relatedAnswers = (quizAnswers || []).filter(answer => answer.quizquestionId === quiz.quizquestionId);

     
      console.log("quiz.quizquestionId:", quiz.quizquestionId);
      console.log("Rendering Table with dataSource:", relatedAnswers);
      console.log("Type of relatedAnswers:", typeof relatedAnswers);
      console.log("Length of relatedAnswers:", Array.isArray(relatedAnswers) ? relatedAnswers.length : "Not an array");
      console.log("Table columns:", answerColumns);
      console.log("First relatedAnswer object:", relatedAnswers[0]);

      if (isLoadingQuizAnswer || !quizAnswers) return <p>Loading answers...</p>;

      if (relatedAnswers.length === 0) {
        return <p>No answers found</p>;
      }

      return (
        <Table
        dataSource={Array.isArray(relatedAnswers) ? relatedAnswers : []} 
        columns={answerColumns}
        rowKey="answerId"
        pagination={false}
      />
      );
    }
  }}
/>

      {/* Modal for Adding Answers */}
      <Modal title="Add Answers" open={isModalOpen} onOk={handleSubmitAnswers} onCancel={() => setIsModalOpen(false)}>
  <Form form={form} layout="vertical">
    <Form.List name="answers">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <div key={key} style={{ marginBottom: 16, border: "1px solid #ddd", padding: 10, borderRadius: 5 }}>
              <Form.Item
                {...restField}
                name={[name, "answer"]}
                label="Answer"
                rules={[{ required: true, message: "Answer is required" }]}
              >
                <AntInput placeholder="Enter an answer" />
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, "skintypeId"]}
                label="Skin Type ID"
                rules={[{ required: true, message: "Skin Type ID is required" }]}
              >
                <AntInput type="number" placeholder="Enter Skin Type ID" />
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, "serviceImpact"]}
                label="Service Impact"
                rules={[{ required: true, message: "Service Impact is required" }]}
              >
                <AntInput placeholder="Enter Service Impact" />
              </Form.Item>

              <Button onClick={() => remove(name)} danger>
                Remove
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={() => add()} block>
            Add Answer
          </Button>
        </>
      )}
    </Form.List>
  </Form>
</Modal>

    </div>
  );
};

export default QuizTable;

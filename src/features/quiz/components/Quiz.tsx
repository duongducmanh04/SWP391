import { useState, useEffect } from "react";
import { Card, Button, Radio, message, Typography, Spin } from "antd";
import { useQuizQuestion } from "../hooks/useGetQuizQuestion";
import { useQuizAnswer } from "../hooks/useGetQuizAnswer";
import { useSubmitQuiz } from "../hooks/useSubmitQuiz";
import { useGetSurveyById } from "../hooks/useGetSurveyById";
import { useRecommendSkintype } from "../hooks/useRecommendSkintype";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate để chuyển trang
import "../../../style/Quiz.css";

const { Title, Text } = Typography;

const QuizTest = () => {
  const navigate = useNavigate();
  const {
    data: questionData = [],
    isLoading: isLoadingQuestion,
    error: errorQuestion,
  } = useQuizQuestion();

  const {
    data: answerData = [],
    isLoading: isLoadingAnswer,
    error: errorAnswer,
  } = useQuizAnswer();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const { mutate: submitQuiz, isPending: isSubmitting } = useSubmitQuiz();

  // 🟢 Lấy customerID từ localStorage
  const customerId = Number(localStorage.getItem("customerId") || "1");

  // 🔵 Lấy customerIDSurvey từ localStorage sau khi submit
  const customerIDSurvey = Number(
    localStorage.getItem("customerIDSurvey") || "0"
  );

  // 🟣 Gọi API lấy dữ liệu survey
  const { data: surveyData, isLoading: isLoadingSurvey } =
    useGetSurveyById(customerIDSurvey);

  // 🟠 Gọi API lấy loại da đề xuất
  const { data: skintypeData, isLoading: isLoadingSkintype } =
    useRecommendSkintype(customerIDSurvey);

  useEffect(() => {
    if (customerIDSurvey) {
      console.log("🔄 Gọi API getSurveyById với ID:", customerIDSurvey);
    }
  }, [customerIDSurvey]);

  if (isLoadingQuestion || isLoadingAnswer)
    return <Spin tip="Đang tải câu hỏi..." />;
  if (errorQuestion || errorAnswer) return <p>Lỗi tải dữ liệu</p>;
  if (!questionData.length) return <p>Không có dữ liệu câu hỏi!</p>;

  const currentQuestion = questionData[currentQuestionIndex];

  const handleAnswerChange = (questionId: number, answerId: number) => {
    if (selectedAnswers[questionId] === answerId) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleNext = () => {
    if (!selectedAnswers[currentQuestion.quizquestionId]) {
      message.warning("Vui lòng chọn một đáp án!");
      return;
    }
    if (currentQuestionIndex < questionData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  // 🛑 Gửi bài quiz
  const handleSubmit = () => {
    const unansweredCount = questionData.reduce(
      (count, question) =>
        count + (selectedAnswers[question.quizquestionId] ? 0 : 1),
      0
    );

    if (unansweredCount > 0) {
      message.warning(`Bạn chưa trả lời ${unansweredCount} câu hỏi!`);
      return;
    }

    const submitData = {
      customerId,
      answers: questionData.map((question) => ({
        questionId: question.quizquestionId,
        answerId: selectedAnswers[question.quizquestionId],
      })),
    };

    console.log("📤 Dữ liệu gửi đi:", submitData);

    submitQuiz(submitData, {
      onSuccess: (data) => {
        const { customerIDSurvey } = data;
        message.success("Bài quiz đã được gửi thành công!");

        // 🔴 Lưu lại customerIDSurvey để sử dụng tiếp
        localStorage.setItem("customerIDSurvey", String(customerIDSurvey));

        console.log("✅ Đã nhận customerIDSurvey:", customerIDSurvey);

        // 🟢 Chuyển hướng sang trang kết quả
        navigate(`/result/${customerIDSurvey}`);
      },
      onError: (error) => {
        console.error("❌ Lỗi khi gửi quiz:", error);
        message.error("Có lỗi xảy ra khi nộp bài! Vui lòng thử lại.");
      },
    });
  };

  return (
    <div className="quiz-container">
      <Card className="quiz-card">
        <Title level={4}>
          Câu hỏi {currentQuestionIndex + 1}/{questionData.length}
        </Title>
        <Text className="quiz-text">{currentQuestion?.content}</Text>
        <Radio.Group
          onChange={(e) =>
            handleAnswerChange(currentQuestion.quizquestionId, e.target.value)
          }
          value={selectedAnswers[currentQuestion.quizquestionId] || null}
          className="quiz-radio-group"
        >
          {answerData
            .filter(
              (ans) => ans.quizquestionId === currentQuestion.quizquestionId
            )
            .map((option) => (
              <Radio key={option.answerId} value={option.answerId}>
                {option.answer}
              </Radio>
            ))}
        </Radio.Group>
        <Button
          type="primary"
          className="quiz-button"
          style={{ marginTop: 20, alignSelf: "center" }}
          onClick={handleNext}
          loading={isSubmitting}
        >
          {currentQuestionIndex < questionData.length - 1
            ? "Tiếp theo"
            : "Nộp bài"}
        </Button>
      </Card>

      {/* Hiển thị danh sách câu hỏi đã trả lời */}
      <Card className="answered-questions" style={{ marginTop: 20 }}>
        <Title level={5}>Danh sách câu hỏi đã trả lời</Title>
        <ul>
          {questionData.map((question) => {
            const answerId = selectedAnswers[question.quizquestionId];
            return (
              <li key={question.quizquestionId}>
                Câu {question.quizquestionId}:{" "}
                {answerId ? `Đáp án ${answerId}` : "Chưa trả lời"}
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
};

export default QuizTest;

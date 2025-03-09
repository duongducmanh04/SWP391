/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, Button, Radio, message, Typography } from "antd";
import { QuizQuestionDto } from "../dto/quiz-question.dto";
import { QuizAnswerDto } from "../dto/quiz-answer.dto";
import { useQuizQuestion } from "../hooks/useGetQuizQuestion";
import { useQuizAnswer } from "../hooks/useGetQuizAnswer";
import "../../../style/Quiz.css";

const { Title, Text } = Typography;

const QuizTest = () => {
  const {
    data: questionData = [], // Đảm bảo dữ liệu luôn là mảng
    isLoading: isLoadingQuestion,
    error: errorQuestion,
  } = useQuizQuestion();

  const {
    data: answerData = [], // Đảm bảo dữ liệu luôn là mảng
    isLoading: isLoadingAnswer,
    error: errorAnswer,
  } = useQuizAnswer();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number | null>(null);

  if (isLoadingQuestion || isLoadingAnswer) return <p>Đang tải dữ liệu...</p>;
  if (errorQuestion || errorAnswer) return <p>Lỗi tải dữ liệu</p>;

  if (!questionData.length) return <p>Không có dữ liệu câu hỏi!</p>;

  const currentQuestion = questionData[currentQuestionIndex];

  const handleNext = () => {
    if (selectedAnswers === null) {
      message.warning("Vui lòng chọn một đáp án!");
      return;
    }

    if (currentQuestionIndex < questionData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswers(null);
    } else {
      message.success("Hoàn thành bài quiz!");
    }
  };

  return (
    <div className="quiz-container">
      <Card className="quiz-card">
        <Title level={4}>
          Câu hỏi {currentQuestionIndex + 1}/{questionData.length}
        </Title>
        <Text className="quiz-text">{currentQuestion?.content}</Text>
        <Radio.Group
          onChange={(e) => setSelectedAnswers(e.target.value)}
          value={selectedAnswers}
          className="quiz-radio-group"
        >
          {answerData
            .filter(
              (ans: any) =>
                ans.quizquestionId === currentQuestion.quizquestionId
            )
            .map((option: any) => (
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
        >
          {currentQuestionIndex < questionData.length - 1
            ? "Tiếp theo"
            : "Nộp bài"}
        </Button>
      </Card>
    </div>
  );
};

export default QuizTest;

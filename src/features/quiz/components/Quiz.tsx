import { useState, useEffect } from "react";
import { Card, Button, Radio, message, Typography, Spin, Col, Row } from "antd";
import { useQuizQuestion } from "../hooks/useGetQuizQuestion";
import { useQuizAnswer } from "../hooks/useGetQuizAnswer";
import { useSubmitQuiz } from "../hooks/useSubmitQuiz";
import { useSkinTypes } from "../../skin_type/hooks/useGetSkin";
import { useSkintypeServiceBySkintypeId } from "../../services/hooks/useGetSkintypeServiceBySkintypeId";
import { useServices } from "../../services/hooks/useGetService";
import { useNavigate } from "react-router-dom";
import "../../../style/Quiz.css";
import { PagePath } from "../../../enums/page-path.enum";
import { useSkintypeServiceByServiceId } from "../../services/hooks/useGetSkintypeServiceByServiceId";

const { Title, Text, Paragraph } = Typography;

const QuizTest = () => {
  const { data: questionData = [], isLoading: isLoadingQuestion } =
    useQuizQuestion();
  const { data: skinTypeData = [] } = useSkinTypes();
  const { data: answerData = [], isLoading: isLoadingAnswer } = useQuizAnswer();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [recommendedSkinType, setRecommendedSkinType] = useState<string | null>(
    null
  );
  const [skintypeId, setSkintypeId] = useState<number | null>(null);
  const [serviceId] = useState<number | null>(null);
  const navigate = useNavigate();

  const { mutate: submitQuiz, isPending: isSubmitting } = useSubmitQuiz();
  const customerId = Number(localStorage.getItem("customerId") || "1");

  const { data: skintypeServiceData = [] } = useSkintypeServiceBySkintypeId(
    skintypeId ? skintypeId.toString() : ""
  );

  const { data: skintypeServiceIdData = [] } = useSkintypeServiceByServiceId(
    serviceId ? serviceId.toString() : ""
  );

  const { data: allServices = [] } = useServices();

  const handleNavigate = (serviceId: number) => {
    navigate(PagePath.SKIN_SERVICE_DETAIL, {
      state: {
        serviceId: serviceId,
      },
    });
  };

  useEffect(() => {
    console.log("Recommended Skin Type:", recommendedSkinType);
    console.log("Skin Type Data:", skinTypeData);
    if (recommendedSkinType) {
      const matchedSkin = skinTypeData.find(
        (skin) =>
          skin.skintypeName.toLowerCase() === recommendedSkinType.toLowerCase()
      );
      if (matchedSkin) {
        setSkintypeId(matchedSkin.skintypeId);
      }
    }
  }, [recommendedSkinType, skinTypeData]);

  if (isLoadingQuestion || isLoadingAnswer)
    return <Spin tip="Đang tải câu hỏi..." />;
  if (!questionData.length) return <p>Không có dữ liệu câu hỏi!</p>;

  const currentQuestion = questionData[currentQuestionIndex];

  const handleAnswerChange = (questionId: number, answerId: number) => {
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

  const handleSubmit = () => {
    const submitData = {
      customerId,
      answers: questionData.map((q) => ({
        questionId: q.quizquestionId,
        answerId: selectedAnswers[q.quizquestionId],
      })),
    };

    submitQuiz(submitData, {
      onSuccess: (data) => {
        message.success("Bài quiz đã được gửi thành công!");
        setRecommendedSkinType(data.recommendedSkinType || "Không xác định");
      },
      onError: () => {
        message.error("Có lỗi xảy ra khi nộp bài! Vui lòng thử lại.");
      },
    });
  };

  const matchedSkinType = skinTypeData.find(
    (skin) =>
      skin.skintypeName.toLowerCase() === recommendedSkinType?.toLowerCase()
  );

  const matchedServices = Array.isArray(skintypeServiceData)
    ? (skintypeServiceData as { serviceId: number }[])
        .map((skintypeService) =>
          allServices.find(
            (service) => service.serviceId === skintypeService.serviceId
          )
        )
        .filter((service) => service !== undefined)
    : [];

  console.log("serviceId được truyền vào API:", serviceId);
  console.log("skintypeServiceIdData:", skintypeServiceIdData);
  console.log("allServices:", allServices);
  console.log("skinTypeData:", skinTypeData);

  return (
    <div className="quiz-container">
      {!recommendedSkinType && (
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
            style={{ marginTop: 20 }}
            onClick={handleNext}
            loading={isSubmitting}
          >
            {currentQuestionIndex < questionData.length - 1
              ? "Tiếp theo"
              : "Hoàn thành"}
          </Button>
        </Card>
      )}

      {recommendedSkinType && matchedSkinType && (
        <Card className="result-card" style={{ marginTop: 20 }}>
          <Title level={4}>Loại da của bạn:</Title>
          <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
            {matchedSkinType.skintypeName}
          </Text>
          <Title level={5}>Ưu điểm:</Title>
          <Paragraph>{matchedSkinType.pros}</Paragraph>
          <Title level={5}>Nhược điểm:</Title>
          <Paragraph>{matchedSkinType.cons}</Paragraph>
          <Title level={5}>Hướng dẫn chăm sóc:</Title>
          <Paragraph>{matchedSkinType.skincareGuide}</Paragraph>
        </Card>
      )}

      {matchedServices.length > 0 && (
        <div
          className="service-list"
          style={{
            marginTop: 20,
            gap: "20px",
          }}
        >
          <Title level={4}>Dịch vụ phù hợp:</Title>
          <hr />
          <Row gutter={[16, 16]} justify="start">
            {matchedServices.map((service) => (
              <Col
                key={service.serviceId}
                xs={24}
                sm={12}
                md={8}
                lg={6}
                style={{ display: "flex" }}
              >
                <Card
                  hoverable
                  cover={
                    <img
                      alt={service.name}
                      src={service.image}
                      style={{ height: 222 }}
                    />
                  }
                  style={{ width: "-webkit-fill-available" }}
                >
                  <Title level={5} style={{ marginTop: "10px" }}>
                    {service.name}
                  </Title>
                  {/* <Text>
                    {getSkinTypesForService(service.serviceId) ||
                      "Không có thông tin"}
                  </Text> */}
                  <Text strong>Giá: {service.price} VNĐ</Text>
                  <br />
                  <Text>Thời gian: {service.duration} phút</Text>
                  <Button
                    type="primary"
                    style={{
                      marginTop: "10px",
                      background: "rgb(193, 154, 107)",
                    }}
                    onClick={() => handleNavigate(service.serviceId)}
                  >
                    Chi tiết
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default QuizTest;

// import { useState } from "react";
// import { Card, Button, Radio, message, Typography, Divider, List } from "antd";
// import { Question, SkinCareProcess } from "../dto/quiz.dto";

// const { Title, Text } = Typography;

// const quizData: Question[] = [
//   {
//     id: 1,
//     question: "How does your skin feel after washing your face?",
//     options: [
//       { text: "Tight and dry", skinType: "Dry" },
//       { text: "Oily and shiny", skinType: "Oily" },
//       { text: "Normal", skinType: "Normal" },
//       { text: "Sensitive or red", skinType: "Sensitive" },
//     ],
//   },
//   {
//     id: 2,
//     question: "How often do you notice acne or blackheads?",
//     options: [
//       { text: "Rarely", skinType: "Normal" },
//       { text: "Often", skinType: "Oily" },
//       { text: "Almost never", skinType: "Dry" },
//       { text: "Sometimes, but it irritates easily", skinType: "Sensitive" },
//     ],
//   },
//   {
//     id: 3,
//     question: "How does your skin feel at the end of the day?",
//     options: [
//       { text: "Very oily", skinType: "Oily" },
//       { text: "Dry or flaky", skinType: "Dry" },
//       { text: "Balanced", skinType: "Normal" },
//       { text: "Irritated or itchy", skinType: "Sensitive" },
//     ],
//   },
// ];

// const skinCareProcesses: SkinCareProcess[] = [
//   {
//     skinType: "Dry",
//     description: "Hydrating and moisturizing routine for dry skin.",
//     price: "$50/session",
//     steps: [
//       { title: "Cleanse", description: "Use a gentle, hydrating cleanser." },
//       {
//         title: "Moisturize",
//         description: "Apply a rich moisturizer to lock in hydration.",
//       },
//       {
//         title: "Protect",
//         description: "Use SPF to protect against sun damage.",
//       },
//     ],
//   },
//   {
//     skinType: "Oily",
//     description: "Oil control and acne prevention routine.",
//     price: "$40/session",
//     steps: [
//       { title: "Cleanse", description: "Use a foaming cleanser." },
//       { title: "Tone", description: "Apply an oil-controlling toner." },
//       {
//         title: "Treat",
//         description: "Use salicylic acid or other acne treatments.",
//       },
//     ],
//   },
//   {
//     skinType: "Normal",
//     description: "Balanced skincare routine for normal skin.",
//     price: "$35/session",
//     steps: [
//       { title: "Cleanse", description: "Use a mild cleanser." },
//       { title: "Hydrate", description: "Apply a light moisturizer." },
//       { title: "Protect", description: "Use SPF daily." },
//     ],
//   },
//   {
//     skinType: "Sensitive",
//     description: "Gentle routine for sensitive skin.",
//     price: "$60/session",
//     steps: [
//       { title: "Cleanse", description: "Use a fragrance-free cleanser." },
//       { title: "Soothe", description: "Apply a calming serum." },
//       { title: "Protect", description: "Use SPF for sensitive skin." },
//     ],
//   },
// ];

// const QuizTest = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
//   const [resultSkinType, setResultSkinType] = useState<string | null>(null);

//   const currentQuestion = quizData[currentQuestionIndex];

//   const handleNext = () => {
//     if (!selectedSkinTypes[currentQuestionIndex]) {
//       message.warning("Please select an answer!");
//       return;
//     }

//     if (currentQuestionIndex < quizData.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     } else {
//       const mostCommonSkinType = selectedSkinTypes.sort(
//         (a, b) =>
//           selectedSkinTypes.filter((type) => type === b).length -
//           selectedSkinTypes.filter((type) => type === a).length
//       )[0];
//       setResultSkinType(mostCommonSkinType);
//     }
//   };

//   const handleSelect = (skinType: string) => {
//     const updated = [...selectedSkinTypes];
//     updated[currentQuestionIndex] = skinType;
//     setSelectedSkinTypes(updated);
//   };

//   const recommendedProcess = skinCareProcesses.find(
//     (process) => process.skinType === resultSkinType
//   );

//   return (
//     <div style={{ maxWidth: 600, margin: "50px auto", padding: 20 }}>
//       {!resultSkinType ? (
//         <Card style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
//           <Title level={4}>
//             Question {currentQuestionIndex + 1}/{quizData.length}
//           </Title>
//           <Text style={{ fontSize: 16 }}>{currentQuestion.question}</Text>
//           <Radio.Group
//             onChange={(e) => handleSelect(e.target.value)}
//             value={selectedSkinTypes[currentQuestionIndex]}
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               gap: "10px",
//               marginTop: 20,
//             }}
//           >
//             {currentQuestion.options.map((option) => (
//               <Radio key={option.text} value={option.skinType}>
//                 {option.text}
//               </Radio>
//             ))}
//           </Radio.Group>
//           <Button
//             type="primary"
//             style={{ marginTop: 20, alignSelf: "center" }}
//             onClick={handleNext}
//           >
//             {currentQuestionIndex < quizData.length - 1 ? "Next" : "Submit"}
//           </Button>
//         </Card>
//       ) : (
//         <div style={{ textAlign: "center" }}>
//           <Title level={3}>
//             Recommended Skincare for {resultSkinType} Skin
//           </Title>
//           <Text style={{ fontSize: 16, color: "#555" }}>
//             {recommendedProcess?.description}
//           </Text>
//           <Divider />
//           <Title level={4}>Price: {recommendedProcess?.price}</Title>
//           <Divider />
//           <List
//             bordered
//             header={<Title level={5}>Steps:</Title>}
//             dataSource={recommendedProcess?.steps || []}
//             renderItem={(step) => (
//               <List.Item>
//                 <Text strong>{step.title}:</Text> {step.description}
//               </List.Item>
//             )}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizTest;
import { useState } from "react";
import { Card, Button, Radio, message, Typography, Divider, Table } from "antd";
import { Question, SkinCareProcess } from "../dto/quiz.dto";

const { Title, Text } = Typography;

const quizData: Question[] = [
  {
    id: 1,
    question: "Da của bạn cảm thấy như thế nào sau khi rửa mặt?",
    options: [
      { text: "Căng và khô", skinType: "Da khô" },
      { text: "Bị nhần và bóng dầu", skinType: "Da dầu" },
      { text: "Bình thường", skinType: "Da bình thường" },
      { text: "Nhạy cảm hoặc đỏ", skinType: "Da nhạy cảm" },
    ],
  },
  {
    id: 2,
    question: "Bạn thường bắt gặp mụn hoặc mụn đầu đen bao nhiêu lâu một lần?",
    options: [
      { text: "Hiếm khi", skinType: "Da bình thường" },
      { text: "Thường xuyên", skinType: "Da dầu" },
      { text: "Gần như không bao giờ", skinType: "Da khô" },
      { text: "Thỉnh thoảng, nhưng dễ kích ứng", skinType: "Da nhạy cảm" },
    ],
  },
  {
    id: 3,
    question: "Da của bạn cảm thấy như thế nào vào cuối ngày?",
    options: [
      { text: "Rất nhần dầu", skinType: "Da dầu" },
      { text: "Khô hoặc bong tróc", skinType: "Da khô" },
      { text: "Cân bằng", skinType: "Da bình thường" },
      { text: "Kích ứng hoặc ngứa", skinType: "Da nhạy cảm" },
    ],
  },
];

const skinCareProcesses: SkinCareProcess[] = [
  {
    skinType: "Da khô",
    description: "Quy trình dưỡng âm và cung cấp độ ẩm cho da khô.",
    price: "$50/lần",
    steps: [
      {
        title: "Làm sạch",
        description: "Sử dụng sản phẩm làm sạch dịu nhẹ, cung cấp độ ẩm.",
      },
      {
        title: "Dưỡng âm",
        description: "Thoa kem dưỡng âm dành cho da khô để duy trì độ ẩm.",
      },
      {
        title: "Bảo vệ",
        description:
          "Sử dụng kem chống nắng để bảo vệ da khỏi tác hại của ánh nắng mặt trời.",
      },
    ],
  },
  {
    skinType: "Da dầu",
    description: "Quy trình kiểm dầu và ngăn ngừa mụn.",
    price: "$40/lần",
    steps: [
      {
        title: "Làm sạch",
        description: "Sử dụng sản phẩm làm sạch dành cho da dầu.",
      },
      { title: "Cân bằng", description: "Thoa toner kiểm dầu." },
      {
        title: "Điều trị",
        description:
          "Sử dụng sản phẩm có chứa acid salicylic hoặc các sản phẩm điều trị mụn.",
      },
    ],
  },
  {
    skinType: "Da bình thường",
    description: "Quy trình dưỡng da cân bằng cho da bình thường.",
    price: "$35/lần",
    steps: [
      {
        title: "Làm sạch",
        description: "Sử dụng sản phẩm làm sạch nhẹ nhàng.",
      },
      { title: "Dưỡng âm", description: "Thoa kem dưỡng độ ẩm nhẹ." },
      { title: "Bảo vệ", description: "Sử dụng kem chống nắng hàng ngày." },
    ],
  },
  {
    skinType: "Da nhạy cảm",
    description: "Quy trình dưỡng da nhẹ nhàng dành cho da nhạy cảm.",
    price: "$60/lần",
    steps: [
      {
        title: "Làm sạch",
        description: "Sử dụng sản phẩm làm sạch không mùi hương.",
      },
      { title: "Làm diễu hoà", description: "Thoa serum làm diễu hoà da." },
      {
        title: "Bảo vệ",
        description: "Sử dụng kem chống nắng dành cho da nhạy cảm.",
      },
    ],
  },
];

// const skinInfo: Skin[] = [
//   {
//     id: 1,
//     name: "Da khô",
//     descriptions: "",
//     image: "",
//   },
//   {
//     id: 2,
//     name: "Da khô",
//     descriptions: "",
//     image: "",
//   },
//   {
//     id: 3,
//     name: "Da khô",
//     descriptions: "",
//     image: "",
//   },
// ];

const QuizTest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [resultSkinType, setResultSkinType] = useState<string | null>(null);

  const currentQuestion = quizData[currentQuestionIndex];

  const handleNext = () => {
    if (!selectedSkinTypes[currentQuestionIndex]) {
      message.warning("Vui lòng chọn một đáp án!");
      return;
    }

    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const mostCommonSkinType = selectedSkinTypes.sort(
        (a, b) =>
          selectedSkinTypes.filter((type) => type === b).length -
          selectedSkinTypes.filter((type) => type === a).length
      )[0];
      setResultSkinType(mostCommonSkinType);
    }
  };

  const handleSelect = (skinType: string) => {
    const updated = [...selectedSkinTypes];
    updated[currentQuestionIndex] = skinType;
    setSelectedSkinTypes(updated);
  };

  const recommendedProcess = skinCareProcesses.find(
    (process) => process.skinType === resultSkinType
  );

  const columns = [
    {
      title: "Bước",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "50px auto", padding: 20 }}>
      {!resultSkinType ? (
        <Card style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <Title level={4}>
            Câu hỏi {currentQuestionIndex + 1}/{quizData.length}
          </Title>
          <Text style={{ fontSize: 16 }}>{currentQuestion.question}</Text>
          <Radio.Group
            onChange={(e) => handleSelect(e.target.value)}
            value={selectedSkinTypes[currentQuestionIndex]}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: 20,
            }}
          >
            {currentQuestion.options.map((option) => (
              <Radio key={option.text} value={option.skinType}>
                {option.text}
              </Radio>
            ))}
          </Radio.Group>
          <Button
            type="primary"
            style={{ marginTop: 20, alignSelf: "center" }}
            onClick={handleNext}
          >
            {currentQuestionIndex < quizData.length - 1
              ? "Tiếp theo"
              : "Nộp bài"}
          </Button>
        </Card>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Title level={3}>Quy trình dưỡng da gợi ý cho {resultSkinType}</Title>
          <Text style={{ fontSize: 16, color: "#555" }}>
            {recommendedProcess?.description}
          </Text>
          <Divider />
          <Title level={4}>Giá: {recommendedProcess?.price}</Title>
          <Divider />
          <Table
            dataSource={recommendedProcess?.steps || []}
            columns={columns}
            pagination={false}
            bordered
          />
        </div>
      )}
    </div>
  );
};

export default QuizTest;

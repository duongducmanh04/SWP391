import { Layout, Button, Card, Row, Col, Typography, Image } from "antd";
import { RightOutlined, ArrowRightOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import "../style/HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import { PagePath } from "../enums/page-path.enum";
import { useTherapists } from "../features/skin_therapist/hooks/useGetTherapist";

const { Content } = Layout;

const { Title, Text, Paragraph } = Typography;

// const experts = [
//   {
//     id: 1,
//     name: "Nancy Reimer",
//     expertise: "Giáo dục & Kiến thức chăm sóc da",
//     experience:
//       "Hàng chục năm kinh nghiệm và kiến thức chuyên sâu về chăm sóc da.",
//     field: "Giáo dục",
//     degree: "Giám đốc Giáo dục",
//     image: "https://via.placeholder.com/150",
//   },
//   {
//     id: 2,
//     name: "Tiffany Medois",
//     expertise: "Tư vấn viên & Chuyên viên thẩm mỹ",
//     experience:
//       "Từng làm nhà báo, nhà sản xuất, nhà làm phim tài liệu và biên tập viên.",
//     field: "Tư vấn",
//     degree: "Chuyên viên Thẩm mỹ Chứng nhận",
//     image: "https://via.placeholder.com/150",
//   },
//   {
//     id: 3,
//     name: "Katina Gilmore",
//     expertise: "Điều dưỡng & Thẩm mỹ",
//     experience:
//       "Kết hợp giữa điều dưỡng và thẩm mỹ để mang lại sự chuyên môn cá nhân hóa.",
//     field: "Chăm sóc sức khỏe",
//     degree: "Y tá Chứng nhận (R.N.)",
//     image: "https://via.placeholder.com/150",
//   },
//   {
//     id: 4,
//     name: "Bill Levins",
//     expertise: "Giám đốc Tiếp thị",
//     experience:
//       "Mang đến kiến thức thông qua sự am hiểu sâu sắc trong ngành kinh doanh chăm sóc da.",
//     field: "Tiếp thị",
//     degree: "Phó Chủ tịch Tiếp thị",
//     image: "https://via.placeholder.com/150",
//   },
// ];

const HomePage = () => {
  const { data: therapists = [] } = useTherapists();
  const navigate = useNavigate();

  const handleNavigate = (skintherapistId: number) => {
    navigate(PagePath.SKIN_THERAPIST_DETAIL, {
      state: {
        skintherapistId: skintherapistId,
      },
    });
  };

  const topTherapists = [...therapists]
    .sort((a, b) => parseInt(b.experience) - parseInt(a.experience))
    .slice(0, 4);

  return (
    <Layout>
      <Layout
        style={{
          background: "rgb(214 180 150)",
          padding: "60px",
          height: "100vh",
          display: "flex",
          alignItems: "center",
        }}
        className="homepage"
      >
        <Content>
          <Row gutter={32} align="middle">
            <Col xs={24} sm={12}>
              <Text
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  color: "rgba(0, 0, 0, 0.6)",
                }}
              >
                Hãy Chăm Sóc Da Như Cơ Thể Của Bạn
              </Text>
              <Title
                level={2}
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  marginTop: "10px",
                }}
              >
                Giới thiệu về Chăm sóc Da
              </Title>
              <Paragraph
                style={{
                  fontSize: "16px",
                  lineHeight: "1.6",
                  color: "rgba(0, 0, 0, 0.8)",
                  marginTop: "10px",
                }}
              >
                Làn da là tấm gương phản chiếu sức khỏe và vẻ đẹp của bạn. Việc
                chăm sóc da không chỉ giúp da sáng khỏe, mềm mịn mà còn mang lại
                cảm giác thư giãn và tự tin trong cuộc sống hằng ngày. Tại{" "}
                <Text strong>[Tên Spa/Thẩm mỹ viện]</Text>, chúng tôi cam kết
                mang đến các liệu trình chăm sóc da chuyên sâu, được thiết kế
                riêng cho từng loại da.
              </Paragraph>
              <Link to={PagePath.QUIZ}>
                <Button
                  type="primary"
                  style={{ marginTop: "20px" }}
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                >
                  Trắc nghiệm xác định loại da
                </Button>
              </Link>
            </Col>

            <Col
              xs={24}
              sm={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Image
                src="https://i.pinimg.com/736x/f6/7f/df/f67fdf6dbf84b63dbb570b4a6be2d2db.jpg"
                alt="Skincare Products"
                preview={false}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  height: 400,
                }}
              />
            </Col>
          </Row>
        </Content>
      </Layout>

      <div style={{ background: "#f8f6f4", padding: "50px 100px" }}>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={10}>
            <Card
              cover={
                <img
                  src="https://i.pinimg.com/736x/77/f8/c0/77f8c021a157035997684b122b51f222.jpg"
                  alt="Skincare Product"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              }
              variant="borderless"
              style={{ background: "transparent" }}
            />
          </Col>

          <Col xs={24} md={14}>
            <Typography>
              <Title level={5} type="secondary">
                Chăm Sóc Da
              </Title>
              <Title level={2}>Dịch Vụ Chăm Sóc Da Chuyên Sâu</Title>
              <Paragraph>
                Khám phá các phương pháp chăm sóc da hiện đại, giúp tái tạo và
                bảo vệ làn da. Chúng tôi sử dụng các sản phẩm tự nhiên kết hợp
                với công nghệ tiên tiến, mang đến sự trẻ hóa và rạng rỡ cho làn
                da của bạn.
              </Paragraph>
              <Button
                type="primary"
                size="large"
                icon={<RightOutlined />}
                style={{ background: "rgb(193, 154, 107)" }}
              >
                Đọc Thêm
              </Button>
            </Typography>
          </Col>
        </Row>
      </div>

      <Content style={{ padding: "50px", background: "#f5f5f5" }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Blog Làm Đẹp
        </Title>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={6} lg={6}>
            <Card
              cover={
                <Image
                  src="https://kbeauty.fpt.edu.vn/wp-content/uploads/2021/03/cham-soc-da-mat-o-spa-nao-tot-5.jpg"
                  alt="Blog 1"
                  style={{ height: 220 }}
                />
              }
            >
              <Title level={5}>Quy trình chăm sóc da mặt tốt nhất</Title>
              <Button type="link">Đọc thêm</Button>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Card
              cover={
                <Image
                  src="https://th.bing.com/th/id/OIP.fGzFa5roER6jRl2aE47EQgHaFT?w=233&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
                  alt="Blog 2"
                  style={{ height: 220 }}
                />
              }
            >
              <Title level={5}>Top 10 sản phẩm dưỡng da hot nhất</Title>
              <Button type="link">Đọc thêm</Button>
            </Card>
          </Col>
        </Row>
      </Content>

      <div style={{ padding: "20px", backgroundColor: "#FBFEFB" }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: "30px" }}>
          Top các chuyên viên trị liệu da có nhiều kinh nghiệm
        </Title>
        <Row gutter={[16, 16]}>
          {topTherapists.map((therapist) => (
            <Col xs={24} sm={12} md={8} lg={6} key={therapist.skintherapistId}>
              <Card
                hoverable
                style={{ borderRadius: "10px", textAlign: "center" }}
                cover={
                  <img
                    alt={therapist.name}
                    src={therapist.image || "https://via.placeholder.com/150"}
                    style={{
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      objectFit: "cover",
                      width: "70%",
                      margin: "0 auto",
                    }}
                  />
                }
              >
                <Title level={4} style={{ marginBottom: "5px" }}>
                  {therapist.name}
                </Title>
                <Text strong>{therapist.speciality}</Text>
                <br />
                <Text>{therapist.experience}</Text>
                <br />
                <Text type="secondary">Bằng cấp: {therapist.degree}</Text>
                <div style={{ marginTop: "15px" }}>
                  <Button
                    type="primary"
                    shape="round"
                    style={{ background: "rgb(193, 154, 107)" }}
                    onClick={() => handleNavigate(therapist.skintherapistId)}
                  >
                    Xem chi tiết {therapist.name}
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Layout>
  );
};

export default HomePage;

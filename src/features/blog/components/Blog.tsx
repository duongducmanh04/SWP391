import { Card, Row, Col, Typography, Avatar, Tag } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const featuredPost = {
  id: 0,
  title: "Tác Động Của Công Nghệ Đến Nơi Làm Việc: Sự Thay Đổi Ra Sao",
  author: "Tracey Wilson",
  date: "20 Tháng 8, 2022",
  coverImage: "https://via.placeholder.com/800x400",
  category: "Công Nghệ",
};

const blogPosts = [
  {
    id: 1,
    title: "Tác Động Của Công Nghệ Đến Nơi Làm Việc: Sự Thay Đổi Ra Sao",
    author: "Tracey Wilson",
    date: "20 Tháng 8, 2022",
    coverImage: "https://via.placeholder.com/300x200",
    category: "Công Nghệ",
  },
  {
    id: 2,
    title: "Cách Tăng Năng Suất Trong Môi Trường Làm Việc Từ Xa",
    author: "Jason Francisco",
    date: "20 Tháng 8, 2022",
    coverImage: "https://via.placeholder.com/300x200",
    category: "Năng Suất",
  },
  {
    id: 3,
    title: "Top 10 Điểm Đến Du Lịch Hàng Đầu Năm 2023",
    author: "Elizabeth Slavin",
    date: "30 Tháng 8, 2022",
    coverImage: "https://via.placeholder.com/300x200",
    category: "Du Lịch",
  },
];

const BlogPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (id: number) => {
    navigate(`/Homepage/blog/${id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "30px" }}>
        <Card
          hoverable
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative",
          }}
          className="blog"
          cover={
            <img
              alt={featuredPost.title}
              src={featuredPost.coverImage}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
              }}
            />
          }
          onClick={() => handleNavigate(featuredPost.id)}
        >
          <Tag color="blue">{featuredPost.category}</Tag>
          <Title
            level={2}
            style={{
              marginTop: "20px",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            {featuredPost.title}
          </Title>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <Avatar icon={<UserOutlined />} style={{ marginRight: "10px" }} />
            <Text>
              {featuredPost.author} &nbsp;|&nbsp; <CalendarOutlined />{" "}
              {featuredPost.date}
            </Text>
          </div>
        </Card>
      </div>

      {/* Blog Posts Grid */}
      <Row gutter={[16, 16]}>
        {blogPosts.map((post) => (
          <Col xs={24} sm={12} md={8} key={post.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={post.title}
                  src={post.coverImage}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px 10px 0 0",
                  }}
                />
              }
              style={{ borderRadius: "10px", overflow: "hidden" }}
              onClick={() => handleNavigate(post.id)}
            >
              <Tag color="blue">{post.category}</Tag>
              <Title level={4} style={{ marginTop: "10px" }}>
                {post.title}
              </Title>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Avatar
                  icon={<UserOutlined />}
                  style={{ marginRight: "10px" }}
                />
                <Text>
                  {post.author} &nbsp;|&nbsp; <CalendarOutlined /> {post.date}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BlogPage;

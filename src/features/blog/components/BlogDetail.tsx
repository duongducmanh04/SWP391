import {
  Card,
  Typography,
  Row,
  Col,
  Image,
  Divider,
  Spin
} from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useBlogById } from "../hooks/useGetBlogId";

const { Title, Text  } = Typography;

const BlogDetail = () => {
  const location = useLocation();
  const { blogId } = location.state || {}; 
  const { data: blog, isLoading, isError } = useBlogById(blogId || "");

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (isError || !blog) {
    return <div>Không tìm thấy bài viết</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Card
        style={{
          maxWidth: 1200,
          margin: "20px auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={24}>
          <Col xs={24} md={10}>
            <Image
              src={blog.image || "https://via.placeholder.com/800x400"}
              alt={blog.title}
              style={{ borderRadius: 8, width: "100%" }}
            />
          </Col>

          <Col xs={24} md={14}>
            <Title level={2} style={{ marginBottom: 16 }}>
              {blog.title}
            </Title>
            <Text style={{ fontSize: 16, color: "#555" }}>
              {blog.content}
            </Text>
            <Divider />
            <div style={{ marginBottom: 16 }}>
              <UserOutlined style={{ marginRight: 8 }} />
              <Text strong>Tác giả:</Text>  ID Khách hàng : {blog.customerId}
            </div>
            <div style={{ marginBottom: 16 }}>
              <CalendarOutlined style={{ marginRight: 8 }} />
              <Text strong>Ngày đăng:</Text> {blog.createAt ? new Date(blog.createAt).toLocaleDateString() : "Không có ngày"}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default BlogDetail;

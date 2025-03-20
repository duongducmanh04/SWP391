import { Card, Row, Col, Typography, Avatar, Button } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PagePath } from "../../../enums/page-path.enum";
import { useBlogs } from "../hooks/useGetBlog";
import dayjs from "dayjs";
import { useCustomers } from "../../user/hook/useGetCustomer";

const { Title, Text } = Typography;

const BlogPage = () => {
  const navigate = useNavigate();
  const { data: blogData } = useBlogs();
  const { data: customer } = useCustomers();

  const getCustomerName = (customerId: number) => {
    return customer?.find((c) => c.customerId === customerId)?.name;
  };

  const handleNavigate = (blogId: number) => {
    navigate(PagePath.BLOG_DETAIL, { state: { blogId } });
  };

  const handleCreateBlog = () => {
    navigate(PagePath.CREATE_BLOG);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button
        type="primary"
        style={{ marginBottom: "20px" }}
        onClick={handleCreateBlog}
      >
        Tạo Blog
      </Button>

      <Row gutter={[16, 16]}>
        {blogData?.map((blog) => (
          <Col xs={24} sm={12} md={8} key={blog.blogId}>
            <Card
              hoverable
              cover={
                <img
                  alt={blog.title}
                  src={
                    blog.image ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  style={{
                    height: "200px",
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "10px 10px 0 0",
                  }}
                />
              }
              style={{ borderRadius: "10px", overflow: "hidden" }}
              onClick={() => handleNavigate(blog.blogId)}
            >
              <Title level={4} style={{ marginTop: "10px" }}>
                {blog.title}
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
                  {getCustomerName(blog.customerId)} &nbsp;|&nbsp;
                  <CalendarOutlined />{" "}
                  {dayjs(blog.createdAt).format("DD [tháng] MM, YYYY")}
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

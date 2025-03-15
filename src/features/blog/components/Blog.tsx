import { Card, Typography, Spin  } from "antd";
import { useNavigate } from "react-router-dom";
import { useBlogs } from "../hooks/useGetBlog";
import { PagePath } from "../../../enums/page-path.enum";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const BlogPage = () => {
  const navigate = useNavigate();
  const { data: blogs, isLoading, error } = useBlogs();

  if (isLoading) return <Spin size="large" />;
  if (error || !blogs) return <Text type="danger">Không thể tải bài viết.</Text>;
  
  return (
 
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
    <Title level={2}>Danh sách bài viết</Title>
    {blogs.map((blog) => (
      
      <Card
        key={blog.blogId}
        hoverable
        style={{ marginBottom: "20px", cursor: "pointer" }}
        onClick={() =>
          navigate(PagePath.BLOG_DETAIL, {
            state: { blogId: blog.blogId },
          })
        }
        
      >
        <img
          alt={blog.title}
          src={blog.image || "https://via.placeholder.com/800x400"}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
        <Title level={4} style={{ marginTop: "10px" }}>{blog.title}</Title>
        <Text>{blog.content.slice(0, 100)}...</Text>
        <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
          <UserOutlined style={{ marginRight: "5px" }} />
          <Text>ID Khách hàng : {blog.customerId}</Text>
        </div>
        <div style={{ marginTop: "5px", display: "flex", alignItems: "center" }}>
          <CalendarOutlined style={{ marginRight: "5px" }} />
          <Text>
            Ngày tạo: {blog.createAt ? new Date(blog.createAt).toLocaleDateString() : "Không có ngày"}
          </Text>
          
        </div>
     
      </Card>
    ))}
  </div>
  );
};

export default BlogPage;

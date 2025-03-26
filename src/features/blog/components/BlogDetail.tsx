import { useLocation } from "react-router-dom";
import { Typography, Card, Divider, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useBlogById } from "../hooks/useGetBlogId";
import dayjs from "dayjs";
import { useCustomers } from "../../user/hook/useGetCustomer";

const { Title, Text, Paragraph } = Typography;

const BlogDetail = () => {
  const location = useLocation();
  const { blogId } = location.state || {};
  const { data: blog } = useBlogById(blogId || "");
  const { data: customer } = useCustomers();

  const getCustomerName = (customerId: number) => {
    return customer?.find((c) => c.customerId === customerId)?.name;
  };

  const blogDetail = {
    id: blogId,
    title:
      "Tác động của công nghệ đối với môi trường làm việc: Công nghệ đang thay đổi như thế nào",
    author: "Tracey Wilson",
    date: "20 Tháng 8, 2022",
    coverImage: "https://via.placeholder.com/800x400",
    content: `
      Du lịch là một trải nghiệm tuyệt vời giúp mở ra những chân trời mới, đưa chúng ta đến với các nền văn hóa khác nhau 
      và tạo ra những kỷ niệm khó quên suốt đời. Tuy nhiên, du lịch cũng có thể gây căng thẳng và áp lực, đặc biệt nếu 
      bạn không lên kế hoạch và chuẩn bị đầy đủ...
    `,
    quote: `“Du lịch có thể đưa bạn đến những môi trường mới và tiềm ẩn các rủi ro về sức khỏe, vì vậy rất quan trọng để bạn thực hiện các biện pháp đảm bảo an toàn và sức khỏe.”`,
    adImage: "https://via.placeholder.com/800x100",
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        background: "#fff",
      }}
    >
      {/* Tiêu đề bài viết */}
      <Card
        cover={
          <img
            alt={blog?.title}
            src={blog?.image}
            style={{ width: "100%", objectFit: "cover", height: "400px" }}
          />
        }
        bordered={false}
        style={{
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <Title level={2}>{blog?.title}</Title>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <Avatar icon={<UserOutlined />} style={{ marginRight: "10px" }} />
          <Text>
            Bởi{" "}
            {blog?.customerId !== undefined
              ? getCustomerName(blog.customerId)
              : ""}{" "}
            | {dayjs(blog?.createAt).format("DD [tháng] MM, YYYY")}
          </Text>
        </div>
      </Card>

      <Typography>
        <Paragraph>{blog?.content}</Paragraph>
        <Divider />
        <blockquote
          style={{ fontStyle: "italic", color: "#888", padding: "10px 20px" }}
        >
          {blogDetail.quote}
        </blockquote>
        <Divider />
        <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
          lacinia odio vitae vestibulum vestibulum...
        </Paragraph>
      </Typography>

      {/* <Card
        bordered={false}
        style={{
          marginTop: "20px",
          borderRadius: "10px",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <img
          alt="Quảng cáo"
          src={blogDetail.adImage}
          style={{ width: "100%", objectFit: "cover" }}
        />
        <Text type="secondary">Bạn có thể đặt quảng cáo 750x100</Text>
      </Card> */}
    </div>
  );
};

export default BlogDetail;

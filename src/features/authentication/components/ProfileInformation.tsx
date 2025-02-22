import useAuthStore from "../hooks/useAuthStore";
import { Form, Typography } from "antd";

const { Text } = Typography;

export default function ProfileInformation() {
  const [form] = Form.useForm();

  const { user } = useAuthStore();

  return (
    <Form form={form} initialValues={{}}>
      <Form.Item label={"Họ & Tên"}>
        <Text className=" font-medium">{user?.username}</Text>
      </Form.Item>
      <Form.Item label={"Số điện thoại"}>
        {/* <Text className=" font-medium">{user?.phoneNumber}</Text> */}
      </Form.Item>
      <Form.Item label={"Email"}>
        {/* <Text className=" font-medium">{user?.email}</Text> */}
      </Form.Item>
    </Form>
  );
}

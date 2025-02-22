import { Button, Result } from "antd";

const Complete = () => (
  <Result
    status="success"
    title="Đặt dịch vụ thành công"
    subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
    extra={[
      <Button type="primary" key="goBack">
        Quay về trang chủ
      </Button>,
    ]}
  />
);

export default Complete;

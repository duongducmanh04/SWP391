import { Table } from "antd";
import { useServices } from "../features/services/hooks/useGetService";
import "../style/PricingPage.css";

const ServiceTable = () => {
  const { data, isLoading, error } = useServices();

  const columns = [
    { title: "Tên Dịch vụ", dataIndex: "name", key: "name" }, // Không dùng inline styles
    { title: "Giá dịch vụ", dataIndex: "price", key: "price" }, // Không dùng inline styles
  ];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="service-table-container">
      <Table
        dataSource={data}
        columns={columns} // Đảm bảo sử dụng biến columns
        rowKey="serviceId"
        pagination={{ pageSize: 10 }} // Hiển thị 10 dòng mỗi trang
        scroll={{ y: 450 }} // Điều chỉnh chiều cao
      />
    </div>
  );
};

export default ServiceTable;

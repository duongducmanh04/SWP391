import { Table } from "antd";
import { useServices } from "../features/services/hooks/useGetService";

const ServiceTable = () => {
  const { data, isLoading, error } = useServices();

  const columns = [
    { title: "Tên Dịch Vụ", dataIndex: "name", key: "name" },
    { title: "Giá (VND)", dataIndex: "price", key: "price" },
  ];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <Table dataSource={data} columns={columns} rowKey="serviceId" />;
};

export default ServiceTable;

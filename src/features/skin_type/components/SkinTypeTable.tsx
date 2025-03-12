import React, { useState, useMemo } from "react";
import { Table, Input, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSkinTypes } from "../hooks/useGetSkin";
import { useDeleteSkinType } from "../hooks/useDeleteSkinType";
import { TablePaginationConfig } from "antd/es/table";
import { SkinDto } from "../dto/skin.dto"; // Import kiểu dữ liệu SkinDto

interface SkinType {
  skinTypeId: string;
  name: string;
  description: string;
}

const SkinTypeTable: React.FC = () => {
  const { data: skinDtos, isLoading, refetch } = useSkinTypes(); // Sửa tên biến để rõ nghĩa hơn
  const { mutate: deleteSkinType } = useDeleteSkinType();

  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Chuyển đổi dữ liệu từ SkinDto[] thành SkinType[]
  const skinTypes: SkinType[] =
    skinDtos?.map((skin: SkinDto) => ({
      skinTypeId: skin.skintypeId.toString(), // Đảm bảo là string
      name: skin.skintypeName,
      description: skin.description,
    })) || [];

  const filteredSkinTypes = useMemo(() => {
    return skinTypes.filter((skin: SkinType) =>
      skin.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [skinTypes, searchText]);

  const handleDelete = (skinTypeId: string) => {
    deleteSkinType(Number(skinTypeId), {
      // Chuyển skinTypeId thành số
      onSuccess: () => {
        message.success("Xóa loại da thành công");
        refetch();
      },
      onError: () => {
        message.error("Xóa loại da thất bại");
      },
    });
  };

  const columns = [
    {
      title: "Tên loại da",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: unknown, record: SkinType) => (
        <Button danger onClick={() => handleDelete(record.skinTypeId)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Input.Search
          placeholder="Tìm kiếm loại da"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm loại da
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredSkinTypes}
        loading={isLoading}
        pagination={pagination}
        rowKey="skinTypeId"
        onChange={(pagination: TablePaginationConfig) =>
          setPagination({
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
          })
        }
      />
    </div>
  );
};

export default SkinTypeTable;

import React, { useState, useMemo } from "react";
import { Table, Input, Button, message, Modal, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSkinTypes } from "../hooks/useGetSkin";
import { useDeleteSkinType } from "../hooks/useDeleteSkinType";
import { useCreateSkinType } from "../hooks/useCreateSkinType";
import { TablePaginationConfig } from "antd/es/table";
import { SkinDto } from "../dto/skin.dto";

interface SkinType {
  skinTypeId: string;
  name: string;
  description: string;
}

const SkinTypeTable: React.FC = () => {
  const { data: skinDtos, isLoading, refetch } = useSkinTypes();
  const { mutate: deleteSkinType } = useDeleteSkinType();
  const { mutate: createSkinType } = useCreateSkinType();

  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const skinTypes: SkinType[] =
    skinDtos?.map((skin: SkinDto) => ({
      skinTypeId: skin.skintypeId.toString(),
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
      onSuccess: () => {
        message.success("Xóa loại da thành công");
        refetch();
      },
      onError: () => {
        message.error("Xóa loại da thất bại");
      },
    });
  };

  const handleAddSkinType = () => {
    form.validateFields().then((values) => {
      createSkinType(values, {
        onSuccess: () => {
          message.success("Thêm loại da thành công");
          setIsModalVisible(false);
          form.resetFields();
          refetch();
        },
        onError: () => {
          message.error("Thêm loại da thất bại");
        },
      });
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
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

      <Modal
        title="Thêm loại da"
        visible={isModalVisible}
        onOk={handleAddSkinType}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="skintypeName"
            label="Tên loại da"
            rules={[{ required: true, message: "Vui lòng nhập tên loại da" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SkinTypeTable;

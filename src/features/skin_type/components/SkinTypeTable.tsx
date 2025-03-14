/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Table,
  Input as AntInput,
  Button,
  message,
  Modal,
  Form,
  Space,
  Tooltip,
  Image,
  Flex,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSkinTypes } from "../hooks/useGetSkin";
import { useDeleteSkin } from "../hooks/useDeleteSkin";
import { useCreateSkin } from "../hooks/useCreateSkin";
import { useUpdateSkin } from "../hooks/useUpdateSkin";
import { TablePaginationConfig } from "antd/es/table";
import { SkinDto } from "../dto/skin.dto";
import { ColumnsType } from "antd/es/table";

const SkinTypeTable = () => {
  const { data: skinData, isLoading, refetch } = useSkinTypes();
  const { mutate: deleteSkinType } = useDeleteSkin();
  const { mutate: createSkinType } = useCreateSkin();
  const { mutate: updateSkinType } = useUpdateSkin();

  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkin, setEditingSkin] = useState<any>(null);
  const [form] = Form.useForm();

  const filterSkins = skinData?.filter((skin: any) =>
    skin.skintypeName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDeleteSkin = (skintypeId: number) => {
    deleteSkinType(skintypeId, {
      onSuccess: () => {
        message.success("Xóa loại da thành công");
        refetch();
      },
      onError: () => {
        message.error("Xóa loại da thất bại");
      },
    });
  };

  const handleCreate = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCreateSkin = () => {
    form.validateFields().then((values) => {
      createSkinType(values, {
        onSuccess: () => {
          message.success("Tạo loại da thành công");
          setIsModalOpen(false);
          form.resetFields();
          refetch();
        },
        onError: () => {
          message.error("Tạo loại da thất bại");
        },
      });
    });
  };

  const handleEdit = (record: any) => {
    setEditingSkin(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        updateSkinType(
          { skintypeId: editingSkin.skintypeId, data: values },
          {
            onSuccess: () => {
              message.success("Cập nhật loại da thành công");
              setIsModalOpen(false);
              setEditingSkin(null);
            },
            onError: (err) => {
              message.error(`Lỗi cập nhật loại da: ${err.message}`);
            },
          }
        );
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  };

  const columns: ColumnsType<SkinDto> = [
    {
      title: "No",
      dataIndex: "No",
      fixed: "left",
      width: 50,
      render: (_value: any, _record: any, index: number) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "ID",
      dataIndex: "skintypeId",
      key: "skintypeId",
    },
    {
      title: "Loại da",
      dataIndex: "skintypeName",
      key: "skintypeName",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <Image
          src={image}
          width={50}
          height={50}
          style={{ borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Actions",
      render: (_: unknown, record: SkinDto) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteSkin(record.skintypeId)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Flex gap="middle" justify="space-between">
        <div className="content-header">Danh sách loại da</div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Tạo loại da
        </Button>
      </Flex>
      <hr style={{ opacity: 0.1 }} />
      <Space direction="vertical" style={{ width: "100%" }}>
        <AntInput
          prefix={<SearchOutlined />}
          placeholder="Nhập loại da cần tìm"
          style={{ border: "none", backgroundColor: "transparent" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Space>
      <hr style={{ opacity: 0.1 }} />
      <Table
        columns={columns}
        dataSource={filterSkins}
        loading={isLoading}
        pagination={pagination}
        rowKey="skintypeId"
        onChange={(pagination: TablePaginationConfig) =>
          setPagination({
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
          })
        }
      />

      <Modal
        title={editingSkin ? "Cập nhật loại da" : "Tạo loại da"}
        open={isModalOpen}
        onOk={editingSkin ? handleUpdate : handleCreateSkin}
        onCancel={() => setIsModalOpen(false)}
        okText={editingSkin ? "Cập nhật" : "Tạo"}
        centered
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="skintypeName"
            label="Tên loại da"
            rules={[{ required: true, message: "Vui lòng nhập tên loại da" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="introduction"
            label="Giới thiệu"
            rules={[{ required: true, message: "Vui lòng nhập giới thiệu" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <AntInput.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="pros"
            label="Lợi ích"
            rules={[{ required: true, message: "Vui lòng nhập lợi ích" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="cons"
            label="Bất lợi"
            rules={[{ required: true, message: "Vui lòng nhập bất lợi" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="skincareGuide"
            label="Hướng dẫn chăm sóc da"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập hướng dẫn chăm sóc da",
              },
            ]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="image"
            label="Hình ảnh"
            rules={[{ required: true, message: "Vui lòng nhập hình ảnh" }]}
          >
            <AntInput />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SkinTypeTable;

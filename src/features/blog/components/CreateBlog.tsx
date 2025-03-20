import React, { useState } from "react";
import { storage } from "../../../firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button, Input, message, Spin } from "antd";
import { useCreateBlog } from "../hooks/useCreateBlog";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const CreateBlog: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutate } = useCreateBlog();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!imageFile) {
      message.error("Vui lòng chọn một ảnh để tải lên!");
      return;
    }

    const storageRef = ref(storage, `blogs/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    setUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Đang tải lên: ${progress}%`);
      },
      (error) => {
        console.error("Lỗi tải lên:", error);
        message.error("Lỗi tải ảnh lên, vui lòng thử lại!");
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          message.success("Tải ảnh lên thành công!");
          setUploading(false);
        });
      }
    );
  };

  const handleCreateBlog = () => {
    if (!title || !content || !imageUrl) {
      message.error("Vui lòng nhập đầy đủ thông tin và tải ảnh lên!");
      return;
    }

    mutate(
      {
        title,
        content,
        customerId: 1, // Sửa lại ID người dùng tương ứng
        image: imageUrl,
        createdAt: dayjs().format(),
      },
      {
        onSuccess: () => {
          message.success("Blog đã được tạo thành công!");
          navigate("/Homepage/Blog");
        },
        onError: () => {
          message.error("Có lỗi xảy ra khi tạo blog!");
        },
      }
    );
  };

  return (
    <div>
      <h1>Tạo Blog Mới</h1>
      <Input
        placeholder="Nhập tiêu đề blog"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Input.TextArea
        placeholder="Nhập nội dung blog"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{ marginBottom: "10px" }}
      />
      <Input type="file" accept="image/*" onChange={handleImageChange} />
      <Button
        onClick={handleUpload}
        disabled={uploading}
        style={{ marginTop: "10px" }}
      >
        {uploading ? <Spin /> : "Tải ảnh lên"}
      </Button>
      <Button
        type="primary"
        onClick={handleCreateBlog}
        style={{ marginTop: "10px" }}
        disabled={uploading || !imageUrl}
      >
        Tạo Blog
      </Button>

      {imageUrl && (
        <div>
          <p>Ảnh đã tải lên:</p>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{ width: 200, marginTop: 10 }}
          />
        </div>
      )}
    </div>
  );
};

export default CreateBlog;

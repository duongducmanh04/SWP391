import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BlogDto } from "../dto/blog.dto";

interface CreateBlogDto {
  title: string;
  content: string;
  customerId: number;
  image: string;
  createdAt: string;
}

const createBlog = async (newBlog: CreateBlogDto): Promise<BlogDto> => {
  const response = await axios.post<BlogDto>(
    "https://skincareservicebooking.onrender.com/createBlog",
    newBlog,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const useCreateBlog = () => {
  return useMutation<BlogDto, Error, CreateBlogDto>({
    mutationFn: createBlog,
  });
};

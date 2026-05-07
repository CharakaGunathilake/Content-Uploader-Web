import type { CourseContent } from "../types/CourseContent";
import axiosInstance from "./axiosInstance";

export const uploadFile = async (
  file: File,
  onProgress: (percent: number) => void
): Promise<CourseContent> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
      );
      onProgress(percent);
    },
  });
  return response.data.data;
};

export const fetchAllFiles = async (): Promise<CourseContent[]> => {
  const response = await axiosInstance.get("/files");

  return response.data.data;
};

export const fetchFileById = async (id: number): Promise<CourseContent> => {
  const response = await axiosInstance.get(`/files/${id}`);

  return response.data.data;
};

export const downloadFileById = async (id: number): Promise<Blob> => {
  const response = await axiosInstance.get(`/files/${id}/download`, {
    responseType: "blob",
  });

  return response.data;
};

import axios, { axiosAuth } from "@/utils/axios";
import { isAxiosError } from "axios";

export const getJoints = async () => {
  try {
    const response = await axios.get(`api/joints`);

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
};

export const getJoint = async (id: string) => {
  try {
    const response = await axios.get(`api/joints/${id}`);

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
};

export const addJoint = async (payload: IJointFormValues) => {
  try {
    const response = await axiosAuth.post(`api/joints`, {
      ...payload,
      type: payload.type.join(","),
      phone: payload.phone.join(","),
    });

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
};

export const updateJoint = async (
  id: string,
  payload: Partial<IJointFormValues>
) => {
  try {
    const response = await axiosAuth.patch(`api/joints/${id}`, payload);

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
};

export const deleteJoint = async (id: string) => {
  try {
    const response = await axiosAuth.delete(`api/joints/${id}`);

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
};

export const updateAvatar = async (id: string, file: File) => {
  try {
    const payload = new FormData();
    payload.append("avatar", file);

    const response = await axiosAuth.post(`api/joints/${id}/avatar`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
};

export const deleteAvatar = async (id: string) => {
  try {
    const response = await axiosAuth.delete(`api/joints/${id}/avatar`);

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
};

export const uploadGalleryImage = async (id: string, file: File) => {
  try {
    const payload = new FormData();
    payload.append("gallery-image", file);

    const response = await axiosAuth.post(
      `api/joints/${id}/gallery-image`,
      payload,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
};

export const deleteGalleryImage = async (id: string, key: string) => {
  try {
    const response = await axiosAuth.delete(
      `api/joints/${id}/gallery-image/${key}`
    );

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
};


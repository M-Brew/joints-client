import axios, { axiosAuth } from "@/utils/axios";
import { isAxiosError } from "axios";

export const addMeal = async (payload: IMealFormValues & { menu: string }) => {
  try {
    const response = await axiosAuth.post(`api/meals`, payload);

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
};

export const updateMeal = async (
  mealId: string,
  payload: IMealFormValues & { menu: string }
) => {
  try {
    const response = await axiosAuth.patch(`api/meals/${mealId}`, payload);

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
};

export const deleteMeal = async (mealId: string) => {
  try {
    const response = await axiosAuth.delete(`api/meals/${mealId}`);

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
};

export const uploadMealImage = async (id: string, file: File) => {
  try {
    const payload = new FormData();
    payload.append("image", file);

    const response = await axiosAuth.post(`api/meals/${id}/image`, payload, {
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

export const deleteMealImage = async (id: string) => {
  try {
    const response = await axiosAuth.delete(`api/meals/${id}/image`);

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
};

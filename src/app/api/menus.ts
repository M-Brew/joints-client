import axios, { axiosAuth } from "@/utils/axios";
import { isAxiosError } from "axios";

export const createMenu = async (payload: IMenuFormValues) => {
  try {
    const response = await axiosAuth.post(`api/menu`, {
      ...payload,
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

export const getMenu = async (menuId: string) => {
  try {
    const response = await axiosAuth.get(`api/menu/${menuId}`);

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
}

export const getJointMenus = async (jointId: string) => {
  try {
    const response = await axiosAuth.get(`api/menu/joint/${jointId}`);

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response;
    } else {
      console.log(error);
    }
  }
};
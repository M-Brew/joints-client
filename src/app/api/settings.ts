import axios, { axiosAuth } from "@/utils/axios";

export const getSettingItems = async (slug: string) => {
  try {
    const response = await axios.get(`api/${slug}`);
    
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const addSettingItem = async (
  slug: string,
  data: { name: string; description: string }
) => {
  try {
    const response = await axiosAuth.post(`/api/${slug}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const updateSettingItem = async (
  slug: string,
  itemId: string,
  data: { name?: string; description?: string }
) => {
  try {
    const response = await axiosAuth.patch(`/api/${slug}/${itemId}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const deleteSettingItem = async (
  slug: string,
  itemId: string
) => {
  try {
    const response = await axiosAuth.delete(`/api/${slug}/${itemId}`);

    return response;
  } catch (error: any) {
    return error.response;
  }
};

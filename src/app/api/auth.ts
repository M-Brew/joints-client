import axios from "@/utils/axios";

export async function signIn(credentials: { email: string; password: string }) {
  try {
    const response = await axios.post("/api/auth/sign-in", {
      email: credentials.email,
      password: credentials.password,
    });

    return response;
  } catch (error: any) {
    if (error) {
      return error.response;
    }
  }
}

export async function adminSignIn(credentials: {
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post("/api/auth/admin-sign-in", {
      email: credentials.email,
      password: credentials.password,
    });

    return response;
  } catch (error: any) {
    if (error) {
      return error.response;
    }
  }
}

export async function signOut(refreshToken: string) {
  try {
    const response = await axios.post("/api/auth/sign-out", {
      token: refreshToken,
    });

    return response;
  } catch (error: any) {
    if (error) {
      return error;
    }
  }
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await axios.post("/api/auth/token", {
      token: refreshToken
    });

    return response;
  } catch (error: any) {
    if (error) {
      return error;
    }
  }
}

import { api } from "../../lib/axios";

export interface RegisterParams {
  avatar?: File,
  name: string,
  password: string,
  email: string,
}

interface RegisterResponse {
  accessToken: string,
}

export async function register(params: RegisterParams) {
  const formData = new FormData();

  formData.append("name", params.name);
  formData.append("email", params.email);
  formData.append("password", params.password);

  if (params.avatar) {
    formData.append("avatar", params.avatar); // 🔥 arquivo aqui
  }

  console.log(formData.get('avatar'))

  const { data } = await api.post<RegisterResponse>('/auth/register', formData);

  return data;
}
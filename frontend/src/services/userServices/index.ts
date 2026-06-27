import { changePassword } from "./changePassword";
import { me } from "./me";
import { getMyOrganizations } from "./myOrganizations";
import { updateUser } from "./updateProfile";

export const usersService = {
  me,
  getMyOrganizations,
  updateUser,
  changePassword
}
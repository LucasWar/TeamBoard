import { changePassword } from "./changePassword";
import { confirmInvitation } from "./confirmInvitation";
import { me } from "./me";
import { getMyOrganizations } from "./myOrganizations";
import { updateUser } from "./updateProfile";

export const usersService = {
  me,
  getMyOrganizations,
  updateUser,
  changePassword,
  confirmInvitation,
}
import { changeStatusProject } from "./archiveProject";
import { createProject } from "./createProject";
import { deleteProject } from "./deleteProject";
import { listProjects } from "./listProjects";
import { updateProject } from "./updateProject";

export const projectService = {
  listProjects,
  createProject,
  deleteProject,
  updateProject,
  changeStatusProject
}
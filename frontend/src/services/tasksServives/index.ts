
import { create } from "./create";
import { deleteTask } from "./delete";
import { listMyTasks } from "./listMyTasks";
import { recentTasksByPriority } from "./listRecentTasksByPriority";
import { myKpis } from "./listTasksByProject";
import { listTasksByProjectId } from "./listTasksByProjectId";
import { update } from "./update";
import { updateStatus } from "./updateStatus";

export const tasksService = {
  myKpis,
  recentTasksByPriority,
  listTasksByProjectId,
  updateStatus,
  listMyTasks,
  create,
  update,
  deleteTask,
}
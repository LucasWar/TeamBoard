import { recentTasksByPriority } from "./listRecentTasksByPriority";
import { myKpis } from "./listTasksByProject";
import { listTasksByProjectId } from "./listTasksByProjectId";
import { updateStatus } from "./updateStatus";

export const tasksService = {
  myKpis,
  recentTasksByPriority,
  listTasksByProjectId,
  updateStatus,
}
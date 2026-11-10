import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { OnEvent } from '@nestjs/event-emitter';
import type { TaskType } from 'src/shared/types/task-type';
import { Task } from '@prisma/client';

interface JwtPayload {
  sub: string;
  email: string;
}

@WebSocketGateway({
  namespace: '/tasks',
  cors: { origin: '*' },
})
export class TaskGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Namespace;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token as string;
    const projectId = client.handshake.headers.project_id as string;
    if (!token) {
      client.disconnect();
      return;
    }
    if (!projectId) {
      client.disconnect();
      return;
    }
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      client.data.user = payload;
      await client.join(`Project: ${projectId}`);
    } catch {
      client.disconnect();
    }
  }

  @OnEvent('task.created')
  handleTaskCreatedEvent(task: TaskType) {
    this.server.to(`Project: ${task.projectId}`).emit('task.created', task);
  }

  @OnEvent('task.deleted')
  handleTaskDeleteEvent(projectId: string, taskId: string) {
    this.server.to(`Project: ${projectId}`).emit('task.deleted', taskId);
  }

  @OnEvent('task.updated')
  handleTaskUpdateEvent(task: TaskType) {
    this.server.to(`Project: ${task.projectId}`).emit('task.updated', task);
  }

  @OnEvent('tasks.reordered')
  handleTasksReordered(payload: {
    projectId: string;
    movedTask: Task;
    tasks: Task[];
  }) {
    this.server
      .to(`Project: ${payload.projectId}`)
      .emit('tasks.reordered', payload);
  }
}

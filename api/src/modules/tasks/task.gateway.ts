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
import { MembershipsService } from '../memberships/memberships.service';
import { ProjectsService } from '../projects/projects.service';
import { Logger } from '@nestjs/common';

interface JwtPayload {
  sub: string;
  email: string;
}

@WebSocketGateway({
  namespace: '/tasks',
  cors: { origin: '*' },
})
export class TaskGateway implements OnGatewayConnection {
  private readonly logger = new Logger();
  @WebSocketServer()
  server: Namespace;

  constructor(
    private readonly jwtService: JwtService,
    private readonly membershipsService: MembershipsService,
    private readonly projectsService: ProjectsService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token as string;
    const projectId = client.handshake.headers.project_id as string;
    if (!token) {
      this.logger.error('Websockt: Invalid token');
      client.disconnect();
      return;
    }
    if (!projectId) {
      this.logger.error('Websocket: not found project_id');
      client.disconnect();
      return;
    }
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      const orgId = client.handshake.headers.organization_id as string;
      const membership =
        await this.membershipsService.getMembershipByUserAndOrg(
          payload.sub,
          orgId,
        );
      const project =
        membership?.status === 'ACTIVE' &&
        (await this.projectsService.projectBelongsToOrganization(
          projectId,
          orgId,
        ));
      if (!project) {
        this.logger.error({
          menssage: `Unauthorized access to project`,
          metadata: {
            status: membership?.status,
            project,
            projectId,
            orgId,
          },
        });
        client.disconnect();
        return;
      }
      await client.join(`Project: ${projectId}`);
      this.logger.debug({
        menssage: `Sucess`,
        metadata: {
          status: membership?.status,
          project,
          projectId,
          orgId,
        },
      });
    } catch (error) {
      this.logger.error(`Task webscoket: ${error}`);
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

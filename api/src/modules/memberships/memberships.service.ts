import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MembershipsRepository } from 'src/shared/database/repositories/membership.repository';
import { AddMembershipDTO } from './dto/add-membership.dto';
import { EnumRole, EnumStatus } from '@prisma/client';

@Injectable()
export class MembershipsService {
  constructor(private readonly membershipRepo: MembershipsRepository) {}

  async getMembershipByUserAndOrg(userId: string, organizationId: string) {
    const memberBelongs = await this.membershipRepo.findUnique({
      where: {
        userId_organizationId: {
          organizationId,
          userId,
        },
      },
    });

    return memberBelongs;
  }

  async listMembership(userId: string, organizationId: string) {
    const record = await this.getMembershipByUserAndOrg(userId, organizationId);

    if (!record) {
      throw new ConflictException('Usuário não pertence a essa organização');
    }

    const members = await this.membershipRepo.findMany({
      where: {
        organizationId,
        userId: {
          not: userId,
        },
      },
      select: {
        role: true,
        status: true,
        user: {
          select: {
            id: true,
            avatar: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return members.map((member) => {
      return {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        avatar: member.user.avatar,
        role: member.role,
        status: member.status,
      };
    });
  }

  async addMembership(
    addMembershipDTO: AddMembershipDTO,
    organizationId: string,
  ) {
    const { userId, role } = addMembershipDTO;
    const membership = await this.getMembershipByUserAndOrg(
      userId,
      organizationId,
    );

    if (membership) {
      throw new ConflictException('Usuário ja cadastrado na organização');
    }

    const newMembership = await this.membershipRepo.create({
      data: {
        status: 'INVITED',
        userId,
        role,
        organizationId,
      },
    });

    return newMembership;
  }

  async confirmInvitation(userId: string, organizationId: string) {
    await this.membershipRepo.update({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      data: {
        status: 'ACTIVE',
      },
    });
  }

  async changeRole(userId: string, organizationId: string, newRole: EnumRole) {
    const membership = await this.getMembershipByUserAndOrg(
      userId,
      organizationId,
    );

    if (!membership) {
      throw new NotFoundException('Usuário não econtrado');
    }

    const newMembership = await this.membershipRepo.update({
      where: {
        userId_organizationId: {
          organizationId,
          userId,
        },
      },
      data: {
        role: newRole,
      },
    });

    return newMembership;
  }

  async removeMember(userId: string, organizationId: string) {
    const membership = await this.getMembershipByUserAndOrg(
      userId,
      organizationId,
    );

    if (!membership) {
      throw new NotFoundException('Membro não encontrado nesta organização.');
    }

    if (membership.role === 'ADMIN') {
      const adminCount = await this.membershipRepo.count({
        where: {
          organizationId,
          role: 'ADMIN',
          status: 'ACTIVE',
        },
      });

      if (adminCount <= 1) {
        throw new BadRequestException(
          'Não é possível remover o único administrador da organização.',
        );
      }
    }

    return this.membershipRepo.update({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      data: {
        status: EnumStatus.SUSPENDED,
        deletedAt: new Date(),
      },
    });
  }

  async verifyUserInOrg(userId: string, organizationId: string) {
    const membership = await this.membershipRepo.findUnique({
      where: {
        userId_organizationId: {
          organizationId,
          userId,
        },
      },
    });
    if (!membership) {
      throw new BadRequestException(
        'O usuário atribuído não pertence a esta organização.',
      );
    }
  }

  async verifyUserInOrgByEmail(email: string, organizationId: string) {
    const membership = await this.membershipRepo.findFirst({
      where: {
        AND: [{ user: { email } }, { organizationId }],
      },
      select: {
        userId: true,
      },
    });

    return membership ? membership.userId : undefined;
  }

  async findAll() {
    return await this.membershipRepo.findMany();
  }
}

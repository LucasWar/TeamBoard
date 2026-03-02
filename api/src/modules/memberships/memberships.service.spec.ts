import { Test, TestingModule } from '@nestjs/testing';
import { MembershipsService } from './memberships.service';
import { MembershipsRepository } from 'src/shared/database/repositories/membership.repository';
import { EnumRole } from '@prisma/client';

describe('MembershipsService', () => {
  let service: MembershipsService;

  const mockMembershipRepository = {
    create: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipsService,
        { provide: MembershipsRepository, useValue: mockMembershipRepository },
      ],
    }).compile();

    service = module.get<MembershipsService>(MembershipsService);
  });
  describe('addMembership', () => {
    const membershipDto = {
      userId: '1',
      role: EnumRole.USER,
    };
    it('Admin adiciona um novo membro a organização', async () => {
      const membershipFaker = {
        role: EnumRole.USER,
        userId: '1',
      };
      const ortganizationId = '1';
      mockMembershipRepository.create.mockResolvedValue(membershipDto);

      jest.spyOn(service, 'getMembershipByUserAndOrg').mockResolvedValue(null);
      const newMembership = await service.addMembership(
        membershipDto,
        ortganizationId,
      );

      expect(newMembership).toEqual(membershipFaker);
    });
  });
});

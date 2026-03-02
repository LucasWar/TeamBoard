import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from './organizations.service';
import { OrganizationRepository } from 'src/shared/database/repositories/organization.repository';
import { EnumPlan, EnumRole, EnumStatus } from '@prisma/client';

describe('OrganizationsService', () => {
  let service: OrganizationsService;

  const mockOrganzationRepo = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        { provide: OrganizationRepository, useValue: mockOrganzationRepo },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  describe('create', () => {
    const organizationDto = {
      name: 'Lucas warley LTDA',
      plan: EnumPlan.FREE,
    };

    const userFaker = {
      userId: '1',
      email: 'lucas@gmail.com',
    };

    it('Usuário irá criar uma organização com os dados corretos', async () => {
      const organizationFaker = {
        id: '1',
        name: 'Lucas warley LTDA',
        slug: 'lucas-warley-ltda',
        plan: EnumPlan.FREE,
        isActive: true,
        ownerUserId: userFaker.userId,
      };

      mockOrganzationRepo.create.mockResolvedValue(organizationFaker);

      const slugSpy = jest
        .spyOn(service as any, 'createAndValidateSlug')
        .mockResolvedValue('lucas-warley-ltda');

      const newOrganization = await service.create(organizationDto, userFaker);
      expect(newOrganization).toEqual(organizationFaker);

      expect(mockOrganzationRepo.create).toHaveBeenCalledTimes(1);
      expect(mockOrganzationRepo.create).toHaveBeenCalledWith({
        data: {
          name: 'Lucas warley LTDA',
          slug: 'lucas-warley-ltda',
          ownerUserId: userFaker.userId,
          memberships: {
            create: {
              userId: userFaker.userId,
              role: EnumRole.ADMIN,
              status: EnumStatus.ACTIVE,
            },
          },
        },
      });

      expect(slugSpy).toHaveBeenCalledWith(organizationFaker.name);

      expect(slugSpy).toHaveReturnedTimes(1);
    });
  });
});

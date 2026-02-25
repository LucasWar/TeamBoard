import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// Recebe um array de roles (ex: 'ADMIN', 'MANAGER') e anexa essa informação na rota
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export const UseAppGuard = () => UseGuards(JwtAuthGuard, RolesGuard);

import { PrismaGymsRepository } from '~/repositories/prisma/prisma-gyms-repository';
import { SearchGymsUseCase } from '../search-gyms';

export function makeSearchGymsUseCase() {
  const prismaUsersRepository = new PrismaGymsRepository()
  return new SearchGymsUseCase(prismaUsersRepository)
}
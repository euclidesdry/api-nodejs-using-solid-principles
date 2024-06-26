import { PrismaCheckInsRepository } from '~/repositories/prisma/prisma-check-ins-repository';
import { ValidateCheckInUseCase } from './../validate-check-in';

export function makeValidateCheckInUseCase() {
  const prismaUsersRepository = new PrismaCheckInsRepository()
  return new ValidateCheckInUseCase(prismaUsersRepository)
}

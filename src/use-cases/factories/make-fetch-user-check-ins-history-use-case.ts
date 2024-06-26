import { PrismaCheckInsRepository } from "~/repositories/prisma/prisma-check-ins-repository"
import { FetchUsersCheckInsHistoryUseCase } from "../fetch-user-check-ins-history"

export function makeFetchUserCheckInsHistoryUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  return new FetchUsersCheckInsHistoryUseCase(prismaCheckInsRepository)
}
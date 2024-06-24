import { Prisma, CheckIn } from '@prisma/client'

import { prisma } from '~/lib/prisma'

import { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  findByUserIdOnGymId(userId: string, date: Date): Promise<CheckIn | null> {
    throw new Error('Method not implemented.')
  }
  async create (data: Prisma.CheckInUncheckedCreateInput) {
    return await prisma.checkIn.create({
      data
    })
  }
}

import { Prisma, CheckIn } from '@prisma/client'

import { prisma } from '~/lib/prisma'

import { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create (data: Prisma.CheckInUncheckedCreateInput) {
    return await prisma.checkIn.create({
      data
    })
  }
}

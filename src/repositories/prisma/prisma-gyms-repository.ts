import { Gym } from '@prisma/client'

import { prisma } from '~/lib/prisma'

import { GymsRepository } from '../gyms-repository'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string): Promise<Gym | null> {
    return await prisma.gym.findUnique({
      where: {
        id
      }
    })
  }
}

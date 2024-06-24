import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

import { getDistanceBetweenCoordinatesInKilometers } from '~/utils/get-distance-between-coordinates'

import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string) {
    const user = this.items.find(gym => gym.id === id)

    if (!user) return null

    return user
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter(gym => {
      const distance = getDistanceBetweenCoordinatesInKilometers(
        { latitude: params.latitude, longitude: params.longitude },
        { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
      )

      return distance < 10 // distance less than 10km
    })
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description || null,
      phone: data.phone || null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }
}

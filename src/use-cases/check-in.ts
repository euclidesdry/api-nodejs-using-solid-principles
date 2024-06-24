import { CheckIn } from '@prisma/client'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

import { CheckInsRepository } from '~/repositories/check-ins-repository'
import { GymsRepository } from '~/repositories/gyms-repository'
import { getDistanceBetweenCoordinatesInKilometers } from '~/utils/get-distance-between-coordinates'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

type CheckInUseCaseResponse = {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) { }

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) throw new ResourceNotFoundError()

    const MAX_DISTANCE_IN_KILOMETERS = 0.01;
    const distance = getDistanceBetweenCoordinatesInKilometers(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() },
    )

    if (distance > MAX_DISTANCE_IN_KILOMETERS) throw new Error()

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnGymId(
      userId,
      new Date()
    )

    if (checkInOnSameDay) throw new Error()

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId
    })

    if (!checkIn) throw new Error()

    return { checkIn }
  }
}

import { CheckIn } from '@prisma/client'

import { InvalidCredentialsError } from './errors/invalid-credentials-error'

import { CheckInsRepository } from '~/repositories/check-ins-repository'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}

type CheckInUseCaseResponse = {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor (private checkInsRepository: CheckInsRepository) {}

  async execute ({
    userId,
    gymId
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    // auth
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId
    })

    if (!checkIn) throw new InvalidCredentialsError()

    return { checkIn }
  }
}

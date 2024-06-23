import { User } from '@prisma/client'
import { compare } from 'bcryptjs'

import { InvalidCredentialsError } from './errors/invalid-credentials-error'

import { UsersRepository } from '~/repositories/users-repository'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
 }

type AuthenticateUseCaseResponse = {
  user: User
}

export class AuthenticateUseCase { 
  constructor(
    private usersRepository: UsersRepository,
  ) { }
  
  async execute({email, password}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> { 
    // auth
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '~/repositories/in-memory/in-memory-users-repository';

import { InvalidCredentialsError } from './errors/invalid-credentials-error';

import { AuthenticateUseCase } from './authenticate';

let usersRepository = new InMemoryUsersRepository();
let sut = new AuthenticateUseCase(usersRepository);

const mockedUserData = {
  name: 'Peixe Fresco',
  email: 'peixe.fresco@example.com',
  password: '123456',
}

describe('Authenticate Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  })
  it('should be able to authenticate', async () => {
    const { name, email, password } = mockedUserData;

    await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6),
    })

    const { user } = await sut.execute({
      email,
      password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const { name, email, password } = mockedUserData;

    await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6),
    })

    await expect(() => sut.execute({
      email: 'peixe.fresco@myself.com',
      password,
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const { name, email, password } = mockedUserData;

    await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6),
    })

    await expect(() => sut.execute({
      email,
      password: `${password}.wrong`,
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
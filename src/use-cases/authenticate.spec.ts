import { expect, describe, it } from 'vitest'
import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '~/repositories/in-memory/in-memory-users-repository';

import { InvalidCredentialsError } from './errors/invalid-credentials-error';

import { AuthenticateUseCase } from './authenticate';

const mockedUserData = {
  name: 'Peixe Fresco',
  email: 'peixe.fresco@example.com',
  password: '123456',
}

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

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
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

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
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    const { name, email, password } = mockedUserData;

    await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6),
    })

    await expect(() => sut.execute({
      email,
      password: password + 'wrong',
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
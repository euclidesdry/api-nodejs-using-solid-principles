import { Environment } from "vitest";

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    console.log('Setting up Prisma Test Environment...')

    return {
      async teardown() {
        console.log('Tearing down Prisma Test Environment...')
      },
    }
  }
}
import { rng } from '@/modules/random-name-generator'
import { prisma } from '../src/modules/prisma'

async function updateRandomNicknames() {
  const users = await prisma.user.findMany()

  const updateQueries = users.map((user) => {
    const randomNickname = rng()

    return prisma.$executeRaw`UPDATE user SET random_nickname = ${randomNickname} WHERE id = ${user.id};`
  })

  await prisma.$transaction(updateQueries)

  process.exit()
}

updateRandomNicknames()

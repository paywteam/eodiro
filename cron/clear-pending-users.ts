import dayjs from 'dayjs'
import { prisma } from '../src/modules/prisma'

async function clearPendingUsers() {
  const pendingUsers = await prisma.pendingUser.findMany()

  const deletions: Promise<any>[] = []

  pendingUsers.forEach((pendingUser) => {
    if (dayjs().diff(pendingUser.joinedAt, 'minute') > 30) {
      deletions.push(
        prisma.pendingUser.delete({
          where: { id: pendingUser.id },
        })
      )

      console.info(`Delete pending user at ${pendingUser.id}`)
    }
  })

  await Promise.all(deletions)

  process.exit()
}

clearPendingUsers()

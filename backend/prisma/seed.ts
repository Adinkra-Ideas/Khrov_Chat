import { PrismaClient } from '@prisma/client'

// initialize Prisma Client
const prisma = new PrismaClient()

async function main() {
  const user1 = await prisma.user.upsert({
    where: {
      userName: 'test'
    },
    update: {},
    create: {
      name: 'Ulli Test',
      userName: 'test',
      email: 'ulli@gmx.de'
    }
  })

  const user2 = await prisma.user.upsert({
    where: {
      userName: 'thomsen'
    },
    update: {},
    create: {
      name: 'Jacob Thomsen',
      userName: 'thomsen',
      email: 'thomsen@example.com'
    }
  })

  const user3 = await prisma.user.upsert({
    where: {
      userName: 'jhansen'
    },
    update: {},
    create: {
      name: 'Julia Hansen',
      userName: 'jhansen',
      email: 'jhansen@example.com'
    }
  })

  const user4 = await prisma.user.upsert({
    where: {
      userName: 'cvasquez'
    },
    update: {},
    create: {
      name: 'Caroline Vasquez',
      userName: 'cvasquez',
      email: 'carito@example.com',
    }
  })

  for(let i = 1; i < 5; ++i)
  {
    console.log(await prisma.profile_pic.upsert({
      where: { userId: i },
      update: {},
      create:{
        userId: i
      }
    }))
  }
}

// execute the main function
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect()
  })
#!/bin/sh
npm install
npx prisma db push
# npx prisma migrate reset -f # only works if there are migrations
npx prisma db seed
npm run start:dev

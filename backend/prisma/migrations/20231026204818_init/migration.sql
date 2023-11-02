-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'OFFLINE', 'INGAME');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "displayName" TEXT,
    "name" TEXT DEFAULT '',
    "userName" TEXT,
    "email" TEXT DEFAULT '',
    "activated2FA" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorAuthenticationSecret" TEXT,
    "refreshToken" TEXT,
    "currentStatus" "Status" NOT NULL DEFAULT 'OFFLINE',
    "avatarId" INTEGER NOT NULL DEFAULT 1,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "ratio" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayersOnMatch" (
    "playerId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlayersOnMatch_pkey" PRIMARY KEY ("playerId","matchId")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3),
    "end" TIMESTAMP(3),

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAvatar" (
    "id" SERIAL NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT true,
    "filename" TEXT NOT NULL,

    CONSTRAINT "UserAvatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile_pic" (
    "userId" INTEGER NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'data:image/png;base64,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',

    CONSTRAINT "Profile_pic_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Chat_union" (
    "unionId" SERIAL NOT NULL,
    "unionIdOther" INTEGER NOT NULL,
    "client1Id" INTEGER NOT NULL,
    "client2Id" INTEGER NOT NULL,
    "blockStatus" BOOLEAN NOT NULL DEFAULT false,
    "allowedToUnblock" BOOLEAN NOT NULL DEFAULT false,
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_union_pkey" PRIMARY KEY ("unionId")
);

-- CreateTable
CREATE TABLE "Chat_history" (
    "id" SERIAL NOT NULL,
    "unionId" INTEGER NOT NULL,
    "outgoing" TEXT,
    "incoming" TEXT,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryStatus" VARCHAR(16) NOT NULL DEFAULT 'sent',

    CONSTRAINT "Chat_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "desc" VARCHAR(128) NOT NULL,
    "visibility" VARCHAR(16) NOT NULL,
    "password" VARCHAR(128),

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel_link" (
    "id" SERIAL NOT NULL,
    "chId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" VARCHAR(16) NOT NULL,
    "linkStatus" VARCHAR(16) NOT NULL,
    "mutedUntil" TIMESTAMP(3),
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel_history" (
    "id" SERIAL NOT NULL,
    "chId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "outgoing" TEXT NOT NULL,
    "deliveryStatus" VARCHAR(8) NOT NULL DEFAULT 'sent',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Channel_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel_pending" (
    "id" SERIAL NOT NULL,
    "chId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Channel_pending_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserFriend" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserBlocked" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Channel_historyToChannel_link" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_displayName_key" ON "User"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "UserAvatar_filename_key" ON "UserAvatar"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFriend_AB_unique" ON "_UserFriend"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFriend_B_index" ON "_UserFriend"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserBlocked_AB_unique" ON "_UserBlocked"("A", "B");

-- CreateIndex
CREATE INDEX "_UserBlocked_B_index" ON "_UserBlocked"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Channel_historyToChannel_link_AB_unique" ON "_Channel_historyToChannel_link"("A", "B");

-- CreateIndex
CREATE INDEX "_Channel_historyToChannel_link_B_index" ON "_Channel_historyToChannel_link"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "UserAvatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayersOnMatch" ADD CONSTRAINT "PlayersOnMatch_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayersOnMatch" ADD CONSTRAINT "PlayersOnMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile_pic" ADD CONSTRAINT "Profile_pic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat_union" ADD CONSTRAINT "Chat_union_client1Id_fkey" FOREIGN KEY ("client1Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat_union" ADD CONSTRAINT "Chat_union_client2Id_fkey" FOREIGN KEY ("client2Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat_history" ADD CONSTRAINT "Chat_history_unionId_fkey" FOREIGN KEY ("unionId") REFERENCES "Chat_union"("unionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel_link" ADD CONSTRAINT "Channel_link_chId_fkey" FOREIGN KEY ("chId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel_link" ADD CONSTRAINT "Channel_link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel_history" ADD CONSTRAINT "Channel_history_chId_fkey" FOREIGN KEY ("chId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel_history" ADD CONSTRAINT "Channel_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel_pending" ADD CONSTRAINT "Channel_pending_chId_fkey" FOREIGN KEY ("chId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel_pending" ADD CONSTRAINT "Channel_pending_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFriend" ADD CONSTRAINT "_UserFriend_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFriend" ADD CONSTRAINT "_UserFriend_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserBlocked" ADD CONSTRAINT "_UserBlocked_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserBlocked" ADD CONSTRAINT "_UserBlocked_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Channel_historyToChannel_link" ADD CONSTRAINT "_Channel_historyToChannel_link_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Channel_historyToChannel_link" ADD CONSTRAINT "_Channel_historyToChannel_link_B_fkey" FOREIGN KEY ("B") REFERENCES "Channel_link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

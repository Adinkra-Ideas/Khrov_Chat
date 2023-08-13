# Khrov Chat App
Test Community App Boilerplate for my social Network Platform currently under development.
Live preview will be made available on my website https://khrov.com

# Colophon
Author: Daniel Uyi
Copyrighted content. No part of this code should be used without the Author'S consent.

# Legals
This App is provided as is without any guarantee whatsoever. Cloning, testing or whatever you chose to do with it is at your own risk. I will not be held liable for any damages, losses or misfortune that may arise from your usage. By cloning from this Github repo, you are agreeing to the aforementioned terms.

# Test Procedure (POSIX only), (Requires up-to-date Docker Compose to be installed and working)
1. Run the following command to clone and set the right PWD 
  git clone https://github.com/Adinkra-Ideas/khrov-chat.git && cd khrov-chat
  And in your PWD, rename the file named 'dotenv' to '.env' without the quotes

2. Free ports 5432, 8080 and 3000 on your local machine by shutting down any Process that is using them
sudo fuser -k 5432/tcp
sudo fuser -k 8080/tcp
sudo fuser -k 3000/tcp
Hint: Depending on whether this ports are currently in use, you might have to wait for up to 5 mins before the ports will become available again for use.

3. Ensure all Docker instances are removed by running Makefile command
make fclean

4. run the setup with the Makefile command
make up

5. Three Docker containers will be created. Adminer, Nestjs and Postgres. Ignore those if you dont know what they mean.
Wait about a minute for the Nestjs underlying server to be ready, then open your browser and visit localhost:3000

6. The chat is not behind any session at the moment. But a 'fake session' was mimicked for testing purpose. At the bottom right of the loaded webpage on your Browser'S screen, enter any of the existing userId from the 10 users currently in your 'User' table of Postgres, so you can use the chat as if you were that user. Yes, you can do this on multiple tabs with different userIds simultaneously. To start a new chat, simply open the chat interface and under the 'chat invite' tab, you can search for any of the existing usernames in the 'User' table of the Postgres Db. Hint: Adminer.

- Supports unlimited chat with realtime delivery status updates, blocking and unblocking(check the 'Blocked' tab to find users you blocked, if you need to unblock them), and a whole lot more.

# Chat Todo's
- Adding the channels/Group chat support
- Better UI/UX improvements for the frontview
- Notifications, Date formating, ...

Collaborators are welcome. More details will be given in due time as this Chat interface is only a small part of a bigger personal project that I am currently working on. 

The primary tools used are Nestjs, Vue, Prisma, Postgres, Docker(for containerization)

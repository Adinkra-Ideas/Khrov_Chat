# Khrov Chat App
Test version of the App Boilerplate for my upcoming Social Media Platform currently in its development Phase.
Live preview will be made available for testing and feedback on my website https://khrov.com in due time

# Legals
This App is provided as is with no Guarantee whatsoever. Cloning, testing or whatever you chose to do with it is at your own risk. I will not be held liable for any damages, losses or misfortune that may arise due to your usage. By cloning from this Github repo, you are agreeing to the aforementioned Terms.

# Test Procedure (POSIX only), (Requires up-to-date Docker Compose with root access)
1. Run the following command to clone and set the right PWD
```bash
git clone https://github.com/Adinkra-Ideas/khrov-chat.git && cd khrov-chat
```
2. Run the following command to rename the file named './srcs/dotenv' to './srcs/.env' without the quotes
```bash
mv ./srcs/dotenv ./srcs/.env
```
3. Free ports 5432, 8080 and 3000 on your local machine by shutting down any Process that is using them
```bash
sudo fuser -k 5432/tcp
sudo fuser -k 8080/tcp
sudo fuser -k 3000/tcp
```
Hint: Depending on whether these Ports were currently in use, you might have to wait for up to 5 mins for them to become available again for use.

4. Ensure all Docker instances are removed.

5. run the setup with the Makefile command.
```bash
make up
```
On successful completion, you should see the following:
> ✔ Network khrovChat-net  Created
> 
> ✔ Volume "postgre"       Created
> 
> ✔ Container admine       Started
> 
> ✔ Container postgre      Healthy
> 
> ✔ Container nestj        Started 

IMPORTANT: If for some reason, the initial run failed, or you need to repeat the process a second time, you must check inside the path srcs/postgres/ to see if a directory named 'postgre' (without the quotes) has been created. If yes, you mest delete this directory (srcs/postgres/postgre) before repeating the 'make up' command. Failure to do this might prevent the execution of the Prisma seed which is supposed to create fake users and channels for initial tests.


6. Three Docker containers will be created. Adminer, Nestjs and Postgres. Ignore those if you dont know what they mean. Upon startup, the Database will be populated with test users but you must wait for about a minute for the Nestjs underlying server to be fully ready, then open your browser and visit localhost:3000

Hint: If the webpage says 'ERR_EMPTY_RESPONSE' and your browser console shows error 
> crbug/1173575, non-JS module files deprecated.

It simply means the Nestjs service is not yet fully up. Depending on your Machine's capability, it might take up to 5 minutes or more. Keep reloading the page.


7. I removed the 0Auth part of the App, meaning the current version is not behind any Session. But a 'fake Session' was created for the test. At the bottom right of the loaded webpage on your Browser'S screen, enter any of the existing userId from the 10 users currently in your 'User' table of Postgres, so you can use the chat as if you were that User. Yes, you can do this on multiple tabs with different userIds simultaneously. To start a new chat, simply open the chat interface and under the 'Chat Invite' tab, you can search for users by their name, userName or displayName in the 'User' table of the Postgres Db.

Hint: Adminer container. The logins for the DB are in the .env file.

- Supports unlimited chat with realtime delivery status updates, blocking and unblocking(check the 'Blocked' tab to find users you blocked, if you need to unblock them), and a whole lot more.

# Chat Todo's
- Adding the channels/Group chat support
- Better UI/UX improvements for the frontview
- Notifications, Date formating, ...

Collaborators are welcome. More details will be given in due time as this Chat interface is only a small part of a bigger personal project that I am currently working on. 

The primary tools used are Nestjs, Vue, Prisma, Postgres, Docker(for containerization)

## Additional Info for Developers

All API Endpoints have been Documented and made available on the Swagger Module interface

## Credit
- Author - [Daniel Uyi](https://khrov.com)
- License - [MIT licensed](LICENSE).

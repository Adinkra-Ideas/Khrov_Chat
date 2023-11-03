# Khrov Chat App
A simple online connection chat where you can meet and interact with people the World over.

# Dev Tools
  ## Backend
  Nestjs(Typescript), Jest testing, PrismaORM with Postgresql, SwaggerApi, JWT with Google OAuth2 Provider, Websocket(server), etc.
  ## Frontend
  Vue.js(Vue3<script setup> Typescript), Pinia, Vitest unit testing, Cypress E2E testing, Websocket(client), etc.
  ## Deployment
  See a live usage of the code upgraded to an SSR/SSG (Quasar Vue) in the Official Khrov Chat website https://khrovchat.com
  Deployment service: AWS


# Legals
This App is provided as is with no Guarantee whatsoever. Cloning, testing or whatever you chose to do with it is at your own risk. I will not be held liable for any damages, losses or misfortune that may arise due to your usage. By cloning from this Github repo, you are agreeing to the aforementioned Terms.

# Test Procedure (POSIX only), (Requires up-to-date Docker Compose with root access)
1. Run the following command to clone and set the right PWD
```bash
git clone https://github.com/Adinkra-Ideas/khrov-chat.git && cd khrov-chat
```
2. Run the following command to rename the file named 'dotenv' to '.env' without the quotes
```bash
mv ./dotenv ./.env
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


Collaborators are welcome.  

## Credit
- Author - [Daniel Uyi](https://khrov.com)
- License - [MIT licensed](LICENSE).

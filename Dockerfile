FROM node:latest 
WORKDIR /usr/src/app 
 
COPY package*.json ./ 
RUN npm install --silent 
RUN npm i -g @nestjs/cli 
 
COPY . . 

RUN npm run build
 
EXPOSE 3001

CMD npm run seed && npm run start:prod

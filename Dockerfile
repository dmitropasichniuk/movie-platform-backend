FROM node:latest 
WORKDIR /usr/src/app 
 
COPY package*.json ./ 
RUN npm install --silent 
RUN npm i -g @nestjs/cli 
 
COPY . . 
 
EXPOSE 3001
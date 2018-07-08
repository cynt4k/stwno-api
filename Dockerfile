FROM node:8-slim

MAINTAINER Tobias Schneider, me@cynt4k.de

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
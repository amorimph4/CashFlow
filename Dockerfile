FROM node:16.20.0-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf --legacy-peer-deps

RUN npm set-script prepare ''

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build
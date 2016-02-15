FROM node:5.6-slim

ENV NODE_ENV production

COPY package.json /parti/auth-ui/package.json

WORKDIR /parti/auth-ui

RUN npm install

COPY . /parti/auth-ui

EXPOSE 8080

CMD npm start

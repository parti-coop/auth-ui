FROM node:5.6

ENV NODE_ENV production

COPY package.json /parti/auth-ui/package.json

WORKDIR /parti/auth-ui

RUN npm install

COPY . /parti/auth-ui

RUN npm build

EXPOSE 8080

CMD npm start

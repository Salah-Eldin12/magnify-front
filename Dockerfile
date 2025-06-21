FROM node:20.12.2

WORKDIR /app

COPY package.json .

RUN npm install -f

COPY . .


RUN npm run build

CMD [ "npm","run","dev" ]



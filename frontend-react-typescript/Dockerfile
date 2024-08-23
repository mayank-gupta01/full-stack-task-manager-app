FROM node:20-alpine

RUN mkdir -p /app

COPY package.json /app/
COPY tsconfig.json /app/
ENV REACT_APP_BASE_URL=http://localhost:8000/api/v1

COPY public /app/public/
COPY src /app/src/

WORKDIR /app

RUN npm install

CMD [ "npm", "start" ]
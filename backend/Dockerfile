FROM node:20

WORKDIR /app

# Install wget for healthcheck
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3002

CMD npm start

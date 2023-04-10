# FROM node:16.18
FROM 532819517439.dkr.ecr.us-east-1.amazonaws.com/cruddur-nodejs:16.18

ENV PORT=4000

WORKDIR /jwt-node-sidecar
COPY . .
EXPOSE ${PORT}

RUN apt-get update 
RUN apt-get install -y gcc
RUN apt-get install -y curl

RUN npm install
CMD ["npx", "nodemon", "index.js"]
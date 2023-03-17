FROM node:16.18

ENV PORT=4567

WORKDIR /jwt-node-sidecar
COPY . .
EXPOSE ${PORT}

RUN apt-get update 
RUN apt-get install -y gcc
RUN apt-get install -y curl

RUN npm install
CMD ["npx", "nodemon", "index.js"]
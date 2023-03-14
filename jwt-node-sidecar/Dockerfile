FROM node:16.18

ENV PORT=4000

WORKDIR /jwt-node-sidecar
COPY . .
EXPOSE ${PORT}

RUN apt-get update 
RUN apt-get install -y gcc
RUN apt-get install -y curl

RUN npm install
CMD ["npm", "start"]
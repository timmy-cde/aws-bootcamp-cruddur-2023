# FROM node:16.18
FROM 532819517439.dkr.ecr.us-east-1.amazonaws.com/cruddur-nodejs:16.18

ENV PORT=3000

WORKDIR /frontend-react-js
COPY . /frontend-react-js
# RUN npm install
EXPOSE ${PORT}
# CMD ["npm", "start"]
RUN chmod 700 frontend-run.sh
RUN apt-get update 
RUN apt-get install -y gcc
RUN apt-get install -y curl
CMD [ "./frontend-run.sh" ]

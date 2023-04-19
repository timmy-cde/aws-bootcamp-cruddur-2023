# FROM python:3.10-slim-buster
FROM 532819517439.dkr.ecr.us-east-1.amazonaws.com/cruddur-python:3.10-slim-buster

WORKDIR /backend-flask

# COPY requirements.txt requirements.txt
# RUN pip3 install -r requirements.txt

COPY . .

EXPOSE ${PORT}

ENV PYTHONUNBUFFERED=1
# CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=4567"]

RUN chmod 700 backend-run.sh
RUN apt-get update 
RUN apt-get install -y gcc
RUN apt-get install -y curl
CMD ["./backend-run.sh"]

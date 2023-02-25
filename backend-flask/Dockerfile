FROM python:3.10-slim-buster

WORKDIR /backend-flask

# COPY requirements.txt requirements.txt
# RUN pip3 install -r requirements.txt

COPY . .

ENV FLASK_ENV=development

EXPOSE ${PORT}

# CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=4567"]

RUN chmod 700 backend-run.sh
RUN apt-get update 
RUN apt-get install -y gcc
RUN apt-get install -y curl
CMD ["./backend-run.sh"]

FROM python:3.10-slim-buster

WORKDIR /backend-flask

COPY . .

ENV FLASK_ENV=development

EXPOSE ${PORT}

RUN chmod 700 backend-run.sh
CMD ["./backend-run.sh"]
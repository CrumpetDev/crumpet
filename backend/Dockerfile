# syntax=docker/dockerfile:1
FROM python:3.11.2

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIPENV_VENV_IN_PROJECT=1
ENV DJANGO_SETTINGS_MODULE=backend.settings

WORKDIR /code
COPY . /code/
RUN pip install -r requirements.txt



# django_boilerplate

A boilerplate app which includes
1. Basic Django setup with Django Suit and Postgres as backend
2. React Setup
3. Docker containerization
4. User login support
5. CircleCI auto-deployment to Google App Engine
6. Django Secrets for storing secret keys

Spin up base applications from this

## Installation

1. `git clone git@github.com:kuldeepk/django_boilerplate.git`
2. `cd django_boilerplate`
3. `docker-compose build`

## Run

`docker-compose up`

## Deployment configuration

Configure enviroment variables in your CircleCI. Follow `.circleci/config.yml` for different ENV variables

---
title: "Development - Docker Compose"
layout: single
---

We have a docker-compose available to deploy all the services necessary for the development environment.

Depending on your OS, there are different ways of installing Docker and Docker Compose. Please, visit <https://docs.docker.com/compose/install/>

Once you have Docker Compose installed, follow the below steps:

1. Clone the repository and enter de directory.
```bash
git clone git@github.com:wizzie-io/wizz-vis.git
cd wizz-vis/
```

2. Modify the `.env` file or create an new one (`.env.local`) and reference it in the `docker-compose.yml` file. You have to set, at least, the `DRUID_URL` value. Then, execute the docker compose and start all the services.
```bash
docker-compose up -d
```

3. You can check the status of the containers executing:
```bash
docker-compose ps
```

4. From now, you can play with the code, and the changes will be hot reloaded.

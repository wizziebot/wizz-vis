---
title: "Development - From Scratch"
layout: single
---

If you prefer, you can execute the rails server directly on your host. You may have access to a Postgres and Redis database. Also, like the way of using Docker Compose, you should have access to a Druid data store.

First of all, you have to install the requirements:

* Ruby 2.5.0
* Node.js 8.x
* Yarn 1.9.4+

If you have every requirement ready, let's install some other dependencies and clone Wizz-Vis and start hacking:
```bash
gem install bundler rake

git clone git@github.com:wizzie-io/wizz-vis.git
cd wizz-vis/
bundle install
```

Create a new `.env.local` file and override the required env variables referenced at `.env` file.

Install the node packages dependencies.
```bash
yarn install
```

Create the PostgreSQL database.
```bash
bundle exec rake db:create db:migrate
```

Launch Wizz-Vis using Foreman
```bash
foreman start -f Procfile.dev -e .env,.env.local
```

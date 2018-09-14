[![wizzie-io](https://img.shields.io/badge/powered%20by-wizzie.io-F68D2E.svg)](https://github.com/wizzie-io/)
[![CircleCI](https://circleci.com/gh/wizzie-io/wizz-vis/tree/master.svg?style=shield&circle-token=0bca72bea8dc031266ba56b4b17442df01f86224)](https://circleci.com/gh/wizzie-io/wizz-vis/tree/master)
[![codebeat badge](https://codebeat.co/badges/a92ee0cb-8e6a-4c22-9ce7-a27fff09ca6b)](https://codebeat.co/projects/github-com-wizzie-io-wizz-vis-master)
[![GitHub release](https://img.shields.io/github/release/wizzie-io/wizz-vis.svg)](https://github.com/wizzie-io/wizz-vis/releases/latest)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

# Wizz-Vis
Analytics platform for time series metrics using Druid. Create dashboards and share with other users.

Wizz-Vis is the web inteface used by Wizzie Data Platform (WDP).

[Website](https://wizzie.io) | [Twitter](https://twitter.com/wizzieio)

![screenshot_1](https://user-images.githubusercontent.com/748159/45296104-43175f00-b501-11e8-961b-c9d3b6b589bf.png)

![screenshot_2](https://user-images.githubusercontent.com/748159/45296126-562a2f00-b501-11e8-9bb7-0353401a5784.png)

## Documentation
Comming soon! Stay tunned.

## Development

### Using Docker Compose
We have available a docker-compose to deploy all the services necessary for the development environment.

Depending on your OS, there are different ways of installing Docker and Docker Compose. Please, visit https://docs.docker.com/compose/install/

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

### Develop from scratch
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

### Testing
1. Set up your development environment as per above.
2. Run `rake` to execute the full test suite.

### Built With
- [Ruby on Rails](https://github.com/rails/rails) - Our back-end is a Rails app.
- [React.js](https://reactjs.org/) - Our front-end mainly use React to build our amazing dashboards.
- [PostgreSQL](http://www.postgresql.org/) - Our main data store is in Postgres.
- [Redis](http://redis.io/) - We use Redis as a cache and for transient data.
- [Druid](http://druid.io/) - We use Druid as a data store and use its API to make the queries.

Also, a lots of Ruby Gems are used. You can find them at [/master/Gemfile](https://github.com/wizzie-io/wizz-vis/blob/master/Gemfile).

## Contribute
If you have any idea for an improvement or found a bug, please open an issue. But, if you prefer, you can clone this repo and submit a pull request, helping us make Wizz-Vis a better product.

## License
Wizz-Vis is distributed under Apache 2.0 License.

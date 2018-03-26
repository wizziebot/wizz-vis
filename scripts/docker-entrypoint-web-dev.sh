#!/bin/bash
set -e

echo -e "\nInstalling packages"
yarn install

echo -e "\nCompiling assets"
env RAILS_ENV=$RAILS_ENV bundle exec rake assets:precompile

echo -e "\nCreating database"
env RAILS_ENV=$RAILS_ENV bundle exec rake db:create

echo -e "\nRunning migrations"
env RAILS_ENV=$RAILS_ENV bundle exec rake db:migrate

echo -e "\nCreating seed data"
env RAILS_ENV=$RAILS_ENV bundle exec rake db:seed

echo -e "\nRunning command"
foreman start -f Procfile.dev

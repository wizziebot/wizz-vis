FROM ruby:2.5.0-slim
MAINTAINER Jose Antonio Parra <japarra@wizzie.io>

# JS Runtime and pg dependencies
RUN apt-get -qy update && \
    apt-get -y install --no-install-recommends build-essential \
      curl gnupg2 ruby-dev libpq-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qqy && apt-get -qqyy install --no-install-recommends \
    nodejs yarn && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV INSTALL_PATH /app
# ENV RAILS_SERVE_STATIC_FILES true

RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH

COPY Gemfile Gemfile.lock ./

RUN gem install bundler
RUN bundle install --jobs $(nproc) --retry 2

COPY . .

ENTRYPOINT $INSTALL_PATH/scripts/docker-entrypoint-puma-prod.sh

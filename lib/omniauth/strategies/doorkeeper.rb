# frozen_string_literal: true

module OmniAuth
  module Strategies
    class Doorkeeper < OmniAuth::Strategies::OAuth2
      uid do
        raw_info['id']
      end

      info do
        {
          email: raw_info['email']
        }
      end

      # The client for server side connections will use a different site
      # attribute if needed.
      def client(site: ENV['DOORKEEPER_APP_HOST'])
        ::OAuth2::Client.new(
          options.client_id,
          options.client_secret,
          deep_symbolize(options.client_options)
            .merge(site: site)
        )
      end

      # For request phase, it will be used the OAuth app site by default.
      def request_phase
        redirect client(site: ENV['DOORKEEPER_APP_URL'])
          .auth_code
          .authorize_url({ redirect_uri: callback_url }.merge(authorize_params))
      end

      def raw_info
        @raw_info ||= access_token.get('/api/v1/me.json').parsed
      end
    end
  end
end

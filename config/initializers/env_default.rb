# Set a default values for those env variables that are required.

ENV['PRIMARY_COLOR'] ||= '#f68d2e'
ENV['SECONDARY_COLOR'] ||= '#8c8c8c'
ENV['DOORKEEPER_APP_HOST'] ||= ENV['DOORKEEPER_APP_URL']

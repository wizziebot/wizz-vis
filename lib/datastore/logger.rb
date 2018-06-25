module Datastore
  class Logger < ActiveSupport::LogSubscriber

    def initialize(query, datasource)
      @query = query
      @query.dataSource = datasource
    end

    def debug
      name = color('  Druid Query', CYAN, true)
      payload = color(@query.to_json.to_s, BLUE, true)
      Rails.logger.debug "#{name} #{payload}"
    end
  end
end

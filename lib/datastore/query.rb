require 'druid'

module Datastore
  class Query
    include Aggregators
    include PostAggregators

    DRUID_TIMEOUT = ENV['DRUID_TIMEOUT']&.to_i || 60_000

    def initialize(datasource:, properties:, dimensions: [], aggregators: [],
                   post_aggregators: [], filters: [], options: {})
      properties = ActiveSupport::HashWithIndifferentAccess.new(properties)

      @datasource = Druid::DataSource.new(datasource, ENV['DRUID_URL'])
      @query = Druid::Query::Builder.new
      @interval = properties[:interval]
      @granularity = properties[:granularity] || 'all'
      @limit = properties[:limit] || 5
      @dimensions = dimensions
      @aggregators = aggregators
      @post_aggregators = post_aggregators
      @filters = filters
      @options = options

      build
    end

    def run
      Datastore::Logger.new(@query.query, @datasource.name).debug
      result = @datasource.post(@query)
      if top_n?
        convert_top_n_data(result)
      elsif group_by?
        convert_group_by_data(result)
      else
        convert_timeserie_data(result)
      end
    end

    def as_json
      query_json = @query.as_json['query']
      query_json.merge('dataSource' => @datasource.name)
    end

    def timeserie?
      @dimensions.blank?
    end

    def multiseries?
      @dimensions.size == 1 && @granularity != 'all'
    end

    def top_n?
      @dimensions.size == 1 && @granularity == 'all'
    end

    def group_by?
      @dimensions.size > 1
    end

    private

    def build
      @query.query.context.timeout = DRUID_TIMEOUT
      @query.interval(*@interval)
      @query.granularity(@granularity)

      set_aggregators
      set_post_aggregators
      set_filters

      if multiseries?
        # TODO
      elsif top_n?
        metric = @options['metric']&.to_sym || @aggregators.first.name.to_sym
        @query.topn(@dimensions.first.name.to_sym, metric, @limit)
      elsif group_by?
        @query.group_by(*@dimensions.map(&:name))
        @query.limit(@limit, @dimensions.map { |d| [d.name, :desc] })
      else
        # timeserie
      end
    end

    def set_filters
      @filters.group_by { |f| { dimension_id: f.dimension_id, operator: f.operator } }
              .each do |values, filters|
        dimension = Dimension.find_by(id: values[:dimension_id])
        next unless dimension

        query_dim = Druid::DimensionFilter.new(dimension: dimension.name)
        operator = values[:operator]

        case operator
        when 'eq'
          @query.filter { query_dim.in(filters.map(&:value)) }
        when 'neq'
          @query.filter { query_dim.nin(filters.map(&:value)) }
        when 'regex'
          @query.filter do
            query_dim.in(filters.map(&:value).map { |v| Regexp.new(v) })
          end
        else
          filters.each do |filter|
            @query.filter { query_dim.send(operator, filter.value) }
          end
        end
      end
    end

    def convert_top_n_data(result)
      result.map do |row|
        row['result']
      end.flatten
    end

    def convert_group_by_data(result)
      result.map do |row|
        row.merge!(row['event']).delete('event')
        row
      end
    end

    def convert_timeserie_data(result)
      result.map do |row|
        row.merge!(row['result']).delete('result')
        row
      end
    end
  end
end

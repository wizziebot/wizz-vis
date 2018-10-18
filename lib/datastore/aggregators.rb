module Datastore
  module Aggregators
    def set_aggregators
      aggregators.select { |a| a.filters.empty? }
                 .group_by(&:aggregator_type).each do |type, aggs|
        set_aggregator(type.underscore, aggs.map(&:name), options)
      end

      aggregators.select { |a| a.filters.any? }.each do |aw|
        query.filtered_aggregation(
          aw.name,
          aw.aggregator_name || aw.name,
          aw.aggregator_type,
          &build_filters(aw.filters)
        )
      end
    end

    def set_aggregator(aggregator_type, aggs, opts = {})
      send(aggregator_type, aggs, opts)
    rescue NoMethodError
      query.send(aggregator_type, aggs)
    end

    private

    def query
      raise StandardError('Undefined instance variable query') unless @query
      @query
    end

    def aggregators
      @aggregators ||= []
    end

    def options
      @options ||= {}
    end

    def approx_histogram_fold(aggs, opts)
      histograms(query, aggs, opts)
    end

    def theta_sketch(aggs, _opts)
      aggs.each { |agg| query.theta_sketch(agg, agg) }
    end

    def string_last_fold(aggs, _opts)
      query.send('string_last', aggs)
    end

    def string_first_fold(aggs, _opts)
      query.send('string_first', aggs)
    end

    def histograms(query, aggs, opts)
      hist_opts = opts['histogram'] || {}
      type = hist_opts['type'] || 'equalBuckets'
      aggs.each do |aggregator|
        query.histogram(aggregator, type, hist_opts)
      end
    end

    def build_filters(filters)
      concat_filters = nil

      filters.group_by { |f| { dimension_id: f.dimension_id, operator: f.operator } }
             .each do |values, filters|
        dimension = Dimension.find_by(id: values[:dimension_id])
        next unless dimension

        query_dim = Druid::DimensionFilter.new(dimension: dimension.name)
        operator = values[:operator]

        case operator
        when 'eq'
          concat_filters = if concat_filters.nil?
                            query_dim.in(filters.map(&:value))
                          else
                            concat_filters.&(query_dim.in(filters.map(&:value)))
                          end
        when 'neq'
          concat_filters = if concat_filters.nil?
                            query_dim.nin(filters.map(&:value))
                          else
                            concat_filters.&(query_dim.nin(filters.map(&:value)))
                          end
        when 'regex'
          concat_filters =
            if concat_filters.nil?
              query_dim.in(filters.map(&:value).map { |v| Regexp.new(v) })
            else
              concat_filters.&(query_dim.in(filters.map(&:value).map { |v| Regexp.new(v) }))
            end
        else
          filters.each do |filter|
            concat_filters = if concat_filters
                              concat_filters.&(query_dim.send(operator, filter.value))
                            else
                              query_dim.send(operator, filter.value)
                            end
          end
        end
      end

      proc { concat_filters }
    end
  end
end

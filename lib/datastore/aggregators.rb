module Datastore
  module Aggregators
    def set_aggregators
      aggregators.group_by(&:aggregator_type).each do |type, aggs|
        set_aggregator(type.underscore, aggs.map(&:name), options)
      end
    end

    def set_aggregator(aggregator_type, aggs, opts = {})
      case aggregator_type
      when 'approx_histogram_fold'
        histograms(query, aggs, opts)
      else
        query.send(aggregator_type, aggs)
      end
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

    def histograms(query, aggs, opts)
      hist_opts = opts['histogram'] || {}
      type = hist_opts['type'] || 'equalBuckets'
      aggs.each do |aggregator|
        query.histogram(aggregator, type, hist_opts)
      end
    end
  end
end

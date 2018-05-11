module Datastore
  module PostAggregators
    def set_post_aggregators
      post_aggregators.sort_by(&:order).each do |pa|
        field1 = post_aggregator_field(pa.field_1)
        field2 = post_aggregator_field(pa.field_2)

        post_agg = Druid::PostAggregationOperation.new(field1, pa.operator, field2)
        post_agg.name = pa.output_name
        query.query.postAggregations << post_agg
      end
    end

    def post_aggregator_field(field)
      if /^\d+$/.match?(field)
        Druid::PostAggregationConstant.new(value: field)
      elsif hyper_unique_aggregator?(field)
        Druid::PostAggregationField.new(fieldName: field, type: 'hyperUniqueCardinality')
      else
        Druid::PostAggregationField.new(fieldName: field, type: 'fieldAccess')
      end
    end

    def hyper_unique_aggregator?(aggregator)
      aggregators.select do |a|
        a.aggregator_type == 'hyperUnique' && a.name == aggregator
      end.any?
    end

    private

    def query
      raise StandardError('Undefined instance variable query') unless @query
      @query
    end

    def aggregators
      @aggregators ||= []
    end

    def post_aggregators
      @post_aggregators ||= []
    end
  end
end

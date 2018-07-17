module Datastore
  module PostAggregators
    def set_post_aggregators
      post_aggregators.sort_by(&:order).each do |pa|
        # thetaSketch post-aggregation
        if theta_sketch_post_aggregator?(pa)
          query.theta_sketch_postagg(pa.output_name, pa.operator, [pa.field_1, pa.field_2])
        else
          include_default_post_aggregator(pa)
        end
      end
    end

    def post_aggregator_field(field)
      if /^\d+(\.\d+)?$/.match?(field)
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

    def theta_sketch_post_aggregator?(post_aggregator)
      theta_sketch_aggregator?(post_aggregator.field_1) &&
        theta_sketch_aggregator?(post_aggregator.field_2)
    end

    def theta_sketch_aggregator?(aggregator)
      aggregators.select do |a|
        a.aggregator_type == 'thetaSketch' && a.aggregator_name == aggregator
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

    def include_default_post_aggregator(post_aggregator)
      field1 = post_aggregator_field(post_aggregator.field_1)
      field2 = post_aggregator_field(post_aggregator.field_2)

      post_agg = Druid::PostAggregationOperation.new(field1, post_aggregator.operator, field2)
      post_agg.name = post_aggregator.output_name
      query.query.postAggregations << post_agg
    end
  end
end

require 'druid'

module Druid
  class Aggregation
    attr_accessor :round
  end
end

class Druid::Query::Builder
  def hyper_unique(*metrics)
    metrics.flatten.compact.each do |metric|
      next if @query.contains_aggregation?(metric)
      @query.aggregations << Druid::Aggregation.new(
        type: 'hyperUnique',
        name: metric,
        fieldName: metric,
        round: true
      )
    end
    self
  end
end

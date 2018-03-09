class AggregatorSerializer < ActiveModel::Serializer
  attributes(
    :id,
    :name,
    :aggregator_type
  )
end

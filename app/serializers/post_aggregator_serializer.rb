class PostAggregatorSerializer < ActiveModel::Serializer
  attributes(
    :output_name,
    :operator,
    :field_1,
    :field_2
  )
end

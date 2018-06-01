class Api::V1::FilterSerializer < ActiveModel::Serializer
  attribute :dimension_name do
    object.dimension.name
  end

  attributes(
    :operator,
    :value
  )
end

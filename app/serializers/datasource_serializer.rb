class DatasourceSerializer < ActiveModel::Serializer
  attributes(
    :id,
    :name
  )

  has_many :dimensions
  has_many :aggregators
end

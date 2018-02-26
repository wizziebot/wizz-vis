class WidgetSerializer < ActiveModel::Serializer
  attributes(
    :id,
    :type,
    :name,
    :title,
    :row,
    :col,
    :size_x,
    :size_y,
  )

  has_many :dimensions
  has_many :aggregators
end

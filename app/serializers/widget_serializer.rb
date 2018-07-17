class WidgetSerializer < ActiveModel::Serializer
  attributes(
    :id,
    :type,
    :title,
    :datasource_id,
    :dashboard_id,
    :row,
    :col,
    :size_x,
    :size_y,
    :options,
    :interval,
    :compare_interval
  )

  belongs_to :datasource
  has_many :dimensions
  has_many :aggregators
  has_many :post_aggregators
end

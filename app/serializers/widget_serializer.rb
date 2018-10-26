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
    :compare_interval,
    :override_interval?,
    :interval_attributes
  )

  belongs_to :datasource
  has_many :dimensions
  has_many :aggregators
  has_many :post_aggregators

  def interval_attributes
    {
      range: object.range,
      start_time: object.start_time,
      end_time: object.end_time
    }
  end
end

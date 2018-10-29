class Api::V1::DashboardSerializer < ActiveModel::Serializer
  attributes(
    :id,
    :name,
    :theme,
    :interval,
    :locked,
    :range,
    :start_time,
    :end_time
  )

  has_many :widgets
end

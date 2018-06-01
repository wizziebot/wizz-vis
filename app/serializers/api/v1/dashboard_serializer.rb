class Api::V1::DashboardSerializer < ActiveModel::Serializer
  attributes(
    :id,
    :name,
    :theme,
    :interval,
    :locked
  )

  has_many :widgets
end

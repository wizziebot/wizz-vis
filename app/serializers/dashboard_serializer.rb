class DashboardSerializer < ActiveModel::Serializer
  attributes(
    :id,
    :name,
    :theme,
    :interval,
    :locked
  )

  has_many :widgets
end

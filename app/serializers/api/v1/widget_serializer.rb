class Api::V1::WidgetSerializer < ActiveModel::Serializer
  attributes(
    :id,
    :type,
    :title,
    :dashboard_id,
    :row,
    :col,
    :size_x,
    :size_y,
    :range,
    :start_time,
    :end_time,
    :limit,
    :options
  )

  attribute :datasource_name do
    object.datasource.name
  end

  attribute :dimensions do
    object.dimensions.map(&:name)
  end

  attribute :aggregators do
    object.aggregators.map(&:name)
  end

  attribute :post_aggregators do
    ActiveModelSerializers::SerializableResource.new(object.post_aggregators)
  end

  attribute :filters do
    ActiveModelSerializers::SerializableResource.new(
      object.filters,
      each_serializer: Api::V1::FilterSerializer
    )
  end
end

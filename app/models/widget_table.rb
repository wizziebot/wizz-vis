class WidgetTable < Widget
  def data
    result = { data: super(nil, granularity: 'all', intervals: [interval]) }
    return result unless compare?

    result[:compare] = []

    result[:data].each do |data|
      result[:compare] << compare_from_data(data)
    end

    result
  end

  private

  def compare_from_data(data)
    data_filters = data.slice(*dimensions.map(&:name))
    filter_list = filters_from_data(data_filters)

    result = data_row(
      filters.reject { |f| f.id && dimensions.include?(f.dimension) },
      granularity: 'all', intervals: [compare_interval]
    )

    filters.delete(filter_list)

    result
  end

  def filters_from_data(data)
    filter_list = []

    data.each do |key, val|
      filter_list << filters.build(
        dimension_id: dimensions.find_by(name: key).id,
        filterable_id: id,
        operator: :eq,
        value: val
      )
    end

    filter_list
  end

  def data_row(*args)
    Widget.instance_method(:data).bind(self).call(*args).first
  end
end

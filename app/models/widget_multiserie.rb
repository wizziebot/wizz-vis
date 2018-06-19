class WidgetMultiserie < Widget
  def data
    dimension_values = super('granularity' => 'all').map do |d|
      d[dimensions.first.name]
    end

    metric = options['metric'] || aggregators.first.name

    multiseries = []
    dimension_values.each do |val|
      filter = filters.build(
        dimension_id: dimensions.first.id,
        filterable_id: id,
        operator: :eq,
        value: val
      )

      multiseries << super.map do |s|
        s.merge((val || 'N/A') => s[metric]).except(metric)
      end

      filters.delete(filter)
    end

    {
      values: multiseries.flatten
                         .group_by { |h| h['timestamp'] }
                         .map do |_key, serie|
                           serie.reduce({}, :merge)
                         end,
      dimensions: dimension_values.map { |d| d || 'N/A' }
    }
  end
end

class WidgetMultiserie < Widget
  def data
    dimension_values = super('granularity' => 'all').map do |d|
      d[dimensions.first.name]
    end

    multiseries = []
    dimension_values.each do |val|
      filter = filters.build(
        dimension_id: dimensions.first.id,
        widget_id: id,
        operator: :eq,
        value: val
      )

      multiseries << super.map do |s|
        s.merge((val || 'N/A') => s[aggregators.first.name]).except(aggregators.first.name)
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

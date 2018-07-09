class WidgetMultiserie < Widget
  def data
    dimension = dimensions.first

    # Get the top N values
    dimension_values = super(filters, 'granularity' => 'all').map do |d|
      d[dimension.name]
    end

    metric = [*options['metrics']].first || aggregators.first.name

    multiseries = []

    # Make a timeserie query for each top N value. It's necessary to include
    # a filter for that value, so the data is isolated only for that dimension's
    # value.
    dimension_values.each do |val|
      filter = filters.build(
        dimension_id: dimension.id,
        filterable_id: id,
        operator: :eq,
        value: val
      )

      # If there are filters of the dimension selected, they have to be excluded
      # to not conflict with the above filter.
      multiseries << super(
        filters.reject { |f| f.id && f.dimension_id.eql?(dimension.id) }
      ).map do |s|
        s.merge((val || 'N/A') => s[metric]).except(metric)
      end

      # Remove the dimension's value filter added above.
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

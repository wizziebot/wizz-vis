class WidgetPlaneLocation < Widget
  def data
    result = super
    group_dimension = dimensions.detect { |d| !d.coordinate? }
    result.sort_by { |r| r['timestamp'] }
          .reverse
          .uniq { |r| r[group_dimension.name] }
  end
end

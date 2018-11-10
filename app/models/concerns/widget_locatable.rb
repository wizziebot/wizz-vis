module WidgetLocatable
  extend ActiveSupport::Concern

  def data
    result = super

    return result if aggregators.any?(&:coordinate?)

    group_dimension = dimensions.detect { |d| !d.coordinate? }
    result.sort_by { |r| r['timestamp'] }
          .reverse
          .uniq { |r| r[group_dimension.name] }
  end
end

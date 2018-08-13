class WidgetLocation < Widget
  # ==========================================================
  # Validations
  # ==========================================================
  validate :validate_dimensions
  validate :validate_aggregators

  def data
    result = super
    group_dimension = dimensions.detect { |d| !d.coordinate? }
    result.sort_by { |r| r['timestamp'] }
          .reverse
          .uniq { |r| r[group_dimension.name] }
  end

  private

  def validate_dimensions
    errors.add(:dimensions, 'should contain one coordinate dimension') unless dimensions.any?(&:coordinate?)
    errors.add(:dimensions, 'at least two is needed') if dimensions.size < 2
  end

  def validate_aggregators
    errors.add(:aggregators, 'at least one is needed') if aggregators.size.zero?
  end
end

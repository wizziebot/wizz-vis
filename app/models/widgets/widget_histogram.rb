class WidgetHistogram < Widget
  # ==========================================================
  # Validations
  # ==========================================================
  validates :granularity, inclusion: { in: %w[all],
    message: "%{value} is not allowed." }
  validate :validate_empty_dimensions
  validate :validate_aggregators

  def data
    options['histogram'] ||= {}
    options['histogram']['numBuckets'] = limit || 10
    super
  end

  private

  def validate_empty_dimensions
    errors.add(:dimensions, 'are not allowed') unless dimensions.empty?
  end

  def validate_aggregators
    errors.add(:aggregators, 'should contain one histogram dimension') unless aggregators.any?(&:histogram?)
    errors.add(:aggregators, 'at least one is needed') if aggregators.size.zero?
  end
end

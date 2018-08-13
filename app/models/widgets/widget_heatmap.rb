class WidgetHeatmap < Widget
  # ==========================================================
  # Validations
  # ==========================================================
  validates :granularity, inclusion: { in: %w[all],
    message: "%{value} is not allowed." }
  validate :validate_dimensions
  validate :validate_aggregators

  private

  def validate_dimensions
    errors.add(:dimensions, 'should contain one coordinate dimension') unless dimensions.any?(&:coordinate?)
    errors.add(:dimensions, 'only one is allowed') unless dimensions.size == 1
  end

  def validate_aggregators
    errors.add(:aggregators, 'at least one is needed') if aggregators.size.zero?
  end
end

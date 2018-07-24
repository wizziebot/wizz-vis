class WidgetTable < Widget
  # ==========================================================
  # Validations
  # ==========================================================
  validates :granularity, inclusion: { in: %w[all],
    message: "%{value} is not allowed." }
  validate :validate_dimensions
  validate :validate_aggregators

  private

  def validate_dimensions
    errors.add(:dimensions, 'at least one is needed') if dimensions.size.zero?
  end

  def validate_aggregators
    errors.add(:aggregators, 'at least one is needed') if aggregators.size.zero?
  end
end

class WidgetBar < Widget
  # ==========================================================
  # Validations
  # ==========================================================
  validates :granularity, inclusion: { in: %w[all],
    message: "%{value} is not allowed." }
  validate :validate_dimension
  validate :validate_aggregator

  private

  def validate_dimension
    errors.add(:dimensions, 'only one is allowed') unless dimensions.size == 1
  end

  def validate_aggregator
    errors.add(:aggregators, 'at least one is needed') if aggregators.size.zero?
  end
end

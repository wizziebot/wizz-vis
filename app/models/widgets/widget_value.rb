class WidgetValue < Widget
  # ==========================================================
  # Validations
  # ==========================================================
  validate :validate_aggregator
  validate :validate_empty_dimensions

  private

  def validate_aggregator
    errors.add(:aggregators, 'only one is allowed') unless aggregators.size == 1
  end

  def validate_empty_dimensions
    errors.add(:dimensions, 'are not allowed') unless dimensions.empty?
  end
end

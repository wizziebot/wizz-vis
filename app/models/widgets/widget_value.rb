class WidgetValue < Widget
  # ==========================================================
  # Validations
  # ==========================================================
  validate :validate_aggregators
  validate :validate_empty_dimensions

  private

  def validate_aggregators
    errors.add(:aggregators, 'only one is allowed') if aggregators.size.zero?
  end

  def validate_empty_dimensions
    errors.add(:dimensions, 'are not allowed') unless dimensions.empty?
  end
end

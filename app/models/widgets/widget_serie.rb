class WidgetSerie < Widget
  # ==========================================================
  # Validations
  # ==========================================================
  validates :granularity, exclusion: { in: %w[all],
    message: "%{value} is not allowed." }
  validate :validate_aggregators
  validate :validate_empty_dimensions

  private

  def validate_aggregators
    return if aggregators.any? || aggregator_widgets.any?
    errors.add(:aggregators, 'at least one is needed')
  end

  def validate_empty_dimensions
    errors.add(:dimensions, 'are not allowed') unless dimensions.empty?
  end
end

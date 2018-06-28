class WidgetSerie < Widget
  # ==========================================================
  # Validations
  # ==========================================================
  validates :granularity, exclusion: { in: %w[all],
    message: "%{value} is not allowed." }
  validate :validate_empty_dimensions

  private

  def validate_empty_dimensions
    errors.add(:dimensions, 'are not allowed') unless dimensions.empty?
  end
end

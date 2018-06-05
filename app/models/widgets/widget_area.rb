class WidgetArea < Widget
  # ==========================================================
  # Validations
  # ==========================================================
  validates :granularity, exclusion: { in: %w[all],
    message: "%{value} is not allowed." }
  validate :validate_dimensions

  private

  def validate_dimensions
    errors.add(:dimensions, 'are not allowed') unless dimensions.empty?
  end
end

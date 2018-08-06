class WidgetValue < Widget
  # ==========================================================
  # Validations
  # ==========================================================
  validate :validate_aggregators
  validate :validate_empty_dimensions

  def data
    # if granularity is all and compare is activated, it will result an unique
    # value without distinction between one interval and the other.
    if compare? && granularity == 'all'
      compare_data
    else
      super
    end
  end

  private

  def validate_aggregators
    errors.add(:aggregators, 'only one is allowed') if aggregators.size.zero?
  end

  def validate_empty_dimensions
    errors.add(:dimensions, 'are not allowed') unless dimensions.empty?
  end
end

class WidgetRoute < Widget
  # ==========================================================
  # Validations
  # ==========================================================
  validates :granularity, exclusion: { in: %w[all],
    message: "%{value} is not allowed." }
  validate :validate_dimensions
  validate :validate_aggregators

  # Return an array of waypoints with the format:
  # { timestamp: "2017-11-06T21:09:00.000Z",
  #   coordinate: ["30.29068285", "-97.723049717"] }
  #
  # If there are more than one waypoint with the same timestamp,
  # only the first will be returned.
  def data
    coordinates_dimension = dimensions.find(&:coordinate?)

    result = super
    waypoints = {}
    result.each do |waypoint|
      waypoints[waypoint['timestamp']] ||= waypoint[coordinates_dimension.name]
    end

    waypoints.map do |k, v|
      { timestamp: k, coordinate: v.split(',') }
    end
  end

  private

  def validate_dimensions
    errors.add(:dimensions, 'should contain one coordinate dimension') unless dimensions.any?(&:coordinate?)
  end

  def validate_aggregators
    errors.add(:aggregators, 'at least one is needed') if aggregators.size.zero?
  end
end

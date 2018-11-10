module WidgetRouteable
  extend ActiveSupport::Concern
  include ActiveModel::Validations

  included do
    # ==========================================================
    # Validations
    # ==========================================================
    validates :granularity, exclusion: { in: %w[all],
                                         message: "%{value} is not allowed." }
    validate :validate_aggregators
  end

  # Return an array of waypoints with the format:
  # { timestamp: "2017-11-06T21:09:00.000Z",
  #   coordinate: ["30.29068285", "-97.723049717"] }
  #
  # If there are more than one waypoint with the same timestamp,
  # only the first will be returned.
  def data
    result = super

    coordinates_dimension = dimensions.find(&:coordinate?)
    coordinates_aggregator = aggregators.find(&:coordinate?)

    if coordinates_aggregator
      coordinates_from_aggregator(result, coordinates_aggregator.name)
    else
      coordinates_from_dimension(result, coordinates_dimension.name)
    end
  end

  private

  def coordinates_from_dimension(data, dimension_name)
    waypoints = {}
    data.each do |waypoint|
      next if waypoint[dimension_name].nil?
      waypoints[waypoint['timestamp']] ||= waypoint[dimension_name]
    end

    waypoints.map do |k, v|
      { timestamp: k, coordinates: v.split(',') }
    end
  end

  def coordinates_from_aggregator(data, aggregator_name)
    data.map do |row|
      next if row[aggregator_name].nil?
      { timestamp: row['timestamp'],
        coordinates: row[aggregator_name].split(',') }
    end.compact
  end

  def validate_aggregators
    errors.add(:aggregators, 'at least one is needed') if aggregators.size.zero?
  end
end

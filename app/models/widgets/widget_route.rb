class WidgetRoute < Widget
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
end

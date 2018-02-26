class WidgetArea < Widget
  def data
    result = super
    result.map do |element|
      {
        timestamp: element["timestamp"],
        events: element["result"]["events"]
      }
    end
  end
end

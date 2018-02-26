class WidgetPie < Widget
  def data
    result = super
    result[0]['result'].map do |element|
      {
        name: element[dimensions.first.name] || 'N/A',
        events: element["events"]
      }
    end
  end
end

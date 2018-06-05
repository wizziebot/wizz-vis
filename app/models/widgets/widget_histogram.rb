class WidgetHistogram < Widget
  def data
    options[:histogram] ||= {}
    options[:histogram][:numBuckets] = limit || 10
    super
  end
end

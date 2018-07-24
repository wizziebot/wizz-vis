class WidgetValue < Widget
  def data
    # if granularity is all and compare is activated, it will result an unique
    # value without distinction between one interval and the other.
    if compare? && granularity == 'all'
      split_data_intervals
    else
      super
    end
  end

  private

  def split_data_intervals
    intervals.map do |i|
      Widget.instance_method(:data).bind(self).call([], intervals: [i])
    end.flatten
  end
end

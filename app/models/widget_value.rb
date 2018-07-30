class WidgetValue < Widget
  def data
    # if granularity is all and compare is activated, it will result an unique
    # value without distinction between one interval and the other.
    if compare? && granularity == 'all'
      compare_data
    else
      super
    end
  end
end

class WidgetSerie < Widget
  def data
    result = { data: super() }
    result[:compare] = compare_data if compare?
    result
  end
end

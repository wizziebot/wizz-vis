FactoryBot.define do
  factory :widget_histogram, class: WidgetHistogram do
    title 'Widget Histogram'
    row 0
    col 4
    size_x 4
    size_y 4
    association :dashboard, factory: :dashboard
    association :datasource
    range 'current_day'
    granularity 'all'
  end
end

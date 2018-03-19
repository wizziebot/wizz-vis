FactoryBot.define do
  factory :widget_area, class: WidgetArea do
    title 'Widget Area'
    row 0
    col 0
    size_x 4
    size_y 4
    association :dashboard, factory: :dashboard
    association :datasource
    range 'current_day'
    granularity 'P1D'
  end
end

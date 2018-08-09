FactoryBot.define do
  factory :widget_route, class: WidgetRoute do
    title 'Widget Route'
    row 0
    col 4
    size_x 4
    size_y 4
    association :dashboard, factory: :dashboard
    association :datasource
    range 'current_day'
    granularity 'P1D'
  end
end

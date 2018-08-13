FactoryBot.define do
  factory :widget_location, class: WidgetLocation do
    title 'Widget Location'
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

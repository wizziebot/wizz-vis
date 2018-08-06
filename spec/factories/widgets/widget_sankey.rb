FactoryBot.define do
  factory :widget_sankey, class: WidgetSankey do
    title 'Widget Sankey'
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

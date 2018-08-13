FactoryBot.define do
  factory :widget_plane_location, class: WidgetPlaneLocation do
    title 'Widget Plane Location'
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

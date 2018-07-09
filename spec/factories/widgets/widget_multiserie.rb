FactoryBot.define do
  factory :widget_multiserie, class: WidgetMultiserie do
    title 'Widget MultiSerie'
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

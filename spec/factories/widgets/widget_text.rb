FactoryBot.define do
  factory :widget_text, class: WidgetText do
    title 'Widget Text'
    row 0
    col 4
    size_x 4
    size_y 4
    association :dashboard, factory: :dashboard
    association :datasource
  end
end

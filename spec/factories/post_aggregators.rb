FactoryBot.define do
  factory :post_aggregator, class: PostAggregator do
  end

  factory :bytes_per_event, class: PostAggregator do
    output_name 'bps'
    operator '/'
    field_1 'sum_bytes'
    field_2 'events'
    association :widget, factory: :widget_serie
  end

  factory :constant_pg, class: PostAggregator do
    output_name 'percentage'
    operator '*'
    field_1 'users'
    field_2 '100'
    association :widget, factory: :widget_serie
  end
end

FactoryBot.define do
  factory :bytes, class: Aggregator do
    name 'sum_bytes'
    aggregator_type 'longSum'
    association :datasource
  end
end

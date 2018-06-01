FactoryBot.define do
  factory :aggregator do
    name 'aggregator'
    aggregator_type 'longSum'
  end

  factory :bytes, class: Aggregator do
    name 'sum_bytes'
    aggregator_type 'longSum'
    association :datasource
  end

  factory :events, class: Aggregator do
    name 'events'
    aggregator_type 'longSum'
    association :datasource
  end

  factory :users, class: Aggregator do
    name 'users'
    aggregator_type 'hyperUnique'
    association :datasource
  end

  factory :hist_dwell, class: Aggregator do
    name 'hist_dwell'
    aggregator_type 'approxHistogramFold'
    association :datasource
  end
end

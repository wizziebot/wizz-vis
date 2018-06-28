FactoryBot.define do
  factory :aggregator_widget do
    aggregator_name 'aggregator_name'
    association :aggregator
    association :widget
  end
end

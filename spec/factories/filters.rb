FactoryBot.define do
  factory :filter do
    association :dimension
    association :filterable
  end

  factory :application_filter, class: Filter do
    association :dimension, factory: :application_dimension
    association :filterable, factory: :widget
    operator 'eq'
    value 'http'
  end
end

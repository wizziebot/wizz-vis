FactoryBot.define do
  factory :dimension do
    name 'dimension'
    association :datasource
  end

  factory :coordinate_dimension, class: Dimension do
    name 'client_latlng'
    association :datasource
  end

  factory :application_dimension, class: Dimension do
    name 'application'
    association :datasource
  end
end

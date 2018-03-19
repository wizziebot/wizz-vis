FactoryBot.define do
  factory :coordinate, class: Dimension do
    name 'client_latlng'
    association :datasource
  end
end

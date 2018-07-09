FactoryBot.define do
  factory :datasource do
    name 'Datasource'

    factory :datasource_with_relations do
      after(:create) do |datasource|
        create(:dimension, name: 'dimension_a', datasource: datasource)
        create(:dimension, name: 'dimension_b', datasource: datasource)
        create(:aggregator, name: 'aggregator_a', datasource: datasource)
        create(:aggregator, name: 'aggregator_b', datasource: datasource)
      end
    end
  end
end

FactoryBot.define do
  factory :datasource do
    name 'Datasource'

    factory :datasource_with_relations do
      after(:create) do |datasource|
        create(:dimension, datasource: datasource)
        create(:aggregator, datasource: datasource)
      end
    end
  end
end

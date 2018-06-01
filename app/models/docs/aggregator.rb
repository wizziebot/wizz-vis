module Docs
  class Aggregator
    include Swagger::Blocks

    swagger_schema :Aggregator do
      key :required, %i[id name aggregator_type datasource_id]
      property :id do
        key :type, :integer
        key :format, :int64
      end
      property :name do
        key :type, :string
      end
      property :aggregator_type do
        key :type, :string
      end
      property :datasource_id do
        key :type, :integer
        key :format, :int64
      end
    end
  end
end

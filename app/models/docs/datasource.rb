module Docs
  class Datasource
    include Swagger::Blocks

    swagger_schema :Datasource do
      key :required, %i[id name]
      property :id do
        key :type, :integer
        key :format, :int64
      end
      property :name do
        key :type, :string
      end
      property :dimensions do
        key :type, :array
        items do
          key :'$ref', :Dimension
        end
      end
      property :aggregators do
        key :type, :array
        items do
          key :'$ref', :Aggregator
        end
      end
    end
  end
end

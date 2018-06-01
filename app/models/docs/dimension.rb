module Docs
  class Dimension
    include Swagger::Blocks

    swagger_schema :Dimension do
      key :required, %i[id name dimension_type datasource_id]
      property :id do
        key :type, :integer
        key :format, :int64
      end
      property :name do
        key :type, :string
      end
      property :dimension_type do
        key :type, :string
      end
      property :datasource_id do
        key :type, :integer
        key :format, :int64
      end
    end
  end
end

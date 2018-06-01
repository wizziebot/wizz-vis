module Docs
  class Filter
    include Swagger::Blocks

    swagger_schema :Filter do
      property :dimension_name do
        key :type, :string
      end
      property :operator do
        key :type, :string
      end
      property :value do
        key :type, :string
      end
    end
  end
end

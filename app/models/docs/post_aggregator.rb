module Docs
  class PostAggregator
    include Swagger::Blocks

    swagger_schema :PostAggregator do
      property :output_name do
        key :type, :string
      end
      property :operator do
        key :type, :string
      end
      property :field_1 do
        key :type, :string
      end
      property :field_2 do
        key :type, :string
      end
    end
  end
end

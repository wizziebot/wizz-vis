module Docs
  class Dashboard
    include Swagger::Blocks

    swagger_schema :Dashboard do
      key :required, %i[id name]
      property :id do
        key :type, :integer
        key :format, :int64
      end
      property :name do
        key :type, :string
      end
      property :theme do
        key :type, :string
      end
      property :interval do
        key :type, :integer
      end
      property :range do
        key :type, :string
      end
      property :start_time do
        key :type, :string
      end
      property :end_time do
        key :type, :string
      end
      property :widgets do
        key :type, :array
        items do
          key :'$ref', :Widget
        end
      end
    end
  end
end

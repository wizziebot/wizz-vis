module Docs
  class ApiError
    include Swagger::Blocks

    swagger_schema :ApiError do
      key :required, %i[code message]
      property :code do
        key :type, :integer
        key :format, :int32
      end
      property :message do
        key :type, :string
      end
    end
  end
end

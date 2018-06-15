module Docs
  class Widget
    include Swagger::Blocks

    swagger_schema :Widget do
      key :required, %i[id]
      property :id do
        key :type, :integer
        key :format, :int64
      end
      property :type do
        key :type, :string
      end
      property :title do
        key :type, :string
      end
      property :datasource_name do
        key :type, :string
      end
      property :dashboard_id do
        key :type, :integer
        key :format, :int64
      end
      property :row do
        key :type, :integer
      end
      property :col do
        key :type, :integer
      end
      property :size_x do
        key :type, :integer
      end
      property :size_y do
        key :type, :integer
      end
      property :range do
        key :type, :string
      end
      property :start_time do
        key :type, :string
        key :format, 'date-time'
      end
      property :end_time do
        key :type, :string
        key :format, 'date-time'
      end
      property :granularity do
        key :type, :string
      end
      property :limit do
        key :type, :integer
      end
      property :options do
        key :type, :object
      end
      property :dimensions do
        key :type, :array
        items do
          key :type, :string
        end
      end
      property :aggregators do
        key :type, :array
        items do
          property :aggregator do
            key :type, :string
          end
          property :aggregator_name do
            key :type, :string
          end
          property :filters do
            key :type, :array
            items do
              key :'$ref', :Filter
            end
          end
        end
      end
      property :post_aggregators do
        key :type, :array
        items do
          key :'$ref', :PostAggregator
        end
      end
      property :filters do
        key :type, :array
        items do
          key :'$ref', :Filter
        end
      end
    end
  end
end

module Api
  module V1
    class AggregatorsController < Api::V1::BaseController
      include Swagger::Blocks

      before_action :set_datasource

      swagger_path '/datasources/{datasource_id}/aggregators' do
        operation :get do
          key :summary, "Fetch all datasource's aggregators"
          key :produces, [
            'application/json'
          ]
          key :tags, [
            'aggregators'
          ]
          parameter do
            key :name, :datasource_id
            key :in, :path
            key :description, 'ID of datasource to fetch'
            key :required, true
            key :type, :integer
            key :format, :int64
          end
          response 200 do
            key :description, 'Aggregators response'
            schema do
              key :type, :array
              items do
                key :'$ref', :Aggregator
              end
            end
          end
          response :default do
            key :description, 'unexpected error'
            schema do
              key :'$ref', :ApiError
            end
          end
        end
      end

      def index
        render json: @datasource.aggregators
      end

      private

      def set_datasource
        @datasource = Datasource.find(params[:datasource_id])
      end
    end
  end
end

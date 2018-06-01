module Api
  module V1
    class DatasourcesController < Api::V1::BaseController
      include Swagger::Blocks

      swagger_path '/datasources' do
        operation :get do
          key :summary, 'All Datasources'
          key :description, 'Returns all datasources retrieved from datastore'
          key :produces, [
            'application/json'
          ]
          key :tags, [
            'datasources'
          ]
          response 200 do
            key :description, 'datasource response'
            schema do
              key :type, :array
              items do
                key :'$ref', :Datasource
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
        render json: Datasource.all
      end

      swagger_path '/datasources/{id}' do
        operation :get do
          key :summary, 'Find Datasource by ID'
          key :description, 'Returns a single datasource'
          key :produces, [
            'application/json'
          ]
          key :tags, [
            'datasources'
          ]
          parameter do
            key :name, :id
            key :in, :path
            key :description, 'ID of datasource to fetch'
            key :required, true
            key :type, :integer
            key :format, :int64
          end
          response 200 do
            key :description, 'datasource response'
            schema do
              key :'$ref', :Datasource
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

      def show
        render json: Datasource.find(params[:id])
      end
    end
  end
end

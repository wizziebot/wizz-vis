module Api
  module V1
    class WidgetsController < Api::V1::BaseController
      include Swagger::Blocks

      before_action :set_dashboard, only: :index
      before_action :set_widget, only: %i[show data update destroy]

      swagger_path '/dashboards/{dashboard_id}/widgets' do
        operation :get do
          key :summary, "Fetch all dashboard's widgets"
          key :produces, [
            'application/json'
          ]
          key :tags, [
            'widgets'
          ]
          parameter do
            key :name, :dashboard_id
            key :in, :path
            key :description, 'ID of dashboard to fetch'
            key :required, true
            key :type, :integer
            key :format, :int64
          end
          response 200 do
            key :description, 'Widgets response'
            schema do
              key :type, :array
              items do
                key :'$ref', :Widget
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
        render json: @dashboard.widgets
      end

      swagger_path '/widgets/{id}' do
        operation :get do
          key :summary, 'Fetch a widget'
          key :produces, [
            'application/json'
          ]
          key :tags, [
            'widgets'
          ]
          parameter do
            key :name, :id
            key :in, :path
            key :description, 'ID of widget to fetch'
            key :required, true
            key :type, :integer
            key :format, :int64
          end
          response 200 do
            key :description, 'Widgets response'
            schema do
              key :type, :array
              items do
                key :'$ref', :Widget
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

      def show
        render json: @widget
      end

      swagger_path '/widgets/{id}/data' do
        operation :get do
          key :summary, "Fetch a widget's data"
          key :produces, [
            'application/json'
          ]
          key :tags, [
            'widgets'
          ]
          parameter do
            key :name, :id
            key :in, :path
            key :description, 'ID of widget to fetch data'
            key :required, true
            key :type, :integer
            key :format, :int64
          end
          response 200 do
            key :description, 'Query result'
            schema do
              key :type, :object
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

      def data
        render json: @widget.data
      end

      swagger_path '/widgets/{id}' do
        operation :patch do
          key :summary, 'Update a widget'
          key :produces, [
            'application/json'
          ]
          key :tags, [
            'widgets'
          ]
          parameter do
            key :name, :id
            key :in, :path
            key :description, 'ID of widget to update'
            key :required, true
            key :type, :integer
            key :format, :int64
          end
          parameter do
            key :name, :payload
            key :in, :body
            key :description, "Widget's attributes"
            key :required, true
            key :type, :string
            key :example,
                datasource_name: '69be4185-001a-4146-be33-0b72cf4b0959_flow',
                title: '',
                range: 'last_1_hour',
                start_time: '',
                end_time: '',
                granularity: 'all',
                limit: 5,
                options: {},
                dimensions: [],
                aggregators: [{
                  aggregator: '',
                  aggregator_name: '',
                  filters: []
                }],
                filters: [{
                  dimension_name: '',
                  operator: '',
                  value: ''
                }],
                post_aggregators: [{
                  output_name: '',
                  operator: '',
                  field_1: '',
                  field_2: ''
                }]
          end
          response 200 do
            key :description, 'Widgets response'
            schema do
              key :type, :array
              items do
                key :'$ref', :Widget
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

      def update
        # It's neccessary do this to prevent duplicities of post aggregators
        # and filters
        @widget.post_aggregators = [] if params.include?(:post_aggregators)
        @widget.filters = [] if params.include?(:filters)

        if @widget.update_self_and_relations(
          widget_params_update,
          params[:dimensions],
          params[:aggregators],
          params[:filters]
        )
          render json: @widget, status: :ok
        else
          render json: @widget.errors, status: :unprocessable_entity
        end
      end

      swagger_path '/widgets' do
        operation :post do
          key :summary, 'Create a widget'
          key :produces, [
            'application/json'
          ]
          key :tags, [
            'widgets'
          ]
          parameter do
            key :name, :payload
            key :in, :body
            key :description, "Widget's attributes"
            key :required, true
            key :type, :string
            key :example,
              {
                type: 'WidgetValue',
                dashboard_id: 1,
                title: 'Widgets Title',
                row: 0,
                col: 0,
                size_x: 4,
                size_y: 4,
                range: 'last_1_hour',
                start_time: '',
                end_time: '',
                granularity: 'PT1M',
                limit: 5,
                options: {},
                datasource_name: '69be4185-001a-4146-be33-0b72cf4b0959_flow',
                dimensions: [],
                aggregators: [{
                  aggregator: '',
                  aggregator_name: '',
                  filters: []
                }],
                filters: [{
                  dimension_name: '',
                  operator: '',
                  value: ''
                }],
                post_aggregators: [{
                  output_name: '',
                  operator: '',
                  field_1: '',
                  field_2: ''
                }]
              }
          end
          response 200 do
            key :description, 'Widgets response'
            schema do
              key :type, :array
              items do
                key :'$ref', :Widget
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

      def create
        @widget = Widget.new(widget_params_create)

        @widget.datasource = @datasource if @datasource

        if @widget.save
          render json: @widget, status: :ok
        else
          render json: @widget.errors, status: :unprocessable_entity
        end
      end

      swagger_path '/widgets/{id}' do
        operation :delete do
          key :summary, 'Delete a widget'
          key :produces, [
            'application/json'
          ]
          key :tags, [
            'widgets'
          ]
          parameter do
            key :name, :id
            key :in, :path
            key :description, 'ID of widget to update'
            key :required, true
            key :type, :integer
            key :format, :int64
          end
          response 200 do
            key :description, 'Widgets response'
            schema do
              property :message do
                key :type, :string
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

      def destroy
        @widget.destroy
        render json: { message: 'Widget removed' }, status: :ok
      end

      private

      def set_dashboard
        @dashboard = Dashboard.find(params[:dashboard_id])
      end

      def set_widget
        @widget = Widget.find(params[:id])
      end

      def widget_params_create
        params.permit(
          :type, :title, :row, :col, :size_x, :size_y, :range, :start_time,
          :end_time, :granularity, :limit, :dashboard_id, dimensions: [],
          aggregators: [:aggregator, :aggregator_name, filters: %i[dimension_name operator value]],
          filters: %i[dimension_name operator value]
        ).tap do |attr|
          attr[:datasource_id] = Datasource.find_by(name: params[:datasource_name]).id
          attr[:post_aggregators_attributes] = params.fetch(:post_aggregators, []).map do |pa|
            pa.permit(:output_name, :operator, :field_1, :field_2)
          end
          attr[:options] = params[:options].permit! if params[:options]
        end
      end

      def widget_params_update
        params.permit(
          :type, :title, :row, :col, :size_x, :size_y, :range, :start_time,
          :end_time, :granularity, :limit
        ).tap do |attr|
          if params[:datasource_name]
            attr[:datasource_id] = Datasource.find_by(name: params[:datasource_name]).id
          end
          attr[:post_aggregators_attributes] = params.fetch(:post_aggregators, []).map do |pa|
            pa.permit(:output_name, :operator, :field_1, :field_2)
          end
          attr[:options] = params[:options].permit! if params[:options]
        end
      end
    end
  end
end

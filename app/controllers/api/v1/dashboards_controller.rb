module Api
  module V1
    class DashboardsController < Api::V1::BaseController
      include Swagger::Blocks

      swagger_path '/dashboards' do
        operation :get do
          key :summary, 'All Dashboards'
          key :description, 'Returns all dashboards'
          key :produces, [
            'application/json'
          ]
          key :tags, [
            'dashboards'
          ]
          response 200 do
            key :description, 'dashboards response'
            schema do
              key :type, :array
              items do
                key :'$ref', :Dashboard
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
        render json: Dashboard.all
      end

      swagger_path '/dashboards/{id}' do
        operation :get do
          key :summary, 'Find Dashboard by ID'
          key :description, 'Returns a single dashboard'
          key :produces, [
            'application/json'
          ]
          key :tags, [
            'dashboards'
          ]
          parameter do
            key :name, :id
            key :in, :path
            key :description, 'ID of dashboard to fetch'
            key :required, true
            key :type, :integer
            key :format, :int64
          end
          response 200 do
            key :description, 'dashboard response'
            schema do
              key :'$ref', :Dashboard
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
        render json: Dashboard.find(params[:id])
      end

      swagger_path '/dashboards' do
        operation :post do
          key :summary, 'Create a dashboard'
          key :produces, [
            'application/json'
          ]
          key :tags, [
            'dashboards'
          ]
          parameter do
            key :name, :payload
            key :in, :body
            key :description, "Dashboard's attributes"
            key :required, true
            key :type, :string
            key :example, {
              name: "Dashboard's name",
              theme: 'light',
              interval: 30,
              locked: false,
              widgets: [
                {
                  type: 'WidgetValue',
                  title: 'Widgets Title',
                  row: 0,
                  col: 0,
                  size_x: 4,
                  size_y: 4,
                  range: 'last_1_hour',
                  granularity: 'PT1M',
                  start_time: '',
                  end_time: '',
                  limit: 100,
                  options: {},
                  datasource_name: '69be4185-001a-4146-be33-0b72cf4b0959_flow',
                  dimensions: [],
                  aggregators: [{
                    aggregator: '',
                    aggregator_name: '',
                    filters: []
                  }],
                  post_aggregators: [{
                    output_name: '',
                    operator: '',
                    field_1: '',
                    field_2: ''
                  }]
                }
              ]
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
        @dashboard = Dashboard.new(dashboard_params)

        if @dashboard.save
          render json: @dashboard, status: :ok
        else
          render json: @dashboard.errors, status: :unprocessable_entity
        end
      end

      swagger_path '/dashboards/{id}' do
        operation :patch do
          key :summary, 'Update a single dashboard'
          key :description, 'Update a single dashboard'
          key :produces, [
            'application/json'
          ]
          key :tags, [
            'dashboards'
          ]
          parameter do
            key :name, :id
            key :in, :path
            key :description, 'ID of dashboard to fetch'
            key :required, true
            key :type, :integer
            key :format, :int64
          end
          parameter do
            key :name, :name
            key :in, :query
            key :description, "Dashboard's name"
            key :type, :string
          end
          parameter do
            key :name, :theme
            key :in, :query
            key :description, '[light, dark]'
            key :default, 'light'
            key :type, :string
          end
          parameter do
            key :name, :interval
            key :in, :query
            key :description, "Time interval of dashboard's reload (sec). \
              Possible values are: \n\
              [null, 30, 60, 300, 900, 1800, 3600, 7200]"
            key :example, '30'
            key :type, :string
          end
          response 200 do
            key :description, 'dashboard response'
            schema do
              key :'$ref', :Dashboard
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
        @dashboard = Dashboard.find(params[:id])
        if @dashboard.update(dashboard_params)
          render json: @dashboard, status: :ok
        else
          render json: @dashboard.errors, status: :unprocessable_entity
        end
      end

      swagger_path '/dashboards/{id}' do
        operation :delete do
          key :summary, 'Delete a dashboard'
          key :produces, [
            'application/json'
          ]
          key :tags, [
            'dashboards'
          ]
          parameter do
            key :name, :id
            key :in, :path
            key :description, 'ID of dashboard to fetch'
            key :required, true
            key :type, :integer
            key :format, :int64
          end
          response 200 do
            key :description, 'deletion response'
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
        Dashboard.find(params[:id]).destroy
        render json: { message: 'Dashboard removed' }, status: :ok
      end

      private

      # Allow only dashboard attributes and widgets attributes.
      # options is a schemaless json, so it's neccessary to permit
      # all its fields.
      def dashboard_params
        params[:widgets_attributes] = params.delete(:widgets)
        params.permit(
          :name, :theme, :interval, :locked, :widgets_attributes
        ).tap do |dashboard|
          dashboard[:widgets_attributes] = (params[:widgets_attributes] || []).map do |w|
            w.permit(
              :type, :title, :row, :col, :size_x, :size_y, :range, :start_time,
              :end_time, :granularity, :limit, dimensions: [],
              aggregators: [:aggregator, :aggregator_name, filters: %i[dimension_name operator value]],
              filters: %i[dimension_name operator value]
            ).tap do |attr|
              if w[:datasource_name]
                attr[:datasource_id] = Datasource.find_by(name: w[:datasource_name]).id
              end
              attr[:post_aggregators_attributes] = w.fetch(:post_aggregators).map do |pa|
                pa.permit(:output_name, :operator, :field_1, :field_2)
              end
              attr[:options] = w[:options].permit! if w[:options]
            end
          end
        end
      end
    end
  end
end

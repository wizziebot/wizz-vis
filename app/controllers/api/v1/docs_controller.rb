module Api
  module V1
    class DocsController < Api::V1::BaseController
      include Swagger::Blocks

      swagger_root do
        key :swagger, '2.0'
        info do
          key :version, '1.0.0'
          key :title, 'Wizz-Vis API'
          key :description, 'Wizz-Vis API Documentation'
          key :termsOfService, 'https://github.com/wizzie-io/wizz-vis'
          contact do
            key :name, 'Wizzie Development Team'
            key :email, 'japarra@wizzie.io'
          end
          license do
            key :name, 'License'
          end
        end
        key :basePath, '/api/v1'
        key :consumes, ['application/json']
        key :produces, ['application/json']
      end

      # A list of all classes that have swagger_* declarations.
      SWAGGERED_CLASSES = [
        DatasourcesController,
        DashboardsController,
        DimensionsController,
        AggregatorsController,
        WidgetsController,
        Docs::Datasource,
        Docs::Aggregator,
        Docs::Dimension,
        Docs::Dashboard,
        Docs::Widget,
        Docs::PostAggregator,
        Docs::Filter,
        Docs::ApiError,
        self
      ].freeze

      def index
        render json: Swagger::Blocks.build_root_json(SWAGGERED_CLASSES)
      end
    end
  end
end

require 'rails_helper'

RSpec.describe Api::V1::WidgetsController, type: :controller do
  let(:datasource) { create(:datasource_with_relations) }
  let(:aggregator) { datasource.aggregators.first }
  let(:widget) do
    create(:widget, datasource: datasource, aggregators: [aggregator])
  end
  let(:valid_attributes) do
    {
      type: widget.type,
      datasource_name: datasource.name,
      dashboard_id: widget.dashboard_id,
      row: 0, col: 0, size_x: 4, size_y: 4,
      granularity: widget.granularity,
      range: widget.range,
      dimensions: [],
      aggregators: [{ aggregator: aggregator.name,
                      aggregator_name: aggregator.name,
                      filters: [] }],
      filters: [
        {
          dimension_name: datasource.dimensions.map(&:name).first,
          operator: 'neq',
          value: nil
        }
      ],
      post_aggregators: [
        {
          output_name: 'pa',
          operator: '+',
          field_1: aggregator.name,
          field_2: '2'
        }
      ]
    }
  end

  describe 'GET #index' do
    it 'returns a success response' do
      get :index, params: { dashboard_id: widget.dashboard_id }
      expect(response).to be_successful
    end

    it 'returns all widgets from a dashboard' do
      get :index, params: { dashboard_id: widget.dashboard_id }
      widgets = JSON.parse(response.body)
      expect(widgets.count).to eq(1)
    end
  end

  describe 'GET #show' do
    it 'returns a success response' do
      get :show, params: { id: widget.id }
      expect(response).to be_successful
    end

    it 'returns a serialized widget' do
      get :show, params: { id: widget.id }
      expect(response.body).to eq(Api::V1::WidgetSerializer.new(widget).to_json)
    end

    it 'returns a not found for non exist widget' do
      get :show, params: { id: 0 }
      expect(response.status).to eq(404)
    end
  end

  describe 'GET #data' do
    before do
      WebMock.stub_request(:post, ENV['DRUID_URL']).to_return(body: '[]')
    end

    it 'returns a success response' do
      get :data, params: { id: widget.id }
      expect(response).to be_successful
    end
  end

  describe 'PATCH #update' do
    it 'returns a success response' do
      patch :update, params: {
        id: widget.id
      }
      expect(response).to be_successful
    end

    it 'returns the created widget with the changes' do
      patch :update, params: {
        id: widget.id,
        title: 'Changed title'
      }
      new_widget = JSON.parse(response.body)
      expect(new_widget['title']).to eq('Changed title')
    end

    it 'returns a success response when updating the datasource' do
      new_datasource = create(:datasource, name: 'new datasource')

      patch :update, params: {
        id: widget.id,
        datasource_name: new_datasource.name
      }
      expect(response).to be_successful
    end

    it 'returns a sucess response when updating the aggregators' do
      dimension = datasource.dimensions.first

      aggregator_params = [{
        'aggregator' => aggregator.name,
        'aggregator_name' => 'filtered_aggregator',
        'filters' => [{
          'dimension_name' => dimension.name,
          'operator' => 'eq',
          'value' => 'a'
        }]
      }]

      patch :update, params: {
        id: widget.id,
        aggregators: aggregator_params
      }

      expect(response).to be_successful
      expect(JSON.parse(response.body)['aggregators']).to eq(aggregator_params)
    end

    it 'fails when try to update to unexisted datasource' do
    #   patch :update, params: {
    #     id: widget.id,
    #     datasource_name: 'fake_datasource'
    #   }
    #   expect(response).to_not be_successful
      skip('Control when datasource is incorrect.')
    end
  end

  describe 'POST #create' do
    it 'returns a success response' do
      post :create, params: valid_attributes
      expect(response).to be_successful
    end

    it 'returns the created widget' do
      post :create, params: valid_attributes
      new_widget = JSON.parse(response.body)
      expect(valid_attributes[:datasource_name]).to eq(new_widget['datasource_name'])
      expect(valid_attributes[:dashboard_id]).to eq(new_widget['dashboard_id'])
      expect(valid_attributes[:dimensions]).to eq(new_widget['dimensions'])
      valid_attributes[:aggregators].each_with_index do |pa, index|
        expect(pa.stringify_keys).to eq(new_widget['aggregators'][index])
      end
      valid_attributes[:post_aggregators].each_with_index do |pa, index|
        expect(pa.stringify_keys).to eq(new_widget['post_aggregators'][index])
      end
    end

    it 'allows more than one filter' do
      filters_attributes = valid_attributes.merge(
        filters: [
          {
            dimension_name: datasource.dimensions.map(&:name).first,
            operator: 'eq',
            value: 'a'
          },
          {
            dimension_name: datasource.dimensions.map(&:name).first,
            operator: 'eq',
            value: 'b'
          }
        ]
      )
      post :create, params: filters_attributes
      new_widget = JSON.parse(response.body)
      filters_attributes[:filters].each do |f|
        expect(new_widget['filters']).to include(f.as_json)
      end
    end

    it 'allows more than one aggregator with filters' do
      aggregators = datasource.aggregators.first(2)
      aggregators_attributes = valid_attributes.merge(
        aggregators: aggregators.map do |aggregator|
          {
            aggregator: aggregator.name,
            aggregator_name: aggregator.name,
            filters: [
              {
                dimension_name: datasource.dimensions.map(&:name).first,
                operator: 'eq',
                value: 'a'
              }
            ]
          }
        end
      )

      post :create, params: aggregators_attributes
      new_widget = JSON.parse(response.body)
      aggregators_attributes[:aggregators].each do |a|
        expect(new_widget['aggregators']).to include(a.as_json)
      end
    end
  end

  describe 'DELETE #destroy' do
    it 'returns a success response' do
      delete :destroy, params: { id: widget.id }
      expect(response).to be_successful
    end
  end
end

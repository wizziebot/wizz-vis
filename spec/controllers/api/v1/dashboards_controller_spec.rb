require 'rails_helper'

RSpec.describe Api::V1::DashboardsController, type: :controller do
  let(:datasource) { create(:datasource_with_relations) }
  let(:aggregators) { datasource.aggregators }
  let(:dashboard) { create(:dashboard) }
  let(:widget) do
    create(:widget,
           datasource: datasource,
           aggregators: aggregators.first(1))
  end
  let(:valid_attributes) do
    {
      name: "Dashboard's name",
      theme: 'light',
      interval: 30,
      locked: false,
      widgets: [
        type: widget.type,
        datasource_name: datasource.name,
        row: 0, col: 0, size_x: 4, size_y: 4,
        granularity: widget.granularity,
        range: widget.range,
        dimensions: [],
        aggregators: aggregators.map do |a|
          { aggregator: a.name, aggregator_name: a.name, filters: [] }
        end,
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
        ],
        post_aggregators: [
          {
            output_name: 'pa',
            operator: '+',
            field_1: aggregators.first.name,
            field_2: '2'
          }
        ]
      ]
    }
  end

  describe 'GET #index' do
    it 'returns a success response' do
      get :index
      expect(response).to be_successful
    end
  end

  describe 'POST #create' do
    it 'returns a success response' do
      post :create, params: valid_attributes
      expect(response).to be_successful
    end
  end

  describe 'PUT #update' do
    it 'returns a success response' do
      patch :update, params: { id: dashboard.id, name: 'New Name' }
      expect(response).to be_successful
    end
  end

  describe 'DELETE #destroy' do
    it 'returns a success response' do
      delete :destroy, params: { id: dashboard.id }
      expect(response).to be_successful
    end
  end
end

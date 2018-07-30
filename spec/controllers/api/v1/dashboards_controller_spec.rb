require 'rails_helper'

RSpec.describe Api::V1::DashboardsController, type: :controller do
  let(:datasource) { create(:datasource_with_relations) }
  let(:aggregators) { datasource.aggregators }
  let(:dashboard) { create(:dashboard) }
  let(:widget) { create(:widget, datasource: datasource) }
  let(:valid_attributes) do
    {
      name: "Dashboard's name",
      theme: 'light',
      interval: 30,
      locked: false,
      widgets: [
        type: widget.type,
        datasource_name: datasource.name,
        dashboard_id: widget.dashboard_id,
        row: 0, col: 0, size_x: 4, size_y: 4,
        dimensions: datasource.dimensions.map(&:name),
        aggregators: datasource.aggregators.map(&:name),
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

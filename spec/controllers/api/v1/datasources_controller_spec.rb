require 'rails_helper'

RSpec.describe Api::V1::DatasourcesController, type: :controller do
  let(:datasource) { create(:datasource_with_relations) }

  describe 'GET #index' do
    it 'returns a success response' do
      get :index
      expect(response).to be_successful
    end
  end

  describe 'GET #show' do
    it 'returns a success response' do
      get :show, params: { id: datasource.id }
      expect(response).to be_successful
    end
  end
end

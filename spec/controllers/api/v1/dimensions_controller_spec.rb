require 'rails_helper'

RSpec.describe Api::V1::DimensionsController, type: :controller do
  let(:datasource) { create(:datasource_with_relations) }

  describe 'GET #index' do
    it 'returns a success response' do
      get :index, params: { datasource_id: datasource.id }
      expect(response).to be_successful
    end
  end
end

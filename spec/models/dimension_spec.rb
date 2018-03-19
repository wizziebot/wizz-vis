require 'rails_helper'

RSpec.describe Dimension, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:datasource) }
    it { is_expected.to have_and_belong_to_many(:widgets) }
  end

  describe '#coordinate?' do
    let(:coordinate_dimension) { create(:coordinate) }

    it 'return valid coordinate dimension' do
      expect(coordinate_dimension.coordinate?).to be_truthy
    end
  end
end

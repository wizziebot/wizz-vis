require 'rails_helper'

RSpec.describe Aggregator, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:datasource) }
    it { is_expected.to have_many(:aggregator_widgets) }
    it { is_expected.to have_many(:widgets).through(:aggregator_widgets) }
  end

  describe '#coordinate?' do
    let(:coordinate_aggregator) { create(:coordinate_aggregator) }

    it 'return valid coordinate aggregator' do
      expect(coordinate_aggregator.coordinate?).to be_truthy
    end
  end
end

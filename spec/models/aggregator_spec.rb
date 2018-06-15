require 'rails_helper'

RSpec.describe Aggregator, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:datasource) }
    it { is_expected.to have_many(:aggregator_widgets) }
    it { is_expected.to have_many(:widgets).through(:aggregator_widgets) }
  end
end

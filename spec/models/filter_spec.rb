require 'rails_helper'

RSpec.describe Filter, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:dimension) }
    it { is_expected.to belong_to(:widget) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:operator) }
    it {
      is_expected.to validate_inclusion_of(:operator)
        .in_array(%w[eq neq > <= < <= in nin in_rec in_circ regex])
    }
  end
end

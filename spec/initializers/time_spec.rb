require 'rails_helper'
require_relative '../../config/initializers/time'

describe 'now' do
  it 'returns time without milliseconds' do
    100.times do
      expect(Time.now.nsec).to eq(0)
    end
  end
end

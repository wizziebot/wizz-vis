require 'rails_helper'

RSpec.describe WidgetBar, type: :model do
  describe 'validations' do
    it { is_expected.not_to allow_value('all').for(:granularity) }
  end
end

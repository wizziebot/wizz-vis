require 'rails_helper'

RSpec.describe WidgetLocation, type: :model do
  describe 'locatable' do
    it_behaves_like 'locatable'
  end
end

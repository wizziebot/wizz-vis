require 'rails_helper'

RSpec.describe WidgetText, type: :model do
  let(:widget) do
    create(:widget_text)
  end

  describe '#data' do
    it 'returns an empty array' do
      expect(widget.data).to be_nil
    end
  end
end

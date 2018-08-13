require 'rails_helper'

RSpec.describe WidgetImage, type: :model do
  let(:widget) do
    create(:widget_image)
  end

  describe '#data' do
    it 'returns an empty array' do
      expect(widget.data).to eq([])
    end
  end
end

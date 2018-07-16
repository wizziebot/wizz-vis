require 'rails_helper'

RSpec.describe WidgetValue, type: :model do
  describe 'validations' do
    context 'valid widget' do
      let(:datasource) { create(:datasource_with_relations) }
      let(:widget) do
        create(:widget_value, aggregators: datasource.aggregators.first(1))
      end

      it 'returns valid' do
        expect(widget.valid?).to be true
      end

      it 'is not valid if has dimension associated' do
        widget.dimensions << datasource.dimensions.first
        expect(widget.valid?).to be false
      end
    end
  end
end

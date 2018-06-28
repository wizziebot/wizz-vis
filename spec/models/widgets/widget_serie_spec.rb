require 'rails_helper'

RSpec.describe WidgetSerie, type: :model do
  describe 'validations' do
    it { is_expected.not_to allow_value('all').for(:granularity) }

    context 'valid widget' do
      let(:datasource) { create(:datasource_with_relations) }
      let(:widget) { create(:widget_serie) }

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

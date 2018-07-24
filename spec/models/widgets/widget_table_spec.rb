require 'rails_helper'

RSpec.describe WidgetTable, type: :model do
  describe 'validations' do
    it { is_expected.to allow_value('all').for(:granularity) }

    context 'valid widget' do
      let(:datasource) { create(:datasource_with_relations) }
      let(:widget) do
        create(:widget_table,
               datasource: datasource,
               dimensions: datasource.dimensions.first(1),
               aggregators: datasource.aggregators.first(1))
      end

      it 'returns valid' do
        expect(widget.valid?).to be true
      end

      it 'is not valid if has no dimension associated' do
        widget.dimensions = []
        expect(widget.valid?).to be false
      end

      it 'is not valid if has no aggregator associated' do
        widget.aggregators = []
        expect(widget.valid?).to be false
      end

      it 'is valid if has more than one aggregator associated' do
        widget.aggregators << datasource.aggregators.last
        expect(widget.valid?).to be true
      end

      it 'is valid if has more than one dimension associated' do
        widget.dimensions << datasource.dimensions.last
        expect(widget.valid?).to be true
      end
    end
  end
end

require 'rails_helper'

RSpec.describe WidgetBar, type: :model do
  describe 'validations' do
    it { is_expected.to allow_value('all').for(:granularity) }

    context 'valid widget' do
      let(:datasource) { create(:datasource_with_relations) }
      let(:widget) do
        create(:widget_histogram,
               datasource: datasource,
               aggregators: datasource.aggregators.where(aggregator_type: 'approxHistogramFold'))
      end

      it 'returns valid' do
        expect(widget.valid?).to be true
      end

      it 'is not valid if has dimensions associated' do
        widget.dimensions << datasource.dimensions.first
        expect(widget.valid?).to be false
      end

      it 'is not valid if has no aggregator associated' do
        widget.aggregators = []
        expect(widget.valid?).to be false
      end
    end
  end
end

require 'rails_helper'

RSpec.describe WidgetPlaneRoute, type: :model do
  describe 'validations' do
    it { is_expected.not_to allow_value('all').for(:granularity) }

    context 'valid widget' do
      let(:datasource) { create(:datasource_with_relations) }
      let(:widget) do
        create(:widget_route,
               datasource: datasource,
               dimensions: datasource.dimensions.where(name: 'coordinates'),
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

      it 'is not valid if has no coordinate dimension' do
        widget.dimensions = datasource.dimensions.where.not(name: 'coordinates')
        expect(widget.valid?).to be false
      end
    end
  end
end

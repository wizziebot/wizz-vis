require 'spec_helper'

shared_examples_for 'routeable' do
  let(:model) { described_class } # the class that includes the concern

  describe 'validations' do
    context 'widget' do
      let(:datasource) { create(:datasource_with_relations) }

      it 'is is not valid without aggregators' do
        object = FactoryBot.build(model.to_s.underscore.to_sym, datasource: datasource, aggregators: [])
        expect(object.valid?).to be false
      end

      it 'is valid if has more than one aggregator associated' do
        object = FactoryBot.build(model.to_s.underscore.to_sym, datasource: datasource, aggregators: [])
        object.aggregators += object.datasource.aggregators.first(2)
        expect(object.valid?).to be true
      end
    end
  end
end

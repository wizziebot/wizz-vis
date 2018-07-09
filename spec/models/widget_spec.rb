require 'rails_helper'

RSpec.describe Widget, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:dashboard) }
    it { is_expected.to belong_to(:datasource) }
    it { is_expected.to have_and_belong_to_many(:dimensions) }
    it { is_expected.to have_many(:aggregator_widgets) }
    it { is_expected.to have_many(:aggregators).through(:aggregator_widgets) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:granularity) }
    it { is_expected.to validate_presence_of(:row) }
    it { is_expected.to validate_presence_of(:col) }
    it { is_expected.to validate_presence_of(:size_x) }
    it { is_expected.to validate_presence_of(:size_y) }
  end

  describe 'custom_validations' do
    context 'when no interval is set' do
      let(:widget) { create(:widget_serie) }

      it 'is not valid' do
        widget.range = nil
        widget.start_time = nil
        widget.end_time = nil

        expect(widget.valid?).to be false
      end

    end
  end

  describe 'intervalable' do
    it_behaves_like 'intervalable'
  end

  describe '#data' do
    context 'when there are no data' do
      before do
        WebMock.stub_request(:post, ENV['DRUID_URL']).to_return(body: '[]')
      end

      let(:widget) { create(:widget_serie) }

      it 'obtain empty array' do
        expect(widget.data).to eql []
      end
    end
  end
end

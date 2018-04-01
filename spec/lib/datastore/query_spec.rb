require 'rails_helper'

describe Datastore::Query do
  let(:datasource) { create(:datasource) }
  let(:aggregator) { create(:bytes) }
  let(:application_dimension) { create(:application_dimension) }
  let(:filter) { create(:application_filter) }

  context 'Timeserie query' do
    let(:query) do
      Datastore::Query.new(
        datasource: datasource.name,
        properties: {
          interval: [Time.now - 1.day, Time.now],
          granularity: 'PT1H'
        },
        aggregators: [aggregator],
        filters: [filter],
        dimensions: []
      )
    end
    let(:result) { query.run }
    let(:query_json) {query.as_json}

    before do
      WebMock.stub_request(:post, ENV['DRUID_URL'])
             .to_return(body:
                '[
                  {
                    "timestamp": "2017-02-27T23:00:00.000Z",
                    "result": { "sum_bytes": 33450662916 }
                  },
                  {
                    "timestamp": "2017-02-28T00:00:00.000Z",
                    "result": { "sum_bytes": 31297146445 }
                  }
                ]')
    end

    describe '#timeserie?' do
      it 'returns true' do
        expect(query.timeserie?).to be true
      end
    end

    describe '#run' do
      it 'converts data to timeserie format' do
        expect(result).to be_instance_of(Array)
        expect(result[0]).to have_key('timestamp')
        expect(result[0]).to have_key('sum_bytes')
      end
    end

    describe '#as_json' do
      it 'returns query hash' do
        expect(query_json).to be_instance_of(Hash)
        expect(query_json['queryType']).to eq('timeseries')
      end
    end

    describe '#set_filters' do
      it 'set the configured filters' do
        expect(query_json).to have_key('filter')
      end
    end
  end

  context 'TopN query' do
    let(:query) do
      Datastore::Query.new(
        datasource: datasource.name,
        properties: {
          interval: [Time.now - 1.day, Time.now]
        },
        aggregators: [aggregator],
        dimensions: [application_dimension],
        filters: []
      )
    end
    let(:result) { query.run }
    let(:query_json) {query.as_json}

    before do
      WebMock.stub_request(:post, ENV['DRUID_URL'])
             .to_return(body:
                '[
                  {
                    "timestamp": "2017-02-27T23:00:00.000Z",
                    "result": { "application": "ssl", "sum_bytes": 33450662916 }
                  },
                  {
                    "timestamp": "2017-02-28T00:00:00.000Z",
                    "result": { "application": "http", "sum_bytes": 31297146445 }
                  }
                ]')
    end

    describe '#top_n?' do
      it 'returns true' do
        expect(query.top_n?).to be true
      end
    end

    describe '#run' do
      it 'converts data to topN format' do
        expect(result).to be_instance_of(Array)
        expect(result[0]).to have_key('application')
        expect(result[0]).to have_key('sum_bytes')
      end
    end

    describe '#as_json' do
      it 'returns query hash' do
        expect(query_json).to be_instance_of(Hash)
        expect(query_json['queryType']).to eq('topN')
      end
    end
  end

  context 'GroupBy query' do
    let(:coordinate_dimension) {create(:coordinate)}
    let(:query) do
      Datastore::Query.new(
        datasource: datasource.name,
        properties: {
          interval: [Time.now - 1.day, Time.now]
        },
        aggregators: [aggregator],
        dimensions: [application_dimension, coordinate_dimension],
        filters: []
      )
    end
    let(:result) { query.run }
    let(:query_json) {query.as_json}

    before do
      WebMock.stub_request(:post, ENV['DRUID_URL'])
             .to_return(body:
                '[
                  {
                    "timestamp": "2017-02-27T23:00:00.000Z",
                    "event": {
                      "coordinate": "45.32,2.43",
                      "application": "ssl",
                      "sum_bytes": 33450662916
                    }
                  },
                  {
                    "timestamp": "2017-02-28T00:00:00.000Z",
                    "event": {
                      "coordinate": "45.31,2.44",
                      "application": "http",
                      "sum_bytes": 31297146445
                    }
                  }
                ]')
    end

    describe '#group_by?' do
      it 'returns true' do
        expect(query.group_by?).to be true
      end
    end

    describe '#run' do
      it 'converts data to groupBy format' do
        expect(result).to be_instance_of(Array)
        expect(result[0]).to have_key('timestamp')
        expect(result[0]).to have_key('coordinate')
        expect(result[0]).to have_key('application')
        expect(result[0]).to have_key('sum_bytes')
      end
    end

    describe '#as_json' do
      it 'returns query hash' do
        expect(query_json).to be_instance_of(Hash)
        expect(query_json['queryType']).to eq('groupBy')
      end
    end
  end

  context 'Not Equal filters' do
    let(:query) do
      Datastore::Query.new(
        datasource: datasource.name,
        properties: { interval: [Time.now - 1.day, Time.now] },
        aggregators: [aggregator],
        dimensions: [application_dimension],
        filters: [
          create(:application_filter, operator: 'neq')
        ]
      )
    end
    let(:result) { query.run }
    let(:query_json) {query.as_json}

    describe '#set_filters' do
      it 'includes not equal filter' do
        expect(query_json).to have_key('filter')
        expect(query_json['filter']).to include('type' => 'not')
      end
    end
  end

  context 'Regexp filters' do
    let(:query) do
      Datastore::Query.new(
        datasource: datasource.name,
        properties: { interval: [Time.now - 1.day, Time.now] },
        aggregators: [aggregator],
        dimensions: [application_dimension],
        filters: [
          create(:application_filter, operator: 'regex')
        ]
      )
    end
    let(:result) { query.run }
    let(:query_json) {query.as_json}

    describe '#set_filters' do
      it 'includes regex filter' do
        expect(query_json).to have_key('filter')
        expect(query_json['filter']).to include('type' => 'regex')
        expect(query_json['filter']).to have_key('pattern')
      end
    end
  end

  context 'Javascript filters' do
    let(:query) do
      Datastore::Query.new(
        datasource: datasource.name,
        properties: { interval: [Time.now - 1.day, Time.now] },
        aggregators: [aggregator],
        dimensions: [application_dimension],
        filters: [
          create(:application_filter, operator: '>')
        ]
      )
    end
    let(:result) { query.run }
    let(:query_json) {query.as_json}

    describe '#set_filters' do
      it 'includes greater than filter' do
        expect(query_json).to have_key('filter')
        expect(query_json['filter']).to include('type' => 'javascript')
        expect(query_json['filter']).to have_key('function')
        expect(query_json['filter']['function']).to include(' > ')
      end
    end
  end
end

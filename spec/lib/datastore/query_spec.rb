require 'rails_helper'

describe Datastore::Query do
  let(:datasource) { create(:datasource) }
  let(:long_sum_agg) { create(:bytes) }
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
        aggregators: [long_sum_agg],
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
        aggregators: [long_sum_agg],
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
        aggregators: [long_sum_agg],
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
        aggregators: [long_sum_agg],
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
        aggregators: [long_sum_agg],
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
        aggregators: [long_sum_agg],
        dimensions: [application_dimension],
        filters: [
          create(:application_filter, operator: '>')
        ]
      )
    end
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

  context 'Aggregators' do
    describe 'Histogram with default breaks' do
      let(:hist_dwell_agg) { create(:hist_dwell) }
      let(:query) do
        Datastore::Query.new(
          datasource: datasource.name,
          properties: { interval: [Time.now - 1.day, Time.now] },
          aggregators: [hist_dwell_agg]
        )
      end
      let(:query_json) { query.as_json }

      it 'post aggregation is included in the query' do
        expect(query_json).to have_key('postAggregations')
        expect(query_json['postAggregations']).to eq(
          [{
            'name' => 'hist_dwell',
            'fieldName' => 'raw_hist_dwell',
            'type' => 'equalBuckets',
            'numBuckets' => 10
          }]
        )
      end
    end
  end

  context 'Post Aggregators' do
    let(:bytes_agg) { create(:bytes) }
    let(:events_agg) { create(:events) }
    let(:users_agg) { create(:users) }

    describe 'Arithmetic post aggregation' do
      let(:bps_agg) { create(:bytes_per_event) }
      let(:query) do
        Datastore::Query.new(
          datasource: datasource.name,
          properties: { interval: [Time.now - 1.day, Time.now] },
          aggregators: [bytes_agg, events_agg],
          post_aggregators: [bps_agg]
        )
      end
      let(:query_json) { query.as_json }

      it 'is included in the query' do
        expect(query_json).to have_key('postAggregations')
        expect(query_json['postAggregations']).to eq(
          [{
            'type' => 'arithmetic',
            'fn' => '/',
            'fields' => [
              { 'fieldName' => 'sum_bytes', 'type' => 'fieldAccess' },
              { 'fieldName' => 'events', 'type' => 'fieldAccess' }
            ],
            'name' => 'bps' }]
        )
      end
    end

    describe 'Post aggregation with constant and hyperUnique' do
      let(:constant_agg) { create(:constant_pg) }
      let(:query) do
        Datastore::Query.new(
          datasource: datasource.name,
          properties: { interval: [Time.now - 1.day, Time.now] },
          aggregators: [users_agg],
          post_aggregators: [constant_agg]
        )
      end
      let(:query_json) { query.as_json }

      it 'is included in the query' do
        expect(query_json).to have_key('postAggregations')
        expect(query_json['postAggregations']).to eq(
          [{
            'type' => 'arithmetic',
            'fn' => '*',
            'fields' => [
              { 'fieldName' => 'users', 'type' => 'hyperUniqueCardinality' },
              { 'value' => '100', 'type' => 'constant' }
            ],
            'name' => 'percentage' }]
        )
      end
    end
  end
end

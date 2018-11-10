require 'rails_helper'

describe Datastore::Query do
  let(:datasource) { create(:datasource_with_relations) }
  let(:widget) do
    create(:widget, datasource: datasource,
           aggregators: datasource.aggregators.first(1))
  end
  let(:long_sum_agg) { create(:bytes) }
  let(:aggregator_widget_1) do
    create(:aggregator_widget, widget: widget, aggregator: long_sum_agg)
  end
  let(:application_dimension) { create(:application_dimension) }
  let(:filter) { create(:application_filter, filterable: widget) }

  context 'Timeserie query' do
    let(:query) do
      Datastore::Query.new(
        datasource: datasource.name,
        properties: {
          intervals: [[Time.now - 1.day, Time.now]],
          granularity: 'PT1H'
        },
        aggregators: [aggregator_widget_1],
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
          intervals: [[Time.now - 1.day, Time.now]]
        },
        aggregators: [aggregator_widget_1],
        dimensions: [application_dimension],
        filters: []
      )
    end
    let(:result) { query.run }
    let(:query_json) { query.as_json }

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
    let(:coordinate_dimension) {create(:coordinate_dimension)}
    let(:query) do
      Datastore::Query.new(
        datasource: datasource.name,
        properties: {
          intervals: [[Time.now - 1.day, Time.now]]
        },
        aggregators: [aggregator_widget_1],
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
        properties: { intervals: [[Time.now - 1.day, Time.now]] },
        aggregators: [aggregator_widget_1],
        dimensions: [application_dimension],
        filters: [
          create(:application_filter, operator: 'neq', filterable: widget)
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
        properties: { intervals: [[Time.now - 1.day, Time.now]] },
        aggregators: [aggregator_widget_1],
        dimensions: [application_dimension],
        filters: [
          create(:application_filter, operator: 'regex', filterable: widget)
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
        properties: { intervals: [[Time.now - 1.day, Time.now]] },
        aggregators: [aggregator_widget_1],
        dimensions: [application_dimension],
        filters: [
          create(:application_filter, operator: '>', filterable: widget)
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
      let(:hist_dwell_agg) do
        create(:aggregator_widget, widget: widget, aggregator: create(:hist_dwell))
      end
      let(:query) do
        Datastore::Query.new(
          datasource: datasource.name,
          properties: { intervals: [[Time.now - 1.day, Time.now]] },
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
    let(:bytes_agg) do
      create(:aggregator_widget, widget: widget, aggregator: create(:bytes))
    end

    let(:events_agg) do
      create(:aggregator_widget, widget: widget, aggregator: create(:events))
    end

    let(:users_agg) do
      create(:aggregator_widget, widget: widget, aggregator: create(:users))
    end

    describe 'Arithmetic post aggregation' do
      let(:bps_agg) { create(:bytes_per_event, widget: widget) }
      let(:query) do
        Datastore::Query.new(
          datasource: datasource.name,
          properties: { intervals: [[Time.now - 1.day, Time.now]] },
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
      let(:constant_agg) { create(:constant_pg, widget: widget) }
      let(:query) do
        Datastore::Query.new(
          datasource: datasource.name,
          properties: { intervals: [[Time.now - 1.day, Time.now]] },
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

    describe 'ThetaSketch Aggregation' do
      let(:clients_agg) do
        create(:aggregator_widget, widget: widget, aggregator: create(:clients))
      end

      let(:query) do
        Datastore::Query.new(
          datasource: datasource.name,
          properties: { intervals: [[Time.now - 1.day, Time.now]] },
          aggregators: [clients_agg]
        )
      end

      let(:query_json) { query.as_json }

      it 'is included in the query' do
        expect(query.as_json).to have_key('aggregations')
        expect(query_json['aggregations']).to eq(
          [{
            'type' => 'thetaSketch',
            'name' => 'clients',
            'fieldName' => 'clients'
          }]
        )
      end
    end

    describe 'ThetaSketch Post Aggregation' do
      let(:clients_agg) { create(:clients) }
      let(:clients_a_filter) do
        create(:filter, value: 'a', operator: 'eq', filterable: clients_agg)
      end
      let(:clients_b_filter) do
        create(:filter, value: 'b', operator: 'eq', filterable: clients_agg)
      end
      let(:clients_a) do
        create(:aggregator_widget, widget: widget, aggregator: clients_agg,
                                   aggregator_name: 'clients_a',
                                   filters: [clients_a_filter])
      end
      let(:clients_b) do
        create(:aggregator_widget, widget: widget, aggregator: clients_agg,
                                   aggregator_name: 'clients_b',
                                   filters: [clients_b_filter])
      end
      let(:unique_clients) do
        create(:post_aggregator,
               output_name: 'unique_clients',
               field_1: 'clients_a',
               field_2: 'clients_b',
               operator: 'INTERSECT',
               widget: widget)
      end

      let(:query) do
        Datastore::Query.new(
          datasource: datasource.name,
          properties: { intervals: [[Time.now - 1.day, Time.now]] },
          aggregators: [clients_a, clients_b],
          post_aggregators: [unique_clients]
        )
      end

      let(:query_json) { query.as_json }

      it 'is included in the query' do
        expect(query.as_json).to have_key('aggregations')
        expect(query_json['aggregations']).to eq(
          [
            {
              'type' => 'filtered',
              'filter' => { 'dimension' => 'dimension', 'type' => 'selector', 'value' => 'a' },
              'aggregator' => {
                'type' => 'thetaSketch', 'name' => 'clients_a', 'fieldName' => 'clients'
              }
            },
            {
              'type' => 'filtered',
              'filter' => { 'dimension' => 'dimension', 'type' => 'selector', 'value' => 'b' },
              'aggregator' => {
                'type' => 'thetaSketch', 'name' => 'clients_b', 'fieldName' => 'clients'
              }
            }
          ]
        )

        expect(query.as_json).to have_key('postAggregations')
        expect(query_json['postAggregations']).to eq(
          [{
            'type' => 'thetaSketchEstimate',
            'name' => 'unique_clients',
            'field' => {
              'type' => 'thetaSketchSetOp',
              'name' => 'unique_clients_sketch',
              'func' => 'INTERSECT',
              'fields' => [
                { 'fieldName' => 'clients_a', 'type' => 'fieldAccess' },
                { 'fieldName' => 'clients_b', 'type' => 'fieldAccess' }
              ]
            }
          }]
        )
      end
    end
  end

  context 'Filtered Aggregations' do
    let(:ssl_filter) do
      create(:application_filter, value: 'ssl', filterable: widget)
    end

    describe 'with one filter' do
      let(:aggregator_widget) do
        create(:aggregator_widget, widget: widget, aggregator: long_sum_agg,
               filters: [ssl_filter])
      end
      let(:query) do
        Datastore::Query.new(
          datasource: datasource.name,
          properties: { intervals: [[Time.now - 1.day, Time.now]] },
          aggregators: [aggregator_widget]
        )
      end

      it 'is included in the query' do
        expect(query.as_json).to have_key('aggregations')
        expect(query.as_json['aggregations']).to eq(
          [{
            'type' => 'filtered',
            'filter' => {
              'dimension' => 'application',
              'type' => 'selector',
              'value' => 'ssl'
            },
            'aggregator' => {
              'type' => 'longSum',
              'name' => 'aggregator_name',
              'fieldName' => 'sum_bytes'
            }
          }]
        )
      end
    end

    describe 'with two filters of same dimension' do
      let(:http_filter) do
        create(:application_filter, value: 'http', filterable: widget)
      end
      let(:aggregator_widget) do
        create(:aggregator_widget, widget: widget, aggregator: long_sum_agg,
               filters: [ssl_filter, http_filter])
      end
      let(:query) do
        Datastore::Query.new(
          datasource: datasource.name,
          properties: { intervals: [[Time.now - 1.day, Time.now]] },
          aggregators: [aggregator_widget]
        )
      end

      it 'is included in the query' do
        expect(query.as_json).to have_key('aggregations')
        aggregation = query.as_json['aggregations'][0]
        expect(aggregation['type']).to eq('filtered')
        expect(aggregation['filter']['type']).to eq('and')
        expect(aggregation['filter']['fields']).to(
          include('dimension' => 'application', 'type' => 'selector', 'value' => 'ssl')
        )
        expect(aggregation['filter']['fields']).to(
          include('dimension' => 'application', 'type' => 'selector', 'value' => 'http')
        )
      end
    end
  end
end

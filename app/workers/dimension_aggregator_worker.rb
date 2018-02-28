class DimensionAggregatorWorker
  include Sidekiq::Worker

  def perform(datasource_id)
    @uri = URI.parse(ENV['DRUID_URL'])
    @api_path = '/druid/v2'
    @dimensions = []
    @aggregators = []

    datasource = Datasource.find(datasource_id)

    last_event_time = Time.parse(max_ingested_event_time(datasource.name))
    update_dimensions_aggregators(datasource, last_event_time)
  end

  private

  def max_ingested_event_time(datasource_name)
    request = Net::HTTP::Post.new(@api_path)

    request.body = {
      queryType: 'dataSourceMetadata',
      dataSource: datasource_name
    }.to_json

    request['Content-Type'] = 'application/json'

    response = Net::HTTP.start(@uri.host, @uri.port) do |client|
      client.request(request)
    end

    JSON.parse(response.body)[0]['result']['maxIngestedEventTime']
  end

  def update_dimensions_aggregators(datasource, last_event_time)
    data = segment_metadata_query(datasource.name, last_event_time)

    data['columns'].each do |name, properties|
      Dimension.where(datasource: datasource, name: name).first_or_create do |dimension|
        dimension.dimension_type = properties['type']
      end
    end

    data['aggregators'].each do |name, properties|
      Aggregator.where(datasource: datasource, name: name).first_or_create do |aggregator|
        aggregator.aggregator_type = properties['type']
      end
    end
  end

  def segment_metadata_query(datasource_name, last_event_time)
    request = Net::HTTP::Post.new(@api_path)

    request.body = {
      queryType: 'segmentMetadata',
      dataSource: datasource_name,
      intervals: ["#{(last_event_time - 1.hour).iso8601(3)}/#{last_event_time.iso8601(3)}"],
      merge: true,
      lenientAggregatorMerge: true,
      analysisTypes: %w[aggregators queryGranularity]
    }.to_json

    request['Content-Type'] = 'application/json'

    response = Net::HTTP.start(@uri.host, @uri.port) do |client|
      client.request(request)
    end

    JSON.parse(response.body)[0]
  end
end

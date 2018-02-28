class DatasourceWorker
  include Sidekiq::Worker

  def perform
    datasources_path = '/druid/v2/datasources'
    uri = URI.parse(ENV['DRUID_URL'])

    req = Net::HTTP::Get.new(datasources_path)
    response = Net::HTTP.new(uri.host, uri.port).start do |http|
      http.open_timeout = 10 # if druid is down fail fast
      http.read_timeout = nil # we wait until druid is finished
      http.request(req)
    end

    if response.code != '200'
      raise "Request failed: #{response.code}: #{response.body}"
    end

    JSON.parse(response.body).each do |datasource_name|
      datasource = Datasource.find_or_create_by(name: datasource_name)
      DimensionAggregatorWorker.perform_async(datasource.id)
    end
  end
end

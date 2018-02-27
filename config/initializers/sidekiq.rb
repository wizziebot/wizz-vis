Sidekiq.default_worker_options = { retry: 3 }

Sidekiq.configure_server do |config|
  config.on :startup do
    # Clear any connections that might have been obtained before starting
    # Sidekiq (e.g. in an initializer).
    ActiveRecord::Base.clear_all_connections!
  end
end

schedule_file = 'config/schedule.yml'

if File.exist?(schedule_file) && Sidekiq.server?
  Sidekiq::Cron::Job.load_from_hash YAML.load_file(schedule_file)
end

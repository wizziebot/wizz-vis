Rails.application.routes.draw do
  require 'sidekiq/web'
  mount Sidekiq::Web => '/sidekiq'

  resources :widgets, except: [:index]

  resources :dashboards do
    resources :widgets, only: [:index]
  end

  root to: 'dashboards#index'
end

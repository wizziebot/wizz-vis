Rails.application.routes.draw do
  require 'sidekiq/web'
  require 'sidekiq/cron/web'
  mount Sidekiq::Web => '/sidekiq'

  resources :widgets, except: :index do
    get :data, on: :member
  end

  resources :dashboards do
    resources :widgets, only: :index
    put :layout, to: 'dashboards#update_layout', on: :member
  end

  namespace :api do
    namespace :v1 do
      resources :docs, only: :index

      resources :datasources, only: %i[index show] do
        resources :dimensions, only: :index
        resources :aggregators, only: :index
      end

      resources :dashboards do
        resources :widgets, only: :index
      end

      resources :widgets, only: %i[show create update destroy] do
        get :data, on: :member
      end
    end
  end

  root to: 'dashboards#index'
end

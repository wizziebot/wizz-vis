Rails.application.routes.draw do
  require 'sidekiq/web'
  mount Sidekiq::Web => '/sidekiq'

  resources :widgets, except: [:index] do
    get :data, on: :member
  end

  resources :dashboards do
    resources :widgets, only: :index
    put :layout, to: 'dashboards#update_layout', on: :member
  end

  root to: 'dashboards#index'
end

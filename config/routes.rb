Rails.application.routes.draw do
  resources :widgets, except: [:index]

  resources :dashboards do
    resources :widgets, only: [:index]
  end

  root to: 'dashboards#index'
end

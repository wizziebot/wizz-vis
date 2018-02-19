Rails.application.routes.draw do
  resources :widgets, except: [:index]

  resources :dashboards do
    resources :widgets, only: [:index]
  end

  get 'hello_world', to: 'hello_world#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

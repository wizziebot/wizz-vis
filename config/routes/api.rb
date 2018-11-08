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

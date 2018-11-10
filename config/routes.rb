# frozen_string_literal: true

Rails.application.routes.draw do
  resources :widgets, except: :index do
    get :data, on: :member
  end

  resources :dashboards do
    resources :widgets, only: :index
    put :layout, to: 'dashboards#update_layout', on: :member
  end

  draw :api

  root to: 'dashboards#index'
end

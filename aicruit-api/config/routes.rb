# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Health status endpoint
  get 'up' => 'rails/health#show', as: :rails_health_check

  api_version(
    module: 'Api::V1',
    header: { name: 'Accept', value: 'application/vnd.aicruit.com; version=1' }
  ) do
    resources :users, only: [] do
      collection do
        post :create
        post :sign_in
        post 'users/google_sign_in', to: 'users#google_sign_in'
      end
    end

    resources :job_descriptions, only: [] do
      collection do
        post :create
        get :index
        get :published
      end

      member do
        put :update
        delete :destroy
        get :show
      end
    end

    resources :resumes, only: [] do
      collection do
        get :index
        post :create
      end

      member do
        get :show
        put :update
      end
    end
    resources :interviews, only: %i[create index show update destroy]
  end
end

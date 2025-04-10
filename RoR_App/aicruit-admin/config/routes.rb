Rails.application.routes.draw do
  devise_for :users # , path: 'auth', path_names: { sign_in: 'login', sign_out: 'logout' }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "home#index"
  devise_scope :user do
    root to: "devise/sessions#new"
  end

  get "home/index", to: 'home#index'

  namespace :admin do 
    get "dashboard/index", to: 'dashboard#index'
    # get "user/new", to:'user#new'
    # post "user/create", to:'user#create'
    # get "user/edit", to:'user#edit'
    # patch "user/update", to:'user#update'
    # delete "user/delete", to:'user#destroy'
    # get "user/show/:id", to:'user#show', as: 'user/show'
  end

  resources :users, only: [:new, :create, :show, :edit, :update, :destroy]

  resources :resume_analyses, except: [:edit] do
    member do
      post :approve
    end
  end


end

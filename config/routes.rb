Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  require 'sidekiq/web'
  authenticate :user, lambda { |u| u.admin? } do
    mount Sidekiq::Web => '/sidekiq'
  end
  resources :sources do
    member do
      post 'comment', to: 'sources#comment'
      get 'comments', to: 'sources#comments'
    end
    collection do

    end
  end
  get 'source_posts/:source_id', to: 'posts#index'
  resources :posts
  root to: 'sources#index'
  devise_for :users
  get 'test', to: 'application#test'
  get 'test_edit/:id', to: 'application#test_edit'
  get 'test_json', to: 'application#test_json'
  get 'redux', to: 'application#redux'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

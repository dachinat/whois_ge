Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: "root#index"

  namespace :api, defaults: { format: :json } do
    post "/check_multi", to: "domains#check_multi"
  end
end

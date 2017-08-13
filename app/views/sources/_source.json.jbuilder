json.extract! source, :id, :name, :title_path, :image_path, :content_path, :created_at, :updated_at
json.url source_url(source, format: :json)
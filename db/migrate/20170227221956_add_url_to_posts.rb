class AddUrlToPosts < ActiveRecord::Migration[5.0]
  def change
    add_column :posts, :url, :string
    add_column :posts, :time, :string
  end
end

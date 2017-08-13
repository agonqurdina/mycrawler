class AddPostPathToSources < ActiveRecord::Migration[5.0]
  def change
    add_column :sources, :post_path, :string
  end
end

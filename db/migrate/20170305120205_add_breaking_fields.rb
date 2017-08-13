class AddBreakingFields < ActiveRecord::Migration[5.0]
  def change
    add_column :sources, :breaking_post_path, :string
    add_column :sources, :breaking_title_path, :string
    add_column :sources, :breaking_image_path, :string
    add_column :sources, :breaking_url_path, :string
  end
end

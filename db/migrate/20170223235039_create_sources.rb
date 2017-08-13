class CreateSources < ActiveRecord::Migration[5.0]
  def change
    create_table :sources do |t|
      t.string :name
      t.string :title_path
      t.string :image_path
      t.string :content_path

      t.timestamps
    end
  end
end

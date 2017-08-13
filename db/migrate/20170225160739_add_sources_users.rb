class AddSourcesUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :user_sources do |t|
      t.references :user, index: true, foreign_key: true
      t.references :source, index: true, foreign_key: true

      t.timestamps
    end
  end
end

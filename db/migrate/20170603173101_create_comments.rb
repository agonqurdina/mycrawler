class CreateComments < ActiveRecord::Migration[5.0]
  def change
    create_table :comments do |t|
      t.belongs_to :user, index: true
      t.belongs_to :source, index: true
      t.string :text

      t.timestamps
    end
  end
end

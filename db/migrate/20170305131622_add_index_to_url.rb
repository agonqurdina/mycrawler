class AddIndexToUrl < ActiveRecord::Migration[5.0]
  def change
    add_index :posts, :url
  end
end

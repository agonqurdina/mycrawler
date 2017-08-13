class AddWorkerIdToSources < ActiveRecord::Migration[5.0]
  def change
    add_column :sources, :worker_id, :string
  end
end

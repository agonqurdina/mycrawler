ActiveAdmin.register Source do
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
# permit_params :list, :of, :attributes, :on, :model
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if params[:action] == 'create' && current_user.admin?
#   permitted
# end

  index do
    column :id
    column :name
    column :title_path
    column :content_path
    column :url_path
  end

  filter :posts

  sidebar 'Posts by this source' do
    table_for Post.joins(:source).where(source_id: source.id) do |t|
      t.column('Post Name') { |post| post.title }
    end
  end

  active_admin_importable

end

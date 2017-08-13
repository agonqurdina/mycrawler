class SourcesController < ApplicationController
  before_action :set_source, only: [:show, :edit, :update, :destroy]
  # skip_before_action :verify_authenticity_token

  # GET /sources
  # GET /sources.json
  def index
    @sources = current_user.sources.order('created_at')
  end

  # GET /sources/1
  # GET /sources/1.json
  def show
  end

  # GET /sources/new
  def new
    @source = Source.new
  end

  # GET /sources/1/edit
  def edit
    test = ''
  end

  # POST /sources
  # POST /sources.json
  def create
    @source = Source.new(source_params)

    respond_to do |format|
      # if current_user.sources.create!(@source)
      if current_user.sources.create!(source_params)
        format.html { redirect_to @source, notice: 'Source was successfully created.' }
        format.json { render :show, status: :created, location: @source }
      else
        format.html { render :new }
        format.json { render json: @source.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /sources/1
  # PATCH/PUT /sources/1.json
  def update
    respond_to do |format|
      if @source.update(source_params)
        format.html { redirect_to @source, notice: 'Source was successfully updated.' }
        format.json { render :show, status: :ok, location: @source }
      else
        format.html { render :edit }
        format.json { render json: @source.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /sources/1
  # DELETE /sources/1.json
  def destroy
    @source.destroy
    respond_to do |format|
      format.html { redirect_to sources_url, notice: 'Source was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def comments
    source_id = params[:id]
    source_comments = Source.new(id: source_id).comments
    user_ids = source_comments.map{ |comment| comment.user_id }
    users = User.where('id IN (?)', user_ids).select(:id, :email).map{ |user| [user.id, user.email] }.to_h
    unless users.key? current_user.id
      users[current_user.id] = current_user.email
    end
    render json: { comments: source_comments, users: users }
  end

  def comment
    text = params[:text]
    source_id = params[:id]
    comment = Comment.new(source_id: source_id, text: text, user_id: current_user.id)
    if comment.save!
      render json: { success: true, comment: comment }
    else
      render json: { success: false }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_source
      @source = Source.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def source_params
      params.require(:source).permit(:name, :url, :title_path, :image_path, :content_path, :url_path, :post_path, :breaking_post_path, :breaking_url_path, :breaking_title_path, :breaking_image_path)
    end
end

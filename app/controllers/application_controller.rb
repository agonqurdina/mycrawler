require 'watir'
require 'nokogiri'
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!, except: ['test_edit', 'redux']

  def test
    # Sidekiq.redis {|c| c.del('stat:failed') }
    # Source.find(7).posts.destroy_all
    # Source.find(5).start_crawling
    # CrawlWorker.new.crawl_source(7)
    # Source.all.each do |source|
    #   source.start_crawling
    #   sleep(0.2)
    # end
    # render json: 'test'
    # @sources = current_user.sources.order('created_at')
    render 'sources/test' and return
    render 'sources/index'
  end

  def test_edit
    @source = Source.find(params[:id])
    render 'sources/test_edit'
  end

  def redux
    render 'sources/redux'
  end
end

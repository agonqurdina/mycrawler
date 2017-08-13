require 'open-uri'
class CrawlWorker
  include Sidekiq::Worker
  sidekiq_options :queue => :default, :retry => false, :backtrace => 5

  def perform(source_id, repeat_after = 5)
    crawl_source(source_id)
    logger.info("Source_id: #{source_id} / Worker_id: #{self.jid}")
    CrawlWorker.perform_in(repeat_after.minutes, source_id, repeat_after)
  end

  def crawl_source(source_id)
    source = Source.find(source_id)

    args = %w{--ignore-ssl-errors=true}
    browser = Watir::Browser.new(:phantomjs, :args => args)
    # browser = Watir::Browser.new(:chrome, :args => args)
    sleep(0.2)
    browser.goto source.url
    html = browser.html
    browser.quit
    page = Nokogiri::HTML(html)
    unless source.breaking_post_path.nil? or source.breaking_post_path.empty?
      parse_html(page, source, true)
    end
    parse_html(page, source)
    source.update!({worker_id: self.jid})
  end

  private
  def parse_html(page, source, is_breaking = false)
    if is_breaking
      post_path = source.breaking_post_path
      url_path = source.breaking_url_path
      title_path = source.breaking_title_path
      image_path = source.breaking_image_path
    else
      post_path = source.post_path
      url_path = source.url_path
      title_path = source.title_path
      image_path = source.image_path
    end
    posts = page.css(post_path)
    posts.each do |post|
      begin
        if url_path == '/'
          url = post.attr('href')
        elsif (post.css(url_path)[0].nil? or post.css(url_path)[0].attr('href').nil?) and url_path == title_path
          url = post.css(title_path)[0].inner_html
        else
          url = post.css(url_path)[0].attr('href')
        end
        url = full_url(url, source.url)
        unless source.posts.where({url: url}).present?
          unless post.css(title_path)[0].nil?
            title = post.css(title_path)[0].inner_html
            unless image_path.nil? or image_path.empty?
              image_url = post.css(image_path)[0].attr('src')
              unless image_url.start_with?('http') or image_url.start_with?('https')
                unless post.css(source.image_path)[0].attr('data-src').nil?
                  image_url = post.css(source.image_path)[0].attr('data-src')
                end
              end
            end
            # sleep(0.1)
            # browser.goto url
            # content_html = browser.html
            if valid_url?(url)
              # Correct URL
              content_page = Nokogiri::HTML(open(url))
            else
              content_page = post
            end
            paragraphs = content_page.css(source.content_path)
            text = ''
            paragraphs.each do |p|
              text += (p.inner_html + '<br/>')
            end
            source.posts.create!({title: title, image_url: image_url, url: url, content: text})
          end
        end
      rescue => err
        logger.info("ERROR: #{err.inspect}")
      end
    end
  end

  def full_url(rel, url)
    return rel if rel.nil? or rel.match /^[\w]*:\/\//
    uri = URI(url)
    if rel[0] == '/'
      "#{uri.scheme}://#{uri.host}#{rel}"
    else
      path = uri.path.split('/')[0..-2].select{|m| !m.empty?}.join('/')
      "#{uri.scheme}://#{uri.host}/#{path}/#{rel}"
    end
  end

  def valid_url?(uri)
    uri = URI.parse(uri)
    puts "URI: #{uri}"
    uri && !uri.host.nil?
  rescue URI::InvalidURIError
    false
  end
end

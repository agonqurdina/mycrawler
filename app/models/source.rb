class Source < ApplicationRecord
  has_many :posts
  has_many :user_sources
  has_many :users, through: :user_sources
  has_many :comments

  after_create do
    start_crawling
  end

  def start_crawling
    unless self.worker_id.nil?
      queue = Sidekiq::Queue.new('default')
      queue.each do |job|
        #job.klass # => 'MyWorker'
        #job.args # => [1, 2, 3]
        job.delete if job.jid == self.worker_id
      end
      self.update!(worker_id: nil)
    end
    #Sidekiq::Stats.new.reset
    repeat_after = 1
    CrawlWorker.perform_in(repeat_after, self.id, repeat_after)
  end
end

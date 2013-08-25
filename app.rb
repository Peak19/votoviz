require "sinatra"
require "haml"
require "rsolr"
require "yaml"
require 'json'
require 'pg'
require 'erb'

conf = YAML.load_file('./conf.yml')
db_conf = YAML.load(ERB.new(File.read('./config/database.yml')).result)
solr = RSolr.connect :url => conf['solr_hostname']
pg = PG::Connection.new :host => db_conf['production']['host'], :user => db_conf['production']['username'], :password => db_conf['production']['password'], :dbname => db_conf['production']['database'] 

get "/survey", :provides => 'json' do
    query = params[:text]
    if not params.has_key?(:text)
       puts "undef"
       query='*:*'
    end
    results = solr.get 'solr/select', :params => {:q => query}
    return results['response'].to_json
end

get '/survey/:id' do |id|
    survey={:questions => []}
    pg.exec_params("SELECT surveys.title AS survey_title, organisations.org_name, organisations.location as org_loc, questions.id as question_id, questions.title AS question_text, questions.question_num, responses.choice_id, choices.text AS choice_name, COUNT(*) as response_count FROM surveys JOIN organisations ON (organisations.id = surveys.org_id) JOIN questions ON (questions.survey_id = surveys.id) JOIN responses ON (responses.question_id = questions.id) JOIN choices ON (choices.question_id = questions.id AND choices.id = responses.choice_id) WHERE surveys.id=$1 GROUP BY surveys.title, organisations.org_name, organisations.location, questions.id, questions.title, questions.question_num, responses.choice_id, choices.text", [id]) do |result|
      result.each do |row|
        survey[:title] ||= row['survey_title']
        survey[:org] ||= row['org_name']
        survey[:country] ||= row['org_loc']
        survey[:questions][Integer(row['question_num'])] ||= {:question_num => row['question_num'], :question_text => row['question_text'].sub(/^(Yes|No|All)?Q([0-9]+)-/, ''), :responses => []}
        /^(Yes|No)?Q([0-9]+)/.match(row['question_text']) do |match|
            survey[:questions][Integer(row['question_num'])]['question_depends'] = { :question_id => match[2], :question_response => (match[1] == 'Yes' ? 1:2) } 
        end
        survey[:questions][Integer(row['question_num'])][:responses] << {:id => row['choice_id'], :text => row['choice_name'], :count => row['response_count']}
      end
    end
    return survey.to_json
end

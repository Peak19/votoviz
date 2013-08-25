var global_survey={};
var bound=false;
var survey_id = window.location.search.split('=',1);
var host='http://cdn-dev-hack.herokuapp.com/survey'

var bar_width = 100;
var chart_height = 600;
var padding = 20;
var hue = 231;

function requestSurvey(segments){
    var queryString = host;
    if (segments && segments.length > 0){
        queryString += '?segments='+json.stringify(segments);
    }
    d3.json(queryString, processData);
}

function processData(survey){
    for (var q in survey.questions){
        var sum =0;
        for (var r in survey.questions[q].responses){
            console.log(r);
            survey.questions[q].responses[r].total = sum;
            sum += parseInt(survey.questions[q].responses[r].count);
            survey.questions[q].responses[r].colour = 50+(30*r/survey.questions[q].responses.length);
        }
    }
    global_survey = survey;
    if (!bound){
        d3.select('#survey_title').text(survey.title);
        d3.select('#survey_org').text(survey.org+' - '+survey.country);
        d3.select('#survey_plot').attr('width', bar_width*survey.questions.length).attr('height', chart_height).selectAll('g').data(survey.questions)
                            .enter().append('g').selectAll().data(function(d){return d.responses;})
                            .enter().append('rect').attr('y', function(d){return chart_height-d.total-parseInt(d.count);}).attr('height', function(d){return d.count;}).attr('width', bar_width)
                            .attr('x', function(d){return (bar_width+padding)*(parseInt(d3.select(this.parentNode).data()[0].question_num)-0.5);})
                            .attr('style', function(d){return 'fill:hsla('+hue+',30%,'+d.colour+'%,1)'});
        bound =true;
    }
}

document.addEventListener('DOMContentLoaded', function(){
    requestSurvey();
});

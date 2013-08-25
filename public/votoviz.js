var survey={"questions":[{"question_num":"1","question_text":"Where do you live? Press one for city or urban area. Press two for village or rural area.","responses":[{"id":"515","count":"342"},{"id":"516","count":"196"}]},{"question_num":"2","question_text":"Have you had to give a bribe or unauthorized payment in the past year? Press one for yes. Press two for no","responses":[{"id":"513","count":"157"},{"id":"514","count":"274"}]},{"question_num":"3","question_text":"Have you ever had to pay a bribe or unauthorized payment to receive a government service? Press one for no. Press two if you gave one to the security services. Press three if you gave it to the DVLA. Press four if you gave it to health services. Press five if you gave it to education institutions. Press six if you gave it to politicians. Press seven if you gave a bribe but not to one of these government institutions.","responses":[{"id":"518","count":"58"},{"id":"520","count":"7"},{"id":"519","count":"17"},{"id":"522","count":"4"},{"id":"523","count":"52"},{"id":"517","count":"185"},{"id":"521","count":"17"}]},{"question_num":"4","question_text":"Have police ever stopped you for a non-offense and asked for money? Press one for yes. Press two for no.","responses":[{"id":"524","count":"113"},{"id":"525","count":"196"}]},{"question_num":"5","question_text":"What do you think should be done about corruption in Ghana? Press one for increase punishments for corruption. Press two if you think nothing can be done. Press three for more public education on corruption. Press four if you think bribe requests should be reported. Press five if you don’t know.","responses":[{"id":"530","count":"28"},{"id":"528","count":"59"},{"id":"529","count":"29"},{"id":"527","count":"41"},{"id":"526","count":"129"}]}],"title":"Globe/Citi/Voto Corruption poll","org":"Journalists for Human Rights","country":"Accra, Ghana"};

var bar_width = 200;

function processData(survey){
    for (var q in survey.questions){
        var sum = 0;
        for (var r in survey.questions[q].responses[r]){
            survey.questions[q].responses[r].total = sum;
            sum += survey.questions[q].responses[r].count;
        }
    }
}

document.addEventListener('DOMContentLoaded', function(){
    d3.select('#survey_title').text(survey.title);
    d3.select('#survey_org').text(survey.org+' - '+survey.country);
    d3.select('#survey_plot').attr('width', bar_width*survey.questions.length).attr('height', 500).selectAll('g').data(survey.questions).attr('width', bar_width).attr('x', function(d){return bar_width*(d.question_num-0.5)}).enter().append('g').selectAll().data(function(d){return d.responses;}).enter().append('rect').attr('y', function(d){return d.sum;}).attr('height', function(d){return d.count;});
});

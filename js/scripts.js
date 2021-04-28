google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

var arr = [['t', 'u1']];

for (i = 0; i < 20; i++) {
    arr.push([i, Math.random() * 100]);
}


function drawChart() {
    var data = google.visualization.arrayToDataTable(arr);

    var options = {
        title: 'Regler',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}
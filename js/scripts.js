google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

var arr = [['t', 'u1']];

// regulating distance
var T2 = 1550; // s
var Uc = 0; // V
var Ue = 1;
var dt = 1;

var Tmax = T2 * 5; // 5 * τ

for (i = 0; i < Tmax; i++) {
    Uc = Uc + dt / T2 * (Ue - Uc);
    arr.push([i, Uc]);
}

function drawChart() {
    var data = google.visualization.arrayToDataTable(arr);

    var options = {
        title: 'LP. 1st order',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}
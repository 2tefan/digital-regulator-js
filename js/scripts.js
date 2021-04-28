google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

var arr = [];

// regulating distance
var T2 = 1550; // s
var Uc = 0; // V
var Ue = 1;
var dt = 1;

var Tmax = T2 * 5; // 5 * τ

for (i = 0; i < Tmax; i++) {
    Uc = Uc + dt / T2 * (Ue - Uc);
    arr.push([i, Uc, i == T2 ? Uc : null, null]);
}

arr[T2][3] = "τ [" + T2 + "/" + formatFloat(arr[T2][1]) + "]";


function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 't');
    data.addColumn('number', 'Uout');
    data.addColumn('number', 'markedPoints');
    data.addColumn({ type: 'string', role: 'annotation' });

    data.addRows(arr)

    var options = {
        title: 'Low-pass filter 1st order',
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: { title: 'Time [ms]', gridlines: { interval: 1, count: 8 }, minorGridlines: { interval: 0.5 }, },
        vAxis: { title: 'Voltage [V]', gridlines: { interval: 1 / 8, count: 8 }, },
        series: {
            1: {
                annotations: {
                    textStyle: { fontSize: 15, color: 'red' },
                },
                pointSize: 5,
                visibleInLegend: false
            },
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}

function formatFloat(f1) {
    return Math.round(f1 * 100) / 100;
}
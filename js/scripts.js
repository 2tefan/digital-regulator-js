google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawLowPass);
google.charts.setOnLoadCallback(drawLowPassSin);

number = 11
T1 = 100 + 5 * number // s
T2 = T1 * 10

Vs = 0.8 + number / 100
targetValue = 10 + number

function lowPassSin(){
    var lowPass = [];
    var u = 0; // V

    var Tmax = T2 * 15; // 5 * τ

    for (i = 0; i < Tmax; i++) {
        u = 10 * Math.sin(2*3.14*102.68e-6*i);
        lowPass.push([i, u, null, null]);
    }

    return lowPass
}

function lowPass() {
    var lowPass = [];

    // regulating distance
    var Uc = 0; // V
    var Ue = 1;
    var dt = 1;

    var Tmax = T2 * 5; // 5 * τ

    for (i = 0; i < Tmax; i++) {
        Uc = Uc + dt / T2 * (Ue - Uc);
        lowPass.push([i, Uc, i == T2 ? Uc : null, null]);
    }

    drawPoint("τ", lowPass, T2)
    return lowPass
}


function drawLowPass() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 't');
    data.addColumn('number', 'u');
    data.addColumn('number', 'markedPoints');
    data.addColumn({ type: 'string', role: 'annotation' });

    data.addRows(lowPass())

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

    var chart = new google.visualization.LineChart(document.getElementById('low_pass'));

    chart.draw(data, options);
}


function drawLowPassSin() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 't');
    data.addColumn('number', 'Uout');
    data.addColumn('number', 'markedPoints');
    data.addColumn({ type: 'string', role: 'annotation' });

    data.addRows(lowPassSin())

    var options = {
        title: 'Low-pass filter 1st order',
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: { title: 'Time [ms]', gridlines: { interval: [1,2,5], count: 8 }, minorGridlines: { interval: 0.5 }, },
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

    var chart = new google.visualization.LineChart(document.getElementById('low_pass_sin'));

    chart.draw(data, options);
}

function drawPoint(name, arr, T) {
    arr[T][3] = name + " [" + T + "/" + formatFloat(arr[T][1]) + "]";
}

function formatFloat(f1) {
    return Math.round(f1 * 100) / 100;
}
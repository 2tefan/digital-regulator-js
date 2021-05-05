google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawLowPass);
google.charts.setOnLoadCallback(drawLowPassSin);
google.charts.setOnLoadCallback(drawRegulatingDistance);

number = 11
T1 = 100 + 5 * number // s
T2 = T1 * 10

Vs = 0.8 + number / 100
targetValue = 10 + number

function regulatingDistance() {
    var arr = [];
    var Ue = 1;
    var Uc1 = 0;
    var Uc2 = 0;
    var dt = 1;

    var Tmax = T2 * 5;

    for (i = 0; i < Tmax; i++) {
        Uc1 = Uc1 + dt / T1 * (Ue - Uc1);
        Uc2 = Uc2 + dt / T2 * (Uc1 - Uc2);
        Ua = Uc2 * Vs

        arr.push([i, Ua]);
    }

    return arr
}

function lowPassSin() {
    var lowPass = [];
    var Usin = 0;
    var Uc = 0;
    var dt = 1;

    var Tmax = T2 * 25; // 5 * τ

    for (i = 0; i < Tmax; i++) {
        Usin = 10 * Math.sin(1 / T2 * i);
        Uc = Uc + dt / T2 * (Usin - Uc);
        lowPass.push([i, Uc, Usin]);
    }

    return lowPass
}

function lowPass() {
    var lowPass = [];

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
    data.addColumn('number', 'Uout');
    data.addColumn('number', 'markedPoints');
    data.addColumn({ type: 'string', role: 'annotation' });

    data.addRows(lowPass())


    var options = getDefaultOptions('Low-pass filter 1st order');
    options.series = {
        1: {
            annotations: {
                textStyle: { fontSize: 15, color: 'red' },
            },
            pointSize: 5,
            visibleInLegend: false
        },
    }

    var chart = new google.visualization.LineChart(document.getElementById('low_pass'));

    chart.draw(data, options);
}


function drawLowPassSin() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 't');
    data.addColumn('number', 'Uout');
    data.addColumn('number', 'Usin');

    data.addRows(lowPassSin())

    var options = getDefaultOptions('Low-pass filter 1st order with sin');
    options.series = {
        1: {
            type: 'line', lineDashStyle: [2, 2]
        },
    }

    var chart = new google.visualization.LineChart(document.getElementById('low_pass_sin'));

    chart.draw(data, options);
}


function drawRegulatingDistance() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 't');
    data.addColumn('number', 'Uout');

    data.addRows(regulatingDistance())

    var options = getDefaultOptions('Regulating distance')

    var chart = new google.visualization.LineChart(document.getElementById('regulating_distance'));

    chart.draw(data, options);
}

function getDefaultOptions(title) {
    return {
        title: title,
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: { title: 'Time [ms]', gridlines: { interval: [1, 2, 5], count: 8 }, minorGridlines: { interval: 0.5 }, },
        vAxis: { title: 'Voltage [V]', gridlines: { interval: [1, 2, 5], count: 8 }, },
    }
}

function drawPoint(name, arr, T) {
    arr[T][3] = name + " [" + T + "/" + formatFloat(arr[T][1]) + "]";
}

function formatFloat(f1) {
    return Math.round(f1 * 100) / 100;
}
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawLowPass);
google.charts.setOnLoadCallback(drawLowPassSin);
google.charts.setOnLoadCallback(drawRegulatingDistance);
google.charts.setOnLoadCallback(drawTwoPointRegulator);
google.charts.setOnLoadCallback(drawTwoPointRegulatorWithoutUr);

number = 11;
T1 = 100 + 5 * number; // s
T2 = T1 * 10;

Vs = 0.8 + number / 100;
targetValue = 10 + number;



function lowPass() {
    let lowPass = [];

    let Uc = 0; // V
    let Ue = 1;
    let dt = 1;

    let Tmax = T2 * 5; // 5 * τ

    for (i = 0; i < Tmax; i++) {
        Uc = Uc + dt / T2 * (Ue - Uc);
        lowPass.push([i, Uc, i == T2 ? Uc : null, null]);
    }

    drawPoint("τ", lowPass, T2);
    return lowPass;
}

function lowPassSin() {
    let lowPass = [];
    let Usin = 0;
    let Uc = 0;
    let dt = 1;

    let Tmax = T2 * 25; // 5 * τ

    for (i = 0; i < Tmax; i++) {
        Usin = 10 * Math.sin(1 / T2 * i);
        Uc = Uc + dt / T2 * (Usin - Uc);
        lowPass.push([i, Uc, Usin]);
    }

    return lowPass
}

function regulatingDistance() {
    let arr = [];
    let Ue = 1;
    let Uc1 = 0;
    let Uc2 = 0;
    let dt = 1;

    let Tmax = T2 * 5;

    let Ua_n1 = 0
    let Ua_n2 = 0
    let posTurningPoint = -1
    let tpRise = -1
    let tpValue = -1
    let UaMax = -Infinity

    for (i = 0; i < Tmax; i++) {
        Uc1 = Uc1 + dt / T1 * (Ue - Uc1);
        Uc2 = Uc2 + dt / T2 * (Uc1 - Uc2);
        Ua = Uc2 * Vs

        let Ua_1 = Ua - Ua_n1
        let Ua_2 = Ua_1 - Ua_n2

        if (Ua_n2 >= 0 && Ua_2 <= 0 && posTurningPoint == -1) {
            posTurningPoint = i
            tpRise = Ua_1
            tpValue = Ua
        }

        Ua_n1 = Ua
        Ua_n2 = Ua_1

        UaMax = Math.max(UaMax, Ua)

        arr.push([i, Ua]);
    }

    let offset = tpValue - tpRise * posTurningPoint

    var Tu_x = -1
    var Tu_y = -1
    var Ta_x = -1
    var Ta_y = -1

    for (i = 0; i < Tmax; i++) {
        let graph = i * tpRise + offset
        arr[i][2] = UaMax;
        arr[i][3] = (0 <= graph && graph <= UaMax) ? graph : null;
        arr[i][4] = null;
        arr[i][5] = null;
        arr[i][6] = null;
        arr[i][7] = null;

        if (Tu_x == -1 && graph >= 0) {
            Tu_x = i
            Tu_y = graph
        }

        if (Ta_x == -1 && graph >= UaMax) {
            Ta_x = i
            Ta_y = graph
        }
    }

    arr[Tu_x][4] = Tu_y
    arr[Tu_x][5] = "Tu = " + Tu_x
    arr[Ta_x][6] = Ta_y
    arr[Ta_x][7] = "Ta = " + Ta_x

    return arr
}

function twoPointRegulator() {
    let arr = [];
    let Ur = 0;
    let Uc1 = 0;
    let Uc2 = 0;
    let dt = 1;
    let Tmax = T2 * 5;


    let hysteresis = targetValue / 10;
    let upperValue = targetValue + hysteresis;
    let lowerValue = targetValue - hysteresis;

    let Urmax = 2 * targetValue / Vs;
    let Urmin = 0;


    for (i = 0; i < Tmax; i++) {
        if (Ua > upperValue)
            Ur = Urmin;

        if (Ua < lowerValue)
            Ur = Urmax;

        Uc1 = Uc1 + dt / T1 * (Ur - Uc1);
        Uc2 = Uc2 + dt / T2 * (Uc1 - Uc2);
        Ua = Uc2 * Vs

        arr.push([i, Ua, Ur]);
    }

    return arr;
}

function twoPointRegulatorWithoutUr() {
    let arr = [];
    let Ur = 0;
    let Uc1 = 0;
    let Uc2 = 0;
    let dt = 1;
    let Tmax = T2 * 2;
    let Ua = 0;


    let hysteresis = targetValue / 10;
    let upperValue = targetValue + hysteresis;
    let lowerValue = targetValue - hysteresis;

    let Urmax = 2 * targetValue / Vs;
    let Urmin = 0;

    let targetValuePassed = false
    let Ua_n1 = Ua

    let maxValuePassed = false
    let minValuePassed = false


    for (i = 0; i < Tmax; i++) {
        if (Ua > upperValue)
            Ur = Urmin;

        if (Ua < lowerValue)
            Ur = Urmax;

        Uc1 = Uc1 + dt / T1 * (Ur - Uc1);
        Uc2 = Uc2 + dt / T2 * (Uc1 - Uc2);
        Ua = Uc2 * Vs

        arr.push([i, Ua, null, null, null, null, null, null, targetValue]);

        if (!targetValuePassed && Ua >= targetValue) {
            targetValuePassed = true;
            arr[i - 1][2] = Ua;
            drawPoint("trise", arr, i - 1, 3)
        }

        if (!maxValuePassed && Ua_n1 > Ua) {
            maxValuePassed = true;
            arr[i - 1][4] = Ua;
            drawPoint("Umax", arr, i - 1, 5)
        }

        if (maxValuePassed && !minValuePassed && Ua_n1 < Ua) {
            minValuePassed = true;
            arr[i - 1][6] = Ua;
            drawPoint("Umin", arr, i - 1, 7)
        }


        Ua_n1 = Ua
    }

    return arr;
}


function drawLowPass() {
    let data = new google.visualization.DataTable();
    data.addColumn('number', 't');
    data.addColumn('number', 'Uout');
    data.addColumn('number', 'markedPoints');
    data.addColumn({ type: 'string', role: 'annotation' });

    data.addRows(lowPass())


    let options = getDefaultOptions('Low-pass filter 1st order');
    options.series = {
        1: {
            annotations: {
                textStyle: { fontSize: 15, color: 'red' },
            },
            pointSize: 5,
            visibleInLegend: false
        },
    }

    let chart = new google.visualization.LineChart(document.getElementById('low_pass'));

    chart.draw(data, options);
}

function drawLowPassSin() {
    let data = new google.visualization.DataTable();
    data.addColumn('number', 't');
    data.addColumn('number', 'Uout');
    data.addColumn('number', 'Usin');

    data.addRows(lowPassSin());

    let options = getDefaultOptions('Low-pass filter 1st order with sin');
    options.series = {
        1: {
            type: 'line', lineDashStyle: [2, 2]
        },
    }

    let chart = new google.visualization.LineChart(document.getElementById('low_pass_sin'));

    chart.draw(data, options);
}

function drawRegulatingDistance() {
    let data = new google.visualization.DataTable();
    data.addColumn('number', 't');
    data.addColumn('number', 'Uout');
    data.addColumn('number', 'Umax');
    data.addColumn('number', 'Turning tangent');
    data.addColumn('number', 'Tu');
    data.addColumn({ type: 'string', role: 'annotation' });
    data.addColumn('number', 'Ta');
    data.addColumn({ type: 'string', role: 'annotation' });

    data.addRows(regulatingDistance());

    let options = getDefaultOptions('Regulating distance');
    options.series = {
        2: { color: '#f1ca3a' },
        3: {
            color: '#f1ca3a',
            annotations: {
                textStyle: { fontSize: 15, color: '#f1ca3a', },
            },
            pointSize: 5,
            visibleInLegend: false
        },
        4: {
            color: '#f1ca3a',
            annotations: {
                textStyle: { fontSize: 15, color: '#f1ca3a', },
            },

            pointSize: 5,
            visibleInLegend: false
        },
    }

    let chart = new google.visualization.LineChart(document.getElementById('regulating_distance'));

    chart.draw(data, options);
}

function drawTwoPointRegulator() {
    let data = new google.visualization.DataTable();
    data.addColumn('number', 't');
    data.addColumn('number', 'Uout');
    data.addColumn('number', 'Ur');

    data.addRows(twoPointRegulator());

    let options = getDefaultOptions('2-Point-Regulator');

    let chart = new google.visualization.LineChart(document.getElementById('two_point_regulator'));

    chart.draw(data, options);
}

function drawTwoPointRegulatorWithoutUr() {
    let data = new google.visualization.DataTable();
    data.addColumn('number', 't');
    data.addColumn('number', 'Uout');
    data.addColumn('number', 'Rise time');
    data.addColumn({ type: 'string', role: 'annotation' });
    data.addColumn('number', 'Max');
    data.addColumn({ type: 'string', role: 'annotation' });
    data.addColumn('number', 'Min');
    data.addColumn({ type: 'string', role: 'annotation' });
    data.addColumn('number', 'Target value');

    data.addRows(twoPointRegulatorWithoutUr());

    let options = getDefaultOptions('2-Point-Regulator');
    options.series = {
        1: {
            pointSize: 5,
            visibleInLegend: false
        },
        2: {
            pointSize: 5,
            visibleInLegend: false
        },
        3: {
            pointSize: 5,
            visibleInLegend: false
        },
    }

    options.annotations = {
        fontSize: 15
    }

    let chart = new google.visualization.LineChart(document.getElementById('two_point_regulator_without_ur'));

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

function drawPoint(name, arr, time, pos = 3) {
    arr[time][pos] = name + " [" + time + "/" + formatFloat(arr[time][1]) + "]";
}

function formatFloat(f1) {
    return Math.round(f1 * 100) / 100;
}
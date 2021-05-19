google.charts.setOnLoadCallback(drawPRegulator);

function pRegulator() {
    let arr = [];
    let Ur = 0;
    let Uc1 = 0;
    let Uc2 = 0;
    let dt = 1;
    let Tmax = T2 * 3;
    let Ua = 0;

    let Kp = T2 / T1 * Math.sqrt(2) / (2 * Vs);

    let targetValuePassed = false
    let Ua_n1 = Ua

    let maxValuePassed = false
    let minValuePassed = false
    let e;


    for (i = 0; i < Tmax; i++) {
        e = targetValue - Ua;
        Ur = Kp * e;

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

function drawPRegulator() {
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

    data.addRows(pRegulator());

    let options = getDefaultOptions('P-Regulator');
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

    let chart = new google.visualization.LineChart(document.getElementById('p_regulator'));

    chart.draw(data, options);
}

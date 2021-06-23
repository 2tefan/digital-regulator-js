google.charts.setOnLoadCallback(drawCount);
google.charts.setOnLoadCallback(drawPWM);
google.charts.setOnLoadCallback(drawCountSin);

function countOutput() {
  let arr = [];
  let dt = 1;
  let Uout = 0;

  let Tpwm = 100 + 10 * number;
  let Tmax = Tpwm * 20;
  let targetNumber = 50 + 10 * number;

  for (i = 0; i < Tmax; i += dt) {
    Uout++;

    if (i % Tpwm == 0) Uout = 0;

    arr.push([i, Uout, targetNumber]);
  }

  return arr;
}

function pwmOutput() {
  let arr = [];
  let dt = 1;
  let Ucount = 0;
  let Uout = 0;

  let Tpwm = 100 + 10 * number;
  let Tmax = Tpwm * 20;
  let targetNumber = 50 + 10 * number;

  for (i = 0; i < Tmax; i += dt) {
    Ucount = i % Tpwm;

    if (Ucount <= targetNumber) Uout = Tpwm;
    else Uout = 0;

    arr.push([i, Uout]);
  }

  return arr;
}

function countOutputSin() {
  let arr = [];
  let dt = 1;
  let Ucount = 0;

  let Tpwm = 100 + 10 * number;
  let Tmax = Tpwm * 20;

  let amplitude = Tpwm / 2;
  let Tsin = 20 * Tpwm;

  for (i = 0; i < Tmax; i += dt) {
    Ucount++;

    if (i % Tpwm == 0) Ucount = 0;

    arr.push([
      i,
      Ucount,
      amplitude * Math.sin((1 / Tsin) * 2 * Math.PI * i) + amplitude,
    ]);
  }

  return arr;
}

function drawCount() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Z");
  data.addColumn("number", "Zin");

  data.addRows(countOutput());

  let options = getDefaultOptionsDAC("Counter");

  let chart = new google.visualization.LineChart(
    document.getElementById("count_out")
  );

  chart.draw(data, options);
}

function drawPWM() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Zpwm");

  data.addRows(pwmOutput());

  let options = getDefaultOptionsDAC("PWM");

  let chart = new google.visualization.LineChart(
    document.getElementById("pwm_out")
  );

  chart.draw(data, options);
}

function drawCountSin() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Z");
  data.addColumn("number", "Zin");

  data.addRows(countOutputSin());

  let options = getDefaultOptionsDAC("Counter");

  let chart = new google.visualization.LineChart(
    document.getElementById("count_out_sin")
  );

  chart.draw(data, options);
}

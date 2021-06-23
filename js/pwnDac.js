google.charts.setOnLoadCallback(drawCount);
google.charts.setOnLoadCallback(drawPWM);

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

  console.log(Tpwm);

  for (i = 0; i < Tmax; i += dt) {
    Ucount = i % Tpwm;

    if (Ucount <= targetNumber) Uout = Tpwm;
    else Uout = 0;
    

    arr.push([i, Uout]);
  }

  return arr;
}

function drawCount() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Uout");
  data.addColumn("number", "Value");

  data.addRows(countOutput());

  let options = getDefaultOptionsDAC("Counter Output");

  options.vAxis.title = "Value";

  let chart = new google.visualization.LineChart(
    document.getElementById("count_out")
  );

  chart.draw(data, options);
}

function drawPWM() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Upwm");

  data.addRows(pwmOutput());

  let options = getDefaultOptionsDAC("PWM");

  let chart = new google.visualization.LineChart(
    document.getElementById("pwm_out")
  );

  chart.draw(data, options);
}

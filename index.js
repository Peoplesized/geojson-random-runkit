var express = require("@runkit/runkit/express-endpoint/1.0.0");
var app = express(exports);

const random = require('geojson-random');
const turf = require('@turf/meta');
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const help = "GET something like `/polygon/10.json` or `/point/5.json`. Uses a bbox around Chad";

app.get("/point/:count.json", (req, res) => res.send(make('point', req.params.count)));
app.get("/polygon/:count.json", (req, res) => res.send(make('polygon', req.params.count)));
app.get("/", (req, res) => res.send(help));

function make(type, count) {
    const bbox = [15.37,12.23,21.52,16.08];
    let geodata;
    if (type === 'point') {
        geodata = random.point(count, bbox);
    } else if (type === 'polygon') {
        geodata = random.polygon(count, 4, 0.001, bbox);
    } else {
        return help;
    }

    turf.propEach(geodata, (p) => {
      const n_trials = getRandomInt(500);
      p.n_trials = n_trials;
      p.n_postive = getRandomInt(n_trials);
      p.exceedance_uncertainty = Math.random();
    })

    return JSON.stringify(geodata);
}

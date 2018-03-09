const { initWorkstations } = require('./initWorkstations');

let valor = 0;

initWorkstations().then(stations => {
    console.log(stations);
    valor = 5;
})
.catch(err => {
    console.log(err);
});

setTimeout(() => {
    console.log(valor);
}, 1000)

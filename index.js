alert("Bienvenido al simulador de Plazo Fijo VS Dolar!");

alert(
  "Para calcular el resultado final de su inversion en PF, ingrese el valor que desea invertir, la tasa anual en decimales y el plazo en dias"
);

class PlazoFijo {
  constructor(valorInvertido, tasaAnual, plazo) {
    this.plazo = plazo;
    this.tasaAnual = tasaAnual;
    this.valorInvertido = valorInvertido;
  }

  calculoPlazoFijo() {
    let interesGanado =
      (this.valorInvertido * this.tasaAnual * this.plazo) / 365;
    return this.valorInvertido + interesGanado;
  }
}

let valorInvertido = Number(prompt("Ingrese el monto a invertir"));
let tasaAnual = Number(prompt("Ingrese la tasa anual (ej: 0.6)"));
let plazo = Number(prompt("Ingrese el plazo de su inversión (en días)"));
let inversionesSimuladas = [];
let inversionesSimuladasConPlazoMayorA30;

function simularPlazoFijo() {
  while (tasaAnual <= 0 || tasaAnual > 0.99) {
    tasaAnual = Number(
      prompt(
        "Valor de tasa incorrecto. Por favor, ingrese un valor entre 0.01 y 0.99"
      )
    );
  }
  let nuevaInversion = new PlazoFijo(valorInvertido, tasaAnual, plazo);
  inversionesSimuladas.push(nuevaInversion);
  return nuevaInversion.calculoPlazoFijo();
}

console.log(simularPlazoFijo());
console.log(inversionesSimuladas);

inversionesSimuladasConPlazoMayorA30 = inversionesSimuladas.filter(
  (el) => el.plazo > 30
);
console.log(inversionesSimuladasConPlazoMayorA30);

let valorDolarHoy = Number(prompt("Ingrese el valor del dolar actualmente"));
let valorDolarFuturoEstimado = Number(
  prompt(
    "Ingrese el valor que estima que se encuentre el dolar al final del plazo"
  )
);
let dolaresComprados = valorInvertido / valorDolarHoy;
let valorInversionFinalDolares = dolaresComprados * valorDolarFuturoEstimado;

console.log(dolaresComprados);

if (valorInversionFinalDolares > simularPlazoFijo()) {
  alert(
    "En este caso, teniendo en cuenta los valores recibidos, es mejor comprar dolares."
  );
} else {
  alert(
    "En este caso, teniendo en cuenta los valores recibidos, es mejor invertir en plazo fijo"
  );
}

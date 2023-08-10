class PlazoFijo {
  constructor(valorInvertido, tasaAnual, plazo) {
    this.valorInvertido = valorInvertido;
    this.tasaAnual = tasaAnual;
    this.plazo = plazo;
  }

  calculoPlazoFijo() {
    const interesGanado =
      (this.valorInvertido * this.tasaAnual * this.plazo) / 365;
    return this.valorInvertido + interesGanado;
  }
}

const valorInvertidoInput = document.getElementById("valor");
const tasaAnualInput = document.getElementById("tasa");
const plazoInput = document.getElementById("plazo");
const botonSimular = document.getElementById("simular-pf");
const valorDolarHoyInput = document.getElementById("dolar-hoy");
const valorDolarFuturoEstimadoInput = document.getElementById("dolar-futuro");
const resultado = document.getElementById("resultado");
const error = document.getElementById("error");
const simulacionesRecientes = document.getElementById("sim-recientes");

let inversionesSimuladas =
  JSON.parse(localStorage.getItem("inversiones")) || [];

let nuevaInversion;
let dolaresComprados;
let inversionesSimuladasConPlazoMayorA30;

const guardarInversionesEnLocalStorage = () => {
  localStorage.setItem("inversiones", JSON.stringify(inversionesSimuladas));
};

const simularPlazoFijo = () => {
  const valorInvertido = parseFloat(valorInvertidoInput.value);
  const tasaAnual = parseFloat(tasaAnualInput.value);
  const plazo = parseFloat(plazoInput.value);

  if (tasaAnual <= 0 || tasaAnual > 0.99 || isNaN(tasaAnual)) {
    error.innerHTML =
      "Valor de tasa incorrecto. Por favor, ingrese un valor entre 0.01 y 0.99";
    return;
  }
  if (isNaN(valorInvertido) || valorInvertido <= 0) {
    error.innerHTML = "Valor de inversión incorrecto.";
    return;
  }
  if (isNaN(plazo) || plazo <= 0) {
    error.innerHTML = "Valor de plazo incorrecto.";
    return;
  }

  nuevaInversion = new PlazoFijo(valorInvertido, tasaAnual, plazo);
  inversionesSimuladas.push(nuevaInversion);

  // Limpia el mensaje de error
  error.innerHTML = "";

  dolaresComprados = valorInvertido / valorDolarHoyInput.value;
  const valorInversionFinalDolares =
    dolaresComprados * valorDolarFuturoEstimadoInput.value;

  let mensaje = "";

  if (valorInversionFinalDolares > nuevaInversion.calculoPlazoFijo()) {
    mensaje =
      "En este caso, teniendo en cuenta los valores recibidos, es mejor comprar dólares.";
  } else {
    mensaje =
      "En este caso, teniendo en cuenta los valores recibidos, es mejor invertir en plazo fijo.";
  }
  resultado.innerHTML = mensaje;

  mostrarSimulacionesRecientes();
  filtrarPlazoMayorA30();
  guardarInversionesEnLocalStorage();

  // Limpiando los Inputs
  valorInvertidoInput.value = "";
  tasaAnualInput.value = "";
  plazoInput.value = "";
  valorDolarHoyInput.value = "";
  valorDolarFuturoEstimadoInput.value = "";
};

botonSimular.addEventListener("click", simularPlazoFijo);

const filtrarPlazoMayorA30 = () => {
  inversionesSimuladasConPlazoMayorA30 = inversionesSimuladas.filter(
    (el) => el.plazo > 30
  );
};

const mostrarSimulacionesRecientes = () => {
  simulacionesRecientes.innerHTML = "";

  inversionesSimuladas.forEach((inversionSimulada) => {
    simulacionesRecientes.innerHTML += `
    Cantidad de dolares: ${Math.round(dolaresComprados)}
    Valor final PF: ${Math.round(nuevaInversion.calculoPlazoFijo())} 
    <li>
     ${JSON.stringify(inversionSimulada, null, " ")} 
    </li>`;
  });
};

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
const errorDolar = document.getElementById("error-dol");
const simulacionesRecientes = document.getElementById("sim-recientes");

let inversionesSimuladas =
  JSON.parse(localStorage.getItem("inversiones")) || [];

let nuevaInversion;
let dolaresComprados;
let inversionesSimuladasConPlazoMayorA30;

// Funcion principal para el cálculo de la simulación
const simularPlazoFijo = () => {
  const valorInvertido = parseFloat(valorInvertidoInput.value);
  const tasaAnual = parseFloat(tasaAnualInput.value);
  const plazo = parseFloat(plazoInput.value);
  const valorDolarHoy = parseFloat(valorDolarHoyInput.value);
  const valorDolarFuturo = parseFloat(valorDolarFuturoEstimadoInput.value);

  if (tasaAnual <= 0 || tasaAnual > 0.99 || isNaN(tasaAnual)) {
    error.innerHTML =
      "Valor de tasa incorrecto. Por favor, ingrese un valor entre 0.01 y 0.99";
    return;
  } else if (isNaN(valorInvertido) || valorInvertido <= 0) {
    error.innerHTML = "Valor de inversión incorrecto.";
    return;
  } else if (isNaN(plazo) || plazo <= 0) {
    error.innerHTML = "Valor de plazo incorrecto.";
    return;
  } else if (valorDolarHoy <= 0 || isNaN(valorDolarHoy)) {
    errorDolar.innerHTML = "Los valores ingresados deben ser mayores a 0";
    return;
  } else if (valorDolarFuturo <= 0 || isNaN(valorDolarFuturo)) {
    errorDolar.innerHTML = "Los valores ingresados deben ser mayores a 0";
    return;
  }

  nuevaInversion = new PlazoFijo(valorInvertido, tasaAnual, plazo);

  dolaresComprados = valorInvertido / valorDolarHoy;

  nuevaInversion.dolaresComprados = dolaresComprados;
  nuevaInversion.valorFinalPF = nuevaInversion.calculoPlazoFijo();

  inversionesSimuladas.push(nuevaInversion);

  const valorInversionFinalDolares = dolaresComprados * valorDolarFuturo;

  let mensaje = "";

  if (valorInversionFinalDolares > nuevaInversion.calculoPlazoFijo()) {
    mensaje =
      "En este caso, teniendo en cuenta los valores recibidos, es mejor comprar dólares.";
  } else {
    mensaje =
      "En este caso, teniendo en cuenta los valores recibidos, es mejor invertir en plazo fijo.";
  }

  resultado.innerHTML = mensaje;

  error.innerHTML = ""; // Limpia el mensaje de error
  errorDolar.innerHTML = "";

  // Llamado a las funciones
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

// Evento que llama a la funcion principal + Toastify
botonSimular.addEventListener("click", () => {
  simularPlazoFijo();
  if (inversionesSimuladas.includes(nuevaInversion)) {
    Toastify({
      text: "Simulación exitosa",
      duration: 3000,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  } else {
    Toastify({
      text: "Simulación fallida",
      duration: "3000",
      style: {
        background: "#f15c5c",
      },
    }).showToast();
  }
});

// Funcion para filtrar las inversiones con plazo +30
const filtrarPlazoMayorA30 = () => {
  inversionesSimuladasConPlazoMayorA30 = inversionesSimuladas.filter(
    (el) => el.plazo > 30
  );
};

// Funcion para guardar las simulaciones generadas en el Local Storage
const guardarInversionesEnLocalStorage = () => {
  localStorage.setItem("inversiones", JSON.stringify(inversionesSimuladas));
};

// Function que muestra las simulaciones recientes en el DOM
const mostrarSimulacionesRecientes = () => {
  simulacionesRecientes.innerHTML = "";

  inversionesSimuladas.forEach((inversionSimulada) => {
    simulacionesRecientes.innerHTML += `
    <li>
    <em>Cantidad de dolares:</em> ${Math.round(
      inversionSimulada.dolaresComprados
    )} 
    <em>Valor final PF:</em> ${Math.round(inversionSimulada.valorFinalPF)} 
    <em>Valor invertido:</em> ${inversionSimulada.valorInvertido} 
    <em>Tasa:</em> ${inversionSimulada.tasaAnual} 
    <em>Plazo:</em> ${inversionSimulada.plazo} 
    </li>
    <hr />`;
  });
};

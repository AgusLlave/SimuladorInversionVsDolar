class Inversion {
  constructor(valorInvertido, tasaAnual, plazo) {
    this.valorInvertido = valorInvertido;
    this.tasaAnual = tasaAnual;
    this.plazo = plazo;
  }

  calculoInversion() {
    const interesGanado =
      (this.valorInvertido * this.tasaAnual * this.plazo) / 365;
    return this.valorInvertido + interesGanado;
  }
}

const valorInvertidoInput = document.getElementById("valor");
const tasaAnualInput = document.getElementById("tasa");
const plazoInput = document.getElementById("plazo");
const botonSimular = document.getElementById("simular-inv");
const valorDolarHoyInput = document.getElementById("dolar-hoy");
const valorDolarFuturoEstimadoInput = document.getElementById("dolar-futuro");
const resultado = document.getElementById("resultado");
const error = document.getElementById("error");
const errorDolar = document.getElementById("error-dol");
const simulacionesRecientes = document.getElementById("sim-recientes");
const botonObtenerValorDolar = document.getElementById("button-api");
const valorDolarActual = document.getElementById("valor-dolar-actual");

let inversionesSimuladas =
  JSON.parse(localStorage.getItem("inversiones")) || [];

let nuevaInversion;
let dolaresComprados;
let inversionesSimuladasConPlazoMayorA30;

// Funcion principal para el cálculo de la simulación
const simularInversion = () => {
  const valorInvertido = parseFloat(valorInvertidoInput.value);
  const tasaAnual = parseFloat(tasaAnualInput.value);
  const plazo = parseFloat(plazoInput.value);
  const valorDolarHoy = parseFloat(valorDolarHoyInput.value);
  const valorDolarFuturo = parseFloat(valorDolarFuturoEstimadoInput.value);

  if (tasaAnual <= 0 || tasaAnual > 1.99 || isNaN(tasaAnual)) {
    error.innerHTML =
      "Valor de tasa incorrecto. Por favor, ingrese un valor entre 0.01 y 1.99. (Ej: 30% -> 0.3)";
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

  nuevaInversion = new Inversion(valorInvertido, tasaAnual, plazo);

  dolaresComprados = valorInvertido / valorDolarHoy;

  nuevaInversion.dolaresComprados = dolaresComprados;
  nuevaInversion.valorFinalInversion = nuevaInversion.calculoInversion();

  inversionesSimuladas.push(nuevaInversion);

  const valorInversionFinalDolares = dolaresComprados * valorDolarFuturo;

  let mensaje = "";

  if (valorInversionFinalDolares > nuevaInversion.calculoInversion()) {
    mensaje =
      "En este caso, teniendo en cuenta los valores recibidos, es mejor comprar dólares.";
  } else {
    mensaje =
      "En este caso, teniendo en cuenta los valores recibidos, es mejor realizar la inversión.";
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

// Funcion para filtrar las inversiones con plazo +30 (No le di ningun uso en sitio todavia)
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
    <em>Valor final Inversion:</em> ${Math.round(
      inversionSimulada.valorFinalInversion
    )} 
    <em>Valor invertido:</em> ${inversionSimulada.valorInvertido} 
    <em>Tasa:</em> ${inversionSimulada.tasaAnual} 
    <em>Plazo:</em> ${inversionSimulada.plazo} 
    </li>
    <hr />`;
  });
};

//Función que solicita la API para obtener el valor USD/ARS
const obtenerValorDolarHoy = async () => {
  const url =
    "https://currency-exchange.p.rapidapi.com/exchange?from=USD&to=ARS&q=1.0";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "5ad1dca026mshf81a88816ae260cp144f49jsn17bd7a014b58",
      "X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    valorDolarHoyInput.value = Math.round(Number(result));
  } catch (error) {
    console.error(error);
  }
};

// Evento que llama a la funcion principal + Toastify
botonSimular.addEventListener("click", () => {
  simularInversion();
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

// Evento que llama a la API para obtener la cotización del dolar
botonObtenerValorDolar.addEventListener("click", obtenerValorDolarHoy);

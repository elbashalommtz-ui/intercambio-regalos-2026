import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

/* =========================================
   CONFIGURACIÓN DE FIREBASE
   ========================================= */
const firebaseConfig = {
  apiKey: "AIzaSyAmDszGH_e3D6d74VG7qKtDgz6jYEALbAg",
  authDomain: "intercambio-de-navidad-2026b.firebaseapp.com",
  projectId: "intercambio-de-navidad-2026b",
  storageBucket: "intercambio-de-navidad-2026b.firebasestorage.app",
  messagingSenderId: "769568050642",
  appId: "1:769568050642:web:ccd899ec36940ebf8a4c0b",
  measurementId: "G-23WS6GLGF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =========================================
   LAS 10 PERSONAS DEL INTERCAMBIO
   ========================================= */

const participantes = [
  "Persona 1",
  "Persona 2",
  "Persona 3",
  "Persona 4",
  "Persona 5",
  "Persona 6",
  "Persona 7",
  "Persona 8",
  "Persona 9",
  "Persona 10"
];

/* =========================================
   MOSTRAR PARTICIPANTES
   ========================================= */

const contenedor = document.getElementById("participantes");

if (contenedor) {
  participantes.forEach((nombre, index) => {
    const tarjeta = document.createElement("div");

    tarjeta.className = "participante";

    tarjeta.innerHTML = `
      <div class="participante-header">
        <h2>🎁 ${nombre}</h2>
      </div>

      <div class="agregar-regalo">
        <input
          type="text"
          id="regalo-${index}"
          placeholder="Pega aquí el link de tu regalo"
        >

        <button onclick="agregarRegalo(${index}, '${nombre}')">
          ➕ Agregar
        </button>
      </div>

      <div
        class="lista-regalos"
        id="lista-${index}">
        <p class="cargando">Cargando opciones...</p>
      </div>
    `;

    contenedor.appendChild(tarjeta);

    cargarRegalos(nombre, index);
  });
}

/* =========================================
   AGREGAR REGALO
   ========================================= */

window.agregarRegalo = async function(index, nombre) {

  const input = document.getElementById(`regalo-${index}`);

  const link = input.value.trim();

  if (!link) {
    alert("Primero pega el enlace del regalo 🎁");
    return;
  }

  try {

    await addDoc(collection(db, "regalos"), {
      participante: nombre,
      link: link,
      fecha: new Date()
    });

    input.value = "";

    alert("¡Regalo agregado! 🎁");

  } catch (error) {

    console.error(error);

    alert(
      "No se pudo guardar el regalo. Revisa la configuración de Firebase."
    );
  }
};

/* =========================================
   CARGAR REGALOS
   ========================================= */

function cargarRegalos(nombre, index) {

  const lista = document.getElementById(`lista-${index}`);

  const regalosQuery = query(
    collection(db, "regalos"),
    orderBy("fecha", "asc")
  );

  onSnapshot(regalosQuery, (snapshot) => {

    lista.innerHTML = "";

    let encontrados = 0;

    snapshot.forEach((documento) => {

      const regalo = documento.data();

      if (regalo.participante !== nombre) {
        return;
      }

      encontrados++;

      const elemento = document.createElement("div");

      elemento.className = "regalo";

      elemento.innerHTML = `
        <a
          href="${regalo.link}"
          target="_blank"
          rel="noopener noreferrer">
          🛍️ Ver opción de regalo
        </a>

        <button
          class="eliminar"
          onclick="eliminarRegalo('${documento.id}')">
          🗑️
        </button>
      `;

      lista.appendChild(elemento);
    });

    if (encontrados === 0) {

      lista.innerHTML = `
        <p class="sin-regalos">
          Todavía no hay regalos agregados 💕
        </p>
      `;
    }

  });
}

/* =========================================
   ELIMINAR REGALO
   ========================================= */

window.eliminarRegalo = async function(id) {

  const confirmar = confirm(
    "¿Quieres eliminar esta opción de regalo?"
  );

  if (!confirmar) {
    return;
  }

  try {

    await deleteDoc(doc(db, "regalos", id));

  } catch (error) {

    console.error(error);

    alert("No se pudo eliminar el regalo.");
  }
};

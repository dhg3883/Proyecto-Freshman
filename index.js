// Datos de ejemplo de cursos.
const cursos = [
  { codigo: 'COMP101', nombre: 'Programación I', profesor: 'Carla Rojas', horario: 'Lun 08:00-10:00', cupos: 12 },
  { codigo: 'MAT150', nombre: 'Matemáticas Discretas', profesor: 'Luis Gómez', horario: 'Mar 10:30-12:30', cupos: 5 },
  { codigo: 'WEB210', nombre: 'Desarrollo Web', profesor: 'Ana Pérez', horario: 'Mié 14:00-16:00', cupos: 2 },
  { codigo: 'DBS300', nombre: 'Bases de Datos', profesor: 'Jorge Castro', horario: 'Jue 09:00-11:00', cupos: 0 }
];

let carrito = [];
let cursoSeleccionado = null;

function getEstadoCupos(curso) {
  if (curso.cupos <= 0) return { clase: 'full', label: 'Cupo completo' };
  if (curso.cupos <= 2) return { clase: 'red', label: 'Cupos casi llenos' };
  if (curso.cupos <= 6) return { clase: 'yellow', label: 'Cupos medios' };
  return { clase: 'green', label: 'Cupos disponibles' };
}

function actualizarCarritoInfo() {
  const cartInfo = document.getElementById('carrito-info');
  cartInfo.textContent = `Carrito: ${carrito.length} curso(s)`;
}

function crearCardCurso(curso) {
  const card = document.createElement('article');
  const estado = getEstadoCupos(curso);
  card.className = `access-card ${estado.clase}`;
  card.dataset.codigo = curso.codigo;

  if (curso.cupos <= 0) {
    card.classList.add('full');
    card.setAttribute('aria-disabled', 'true');
  }

  card.innerHTML = `
    <h3>${curso.nombre}</h3>
    <p><strong>Código:</strong> ${curso.codigo}</p>
    <p><strong>Profesor:</strong> ${curso.profesor}</p>
    <p><strong>Horario:</strong> ${curso.horario}</p>
    <p class="status"><strong>Cupos:</strong> ${curso.cupos}</p>
    <p class="status">${estado.label}</p>
  `;

  if (curso.cupos > 0) {
    card.addEventListener('click', () => abrirModal(curso));
  }

  return card;
}

function renderCursos(cursos) {
  const contenedor = document.querySelector('.access-cards');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  if (cursos.length === 0) {
    contenedor.innerHTML = '<p>No hay cursos disponibles</p>';
    return;
  }

  cursos.forEach((curso) => {
    contenedor.appendChild(crearCardCurso(curso));
  });
}

function abrirModal(curso) {
  cursoSeleccionado = curso;
  const modal = document.getElementById('curso-modal');
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <p><strong>Código:</strong> ${curso.codigo}</p>
    <p><strong>Curso:</strong> ${curso.nombre}</p>
    <p><strong>Profesor:</strong> ${curso.profesor}</p>
    <p><strong>Horario:</strong> ${curso.horario}</p>
    <p><strong>Cupos disponibles:</strong> ${curso.cupos}</p>
  `;

  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
}

function cerrarModal() {
  const modal = document.getElementById('curso-modal');
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden', 'true');
  cursoSeleccionado = null;
}

function agregarAlCarrito() {
  if (!cursoSeleccionado || cursoSeleccionado.cupos <= 0) return;

  const yaAgregado = carrito.some((curso) => curso.codigo === cursoSeleccionado.codigo);
  if (yaAgregado) {
    alert('Este curso ya está en tu carrito.');
    return;
  }

  carrito.push({ ...cursoSeleccionado });
  cursoSeleccionado.cupos -= 1;

  if (cursoSeleccionado.cupos <= 0) cursoSeleccionado.cupos = 0;

  actualizarCarritoInfo();
  renderCursos(cursos);
  cerrarModal();
}

function salvarCarrito() {
  localStorage.setItem('carritoCursos', JSON.stringify(carrito));
  cookie = localStorage.getItem('carritoCursos');
}


function checkout() {
  if (carrito.length === 0) {
    alert('Agrega al menos un curso al carrito antes de finalizar.');
    return;
  }

  salvarCarrito();
  window.location.href = 'facturacion.html';
}

function cargarCarrito() {
  const almacenado = JSON.parse(localStorage.getItem('carritoCursos') || '[]');
  if (!Array.isArray(almacenado) || almacenado.length === 0) {
    carrito = [];
    return;
  }

  carrito = almacenado;

  // Ajustar cupos según el carrito persistido
  carrito.forEach((cursoEnCarrito) => {
    const curso = cursos.find((c) => c.codigo === cursoEnCarrito.codigo);
    if (curso) {
      curso.cupos = Math.max(curso.cupos - 1, 0);
    }
  });
}

// Inicialización

document.addEventListener('DOMContentLoaded', () => {
  cargarCarrito();
  renderCursos(cursos);
  actualizarCarritoInfo();

  document.getElementById('modal-close').addEventListener('click', cerrarModal);
  document.getElementById('modal-cancel').addEventListener('click', cerrarModal);
  document.getElementById('add-to-cart').addEventListener('click', () => {
    agregarAlCarrito();
    salvarCarrito();
  });
  document.getElementById('btn-checkout').addEventListener('click', checkout);

  const modalOverlay = document.getElementById('curso-modal');
  modalOverlay.addEventListener('click', (evento) => {
    if (evento.target === modalOverlay) cerrarModal();
  });
});
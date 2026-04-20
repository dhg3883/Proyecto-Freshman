// ============================================================
//  ULACIT — Sistema de Matrícula  |  index.js
// ============================================================

const cursos = [
  { codigo: 'COMP101', nombre: 'Programación I',          profesor: 'Carla Rojas',    horario: 'Lun 08:00–10:00', cupos: 12 },
  { codigo: 'COMP202', nombre: 'Programación II',         profesor: 'Sofía Méndez',   horario: 'Mié 08:00–10:00', cupos: 8  },
  { codigo: 'MAT150',  nombre: 'Matemáticas Discretas',   profesor: 'Luis Gómez',     horario: 'Mar 10:30–12:30', cupos: 5  },
  { codigo: 'MAT201',  nombre: 'Cálculo Diferencial',     profesor: 'Marco Salazar',  horario: 'Jue 07:00–09:00', cupos: 3  },
  { codigo: 'WEB210',  nombre: 'Desarrollo Web',          profesor: 'Ana Pérez',      horario: 'Mié 14:00–16:00', cupos: 2  },
  { codigo: 'WEB310',  nombre: 'Desarrollo Web Avanzado', profesor: 'Roberto Vargas', horario: 'Vie 13:00–15:00', cupos: 7  },
  { codigo: 'DBS300',  nombre: 'Bases de Datos',          profesor: 'Jorge Castro',   horario: 'Jue 09:00–11:00', cupos: 0  },
  { codigo: 'NET400',  nombre: 'Redes y Comunicaciones',  profesor: 'Diana Herrera',  horario: 'Mar 15:00–17:00', cupos: 6  },
  { codigo: 'SEC450',  nombre: 'Seguridad Informática',   profesor: 'Andrés Mora',    horario: 'Lun 14:00–16:00', cupos: 1  },
  { codigo: 'ALG250',  nombre: 'Algoritmos y Estructuras',profesor: 'Paula Jiménez',  horario: 'Vie 09:00–11:00', cupos: 9  },
];

let carrito = [];
let cursoSeleccionado = null;

// ── Helpers ──────────────────────────────────────────────────

function getEstadoCupos(curso) {
  if (curso.cupos <= 0) return { clase: 'full',   label: 'Cupo completo' };
  if (curso.cupos <= 2) return { clase: 'red',    label: 'Cupos casi llenos' };
  if (curso.cupos <= 6) return { clase: 'yellow', label: 'Cupos medios' };
  return                       { clase: 'green',  label: 'Cupos disponibles' };
}

function actualizarCarritoInfo() {
  const el = document.getElementById('carrito-info');
  if (el) el.textContent = `Carrito: ${carrito.length} curso(s)`;
}

// ── Render cards ─────────────────────────────────────────────

function crearCardCurso(curso) {
  const card   = document.createElement('article');
  const estado = getEstadoCupos(curso);

  card.className        = `access-card ${estado.clase}`;
  card.dataset.codigo   = curso.codigo;
  if (curso.cupos <= 0) card.setAttribute('aria-disabled', 'true');

  const enCarrito = carrito.some(c => c.codigo === curso.codigo);

  card.innerHTML = `
    <span class="card-code">${curso.codigo}</span>
    <h3>${curso.nombre}</h3>
    <p><strong>Profesor:</strong> ${curso.profesor}</p>
    <p><strong>Horario:</strong> ${curso.horario}</p>
    <p><strong>Cupos:</strong> ${curso.cupos <= 0 ? '—' : curso.cupos}</p>
    <span class="status-chip">${enCarrito ? '&#10003; En carrito' : estado.label}</span>
  `;

  if (curso.cupos > 0 && !enCarrito) {
    card.addEventListener('click', () => abrirModal(curso));
  }

  return card;
}

function renderCursos(lista) {
  const contenedor = document.querySelector('.access-cards');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  if (lista.length === 0) {
    contenedor.innerHTML = '<p style="padding:0 6%;color:var(--clr-muted)">No hay cursos disponibles.</p>';
    return;
  }

  lista.forEach(curso => contenedor.appendChild(crearCardCurso(curso)));
}

// ── Modal ────────────────────────────────────────────────────

function abrirModal(curso) {
  cursoSeleccionado = curso;
  const modal     = document.getElementById('curso-modal');
  const modalBody = document.getElementById('modal-body');

  modalBody.innerHTML = `
    <p><strong>Código:</strong>            ${curso.codigo}</p>
    <p><strong>Curso:</strong>             ${curso.nombre}</p>
    <p><strong>Profesor:</strong>          ${curso.profesor}</p>
    <p><strong>Horario:</strong>           ${curso.horario}</p>
    <p><strong>Cupos disponibles:</strong> ${curso.cupos}</p>
  `;

  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('add-to-cart').focus();
}

function cerrarModal() {
  const modal = document.getElementById('curso-modal');
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden', 'true');
  cursoSeleccionado = null;
}

// ── Cart ─────────────────────────────────────────────────────

function agregarAlCarrito() {
  if (!cursoSeleccionado || cursoSeleccionado.cupos <= 0) return;

  const yaAgregado = carrito.some(c => c.codigo === cursoSeleccionado.codigo);
  if (yaAgregado) {
    alert('Este curso ya está en tu carrito.');
    return;
  }

  carrito.push({ ...cursoSeleccionado });
  cursoSeleccionado.cupos = Math.max(cursoSeleccionado.cupos - 1, 0);

  actualizarCarritoInfo();
  renderCursos(cursos);
  cerrarModal();
}

function salvarCarrito() {
  localStorage.setItem('carritoCursos', JSON.stringify(carrito));
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

  // Reflect persisted cart in available spots
  carrito.forEach(cursoEnCarrito => {
    const curso = cursos.find(c => c.codigo === cursoEnCarrito.codigo);
    if (curso) curso.cupos = Math.max(curso.cupos - 1, 0);
  });
}

// ── Init ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  cargarCarrito();
  renderCursos(cursos);
  actualizarCarritoInfo();

  document.getElementById('modal-close') .addEventListener('click', cerrarModal);
  document.getElementById('modal-cancel').addEventListener('click', cerrarModal);
  document.getElementById('add-to-cart') .addEventListener('click', () => {
    agregarAlCarrito();
    salvarCarrito();
  });
  document.getElementById('btn-checkout').addEventListener('click', checkout);

  // Close modal on backdrop click
  document.getElementById('curso-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) cerrarModal();
  });

  // Close modal with Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarModal();
  });
});

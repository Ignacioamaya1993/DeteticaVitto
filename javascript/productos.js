import { db } from './firebaseConfig.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const contenedor = document.getElementById('lista-productos');
const buscador = document.getElementById('buscador');
const filtroCategoria = document.getElementById('filtro-categoria');

let productos = [];

async function obtenerProductos() {
  const querySnapshot = await getDocs(collection(db, "productos"));
  productos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderizarCategorias();
  renderizarProductos(productos);
}

function renderizarCategorias() {
  const categorias = [...new Set(productos.map(p => p.categoria))];
  categorias.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filtroCategoria.appendChild(option);
  });
}

function validarCantidadGramos(cantidad, max) {
  return cantidad >= 100 && cantidad <= max && cantidad % 100 === 0;
}

function renderizarProductos(lista) {
  contenedor.innerHTML = '';
  if (lista.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }

  lista.forEach(prod => {
    const card = document.createElement('div');
    card.classList.add('producto');

    const imagenContenedor = document.createElement('div');
    imagenContenedor.classList.add('imagen-producto');

    if (prod.imagenUrl) {
      const img = document.createElement('img');
      img.src = prod.imagenUrl;
      img.alt = prod.nombre;
      imagenContenedor.appendChild(img);
    }

    const nombre = document.createElement('h3');
    nombre.textContent = prod.nombre;

    const unidadTexto = prod.tipoVenta === 'gramos' ? 'gramos' : 'unidades';
    const stockTexto = prod.tipoVenta === 'gramos' ? 'g' : 'u';
    const precioTexto = prod.tipoVenta === 'gramos' ? `por 100g` : `por unidad`;

    const precio = document.createElement('p');
    precio.textContent = `Precio: $${prod.precio} ${precioTexto}`;

    const stock = document.createElement('p');
    stock.textContent = `Stock: ${prod.stock} ${stockTexto}`;

    const cantidadInput = document.createElement('input');
    cantidadInput.type = 'number';
    cantidadInput.placeholder = `Cantidad en ${unidadTexto}`;
    cantidadInput.classList.add('input-cantidad');

    if (prod.tipoVenta === 'gramos') {
      cantidadInput.min = 100;
      cantidadInput.step = 100;
      cantidadInput.max = prod.stock;
    } else {
      cantidadInput.min = 1;
      cantidadInput.step = 1;
      cantidadInput.max = prod.stock;
    }

    const precioTotal = document.createElement('p');
    precioTotal.classList.add('precio-total');
    precioTotal.textContent = `Total: $0`;

    cantidadInput.addEventListener('input', () => {
      const cantidad = parseInt(cantidadInput.value);
      if (!cantidad || cantidad > prod.stock) {
        precioTotal.textContent = `Total: $0`;
        return;
      }

      if (prod.tipoVenta === 'gramos' && !validarCantidadGramos(cantidad, prod.stock)) {
        precioTotal.textContent = `Total: $0`;
        return;
      }

      const total = prod.tipoVenta === 'gramos'
        ? (prod.precio * cantidad) / 100
        : prod.precio * cantidad;

      precioTotal.textContent = `Total: $${total}`;
    });

    const btnAgregar = document.createElement('button');
    btnAgregar.textContent = 'Agregar al carrito';
    btnAgregar.classList.add('btn-carrito');

    const btnComprar = document.createElement('button');
    btnComprar.textContent = 'Comprar';
    btnComprar.classList.add('btn-comprar');

    btnAgregar.addEventListener('click', () => {
      const cantidad = parseInt(cantidadInput.value);

      if (prod.tipoVenta === 'gramos') {
        if (!validarCantidadGramos(cantidad, prod.stock)) {
          Swal.fire('Cantidad inválida', `Debe ingresar múltiplos de 100g (mínimo 100g) hasta ${prod.stock}g.`, 'warning');
          return;
        }
        const total = (prod.precio * cantidad) / 100;
        Swal.fire('Agregado al carrito', `Agregaste ${cantidad}g de ${prod.nombre} ($${total})`, 'success');
      } else {
        if (!cantidad || cantidad < 1 || cantidad > prod.stock) {
          Swal.fire('Cantidad inválida', `Debe ingresar entre 1 y ${prod.stock} unidades.`, 'warning');
          return;
        }
        const total = prod.precio * cantidad;
        Swal.fire('Agregado al carrito', `${cantidad} x ${prod.nombre} ($${total})`, 'success');
      }
    });

    btnComprar.addEventListener('click', () => {
      const cantidad = parseInt(cantidadInput.value);

      if (prod.tipoVenta === 'gramos') {
        if (!validarCantidadGramos(cantidad, prod.stock)) {
          Swal.fire('Cantidad inválida', `Debe ingresar múltiplos de 100g (mínimo 100g) hasta ${prod.stock}g.`, 'warning');
          return;
        }
        const total = (prod.precio * cantidad) / 100;
        Swal.fire('Gracias por tu compra', `Compraste ${cantidad}g de ${prod.nombre} por $${total}`, 'success');
      } else {
        if (!cantidad || cantidad < 1 || cantidad > prod.stock) {
          Swal.fire('Cantidad inválida', `Debe ingresar entre 1 y ${prod.stock} unidades.`, 'warning');
          return;
        }
        const total = prod.precio * cantidad;
        Swal.fire('Gracias por tu compra', `Compraste ${cantidad} x ${prod.nombre} por $${total}`, 'success');
      }
    });

    card.appendChild(imagenContenedor);
    card.appendChild(nombre);
    card.appendChild(precio);
    card.appendChild(stock);
    card.appendChild(cantidadInput);
    card.appendChild(precioTotal);
    card.appendChild(btnAgregar);
    card.appendChild(btnComprar);

    contenedor.appendChild(card);
  });
}

function aplicarFiltros() {
  const texto = buscador.value.toLowerCase();
  const categoria = filtroCategoria.value;
  const filtrados = productos.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(texto);
    const coincideCategoria = !categoria || p.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });
  renderizarProductos(filtrados);
}

buscador.addEventListener('input', aplicarFiltros);
filtroCategoria.addEventListener('change', aplicarFiltros);

obtenerProductos();
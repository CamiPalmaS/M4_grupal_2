//se incluye estilo de Data Table
$(document).ready( function () {
  new DataTable("#myTable");
} );


class Empresa {
  #idRegistro;
  #nombre;
  #rut;
  #importaciones;

  constructor(idRegistro, nombre, rut) {
      this.#idRegistro = idRegistro;
      this.#nombre = nombre;
      this.#rut = rut;
      this.#importaciones = [];
  }

  agregarImportacion(importacion) {
      this.#importaciones.push(importacion);
  }

  mostrarInformacion() {
      return `IdRegistro: ${this.#idRegistro}, Nombre: ${this.#nombre}, RUT: ${this.#rut}`;
  }

  getNombre() {
      return this.#nombre;
  }

  getIdRegistro() {
      return this.#idRegistro;
  }

  getRut() {
      return this.#rut;
  }

  getImportaciones() {
      return this.#importaciones;
  }
}

class Importaciones {
  #idImportacion;
  #producto;
  #numeroProductos;
  #precioUnitario;

  constructor(idImportacion, producto, numeroProductos, precioUnitario) {
      this.#idImportacion = idImportacion;
      this.#producto = producto;
      this.#numeroProductos = numeroProductos;
      this.#precioUnitario = precioUnitario;
  }
  
  mostrarInformacion() {
      return `IdImportacion: ${this.#idImportacion}, Producto: ${this.#producto}, Numero de Productos: ${this.#numeroProductos}, Precio Unitario: ${this.#precioUnitario}`;
  }

  getIdImportacion() {
      return this.#idImportacion;
  }

  getProducto() {
      return this.#producto;
  }

  getNumeroProductos() {
      return this.#numeroProductos;
  }

  getPrecioUnitario() {
      return this.#precioUnitario;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  // Agregar Empresa
  document.getElementById("btnAgregarEmpresa").addEventListener("click", agregarEmpresa);

  // Agregar Importación
  document.getElementById("btnAgregarImportacion").addEventListener("click", addImportacion);

  // Para los botones que se crean dinámicamente (como los de Mostrar Totales)
  document.addEventListener("click", function(event) {
    if (event.target && event.target.matches(".btn-mostrar-totales")) {
      const nombreEmpresa = event.target.getAttribute("data-empresa");
      calcularTotales(nombreEmpresa);
    }
  });
});

let empresas = [];

function agregarEmpresa() {
  const idRegistro = document.getElementById("idRegistro").value;
  const nombre = document.getElementById("nombre").value;
  const rut = document.getElementById("rut").value;
  const empresa = new Empresa(idRegistro, nombre, rut);
  empresas.push(empresa);
  console.log(empresa);
  alert("Empresa creada: " + empresa.mostrarInformacion());

  mostrarEmpresas();
  actualizarSelectEmpresas();
  document.getElementById("idRegistro").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("rut").value = "";
}

function mostrarEmpresas() {
  const seccionEmpresas = document.getElementById("sectionEmpresas");

  // Agrega solo la nueva empresa al final, sin borrar el contenido anterior
  const empresa = empresas[empresas.length - 1]; // Última empresa agregada
  const newDiv = document.createElement('div');
  newDiv.classList.add('mb-4');
  newDiv.innerHTML = `
    <div class="border p-3 rounded">
      <h2>${empresa.getNombre()}</h2>
      <p>ID Registro: ${empresa.getIdRegistro()}</p>
      <p>RUT: ${empresa.getRut()}</p>
      <div class="table-responsive">
      <table id="myTable" class="table table-striped table-hover cell-border">
        <thead>
          <tr>
            <th>ID Importación</th>
            <th>Producto</th>
            <th>Número de Productos</th>
            <th>Precio Unitario</th>
          </tr>
        </thead>
        <tbody id="importaciones-${empresa.getNombre()}">
        </tbody>
        <tfoot id="totales-${empresa.getNombre()}">
        </tfoot>
      </table>
      </div>
      <button class="btn btn-primary btn-mostrar-totales" data-empresa="${empresa.getNombre()}">Mostrar Totales</button>
    </div>`;

  seccionEmpresas.appendChild(newDiv);
}

function addImportacion() {
  const idImportacion = document.getElementById("idImportacion").value;
  const producto = document.getElementById("producto").value;
  const numeroProductos = document.getElementById("numeroProductos").value;
  const precioUnitario = document.getElementById("precioUnitario").value;
  const nombreEmpresa = document.getElementById("nombreEmpresa").value.trim();

  if (!idImportacion || !producto || !numeroProductos || !precioUnitario || !nombreEmpresa) {
      alert("Debes completar todos los campos para agregar una importación.");
      return;
  }

  const empresa = empresas.find(empresa => empresa.getNombre() === nombreEmpresa);

  if (!empresa) {
      alert("No se encontró ninguna empresa con ese nombre.");
      return;
  }

  const importacion = new Importaciones(idImportacion, producto, numeroProductos, precioUnitario);
  empresa.agregarImportacion(importacion);
  alert("Importación agregada a la empresa " + nombreEmpresa + ": " + importacion.mostrarInformacion());

  mostrarImportaciones(empresa);
  document.getElementById("idImportacion").value = "";
  document.getElementById("producto").value = "";
  document.getElementById("numeroProductos").value = "";
  document.getElementById("precioUnitario").value = "";
  document.getElementById("nombreEmpresa").value = "";
}

function mostrarImportaciones(empresa) {
  const tbody = document.getElementById(`importaciones-${empresa.getNombre()}`);
  tbody.innerHTML = "";

  empresa.getImportaciones().forEach((importacion) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${importacion.getIdImportacion()}</td>
        <td>${importacion.getProducto()}</td>
        <td>${importacion.getNumeroProductos()}</td>
        <td>${importacion.getPrecioUnitario()}</td>`;
      tbody.appendChild(row);
  });

  // Limpiar el pie de tabla antes de agregar los nuevos totales
  const tfoot = document.getElementById(`totales-${empresa.getNombre()}`);
  tfoot.innerHTML = "";
}

function calcularTotales(nombreEmpresa) {
  const empresa = empresas.find(empresa => empresa.getNombre() === nombreEmpresa);
  if (!empresa) {
      alert("No se encontró ninguna empresa con ese nombre.");
      return;
  }

  const importaciones = empresa.getImportaciones();
  let totalProductos = 0;
  let sumaTotal = 0;

  importaciones.forEach(importacion => {
      totalProductos += parseInt(importacion.getNumeroProductos(), 10);
      sumaTotal += parseInt(importacion.getNumeroProductos(), 10) * parseFloat(importacion.getPrecioUnitario());
  });

  const tfoot = document.getElementById(`totales-${nombreEmpresa}`);
  tfoot.innerHTML = `
      <tr>
        <td colspan="2"><strong>Total Número de Productos:</strong></td>
        <td>${totalProductos}</td>
        <td></td>
      </tr>
      <tr>
        <td colspan="2"><strong>Suma Total de Importaciones:</strong></td>
        <td>${sumaTotal.toFixed(2)}</td>
        <td></td>
      </tr>`;
}

function actualizarSelectEmpresas() {
  const select = document.getElementById("nombreEmpresa");
  select.innerHTML = '<option value="">Seleccione una empresa</option>'; // Resetea el menú desplegable

  empresas.forEach(empresa => {
      const option = document.createElement("option");
      option.value = empresa.getNombre();
      option.textContent = empresa.getNombre();
      select.appendChild(option);
  });
}

// Variables
const carrito = document.getElementById('carrito');
const cursos = document.getElementById('lista-cursos');
const listaCursos = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const inputBuscador = document.getElementById("buscador");
const formulario = document.getElementById("submit-buscador");

// Listeners
cargarEventListeners();

function cargarEventListeners() {
    // Listener botÃ³n "Agregar Carrito"
    cursos.addEventListener('click', comprarCurso);

    // Listener botÃ³n X que elimina un curso del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Listener botÃ³n "Vaciar carrito"
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

    // Carga de datos del Local Storage en el momento en el que el DOM esta cargado
    document.addEventListener('DOMContentLoaded', leerLocalStorage);

    // Listener para sobreescribir la funcionalidad del boton submit de bÃºsqueda
    formulario.addEventListener("click", encontrarCursos);
}

// Funciones

// FunciÃ³n que aÃ±ade el curso al carrito
function comprarCurso(e) {
    e.preventDefault();

    if (e.target.classList.contains('agregar-carrito')) {
        const curso = e.target.parentElement.parentElement;
        leerDatosCurso(curso);
    }
}

// Lee los datos del curso
function leerDatosCurso(curso) {
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id')
    }

    insertarCarrito(infoCurso);

}

// Muestra el curso seleccionado en el Carrito
function insertarCarrito(curso) {
    const row = document.createElement('tr');
    row.innerHTML = `
          <td>  
               <img src="${curso.imagen}" width=100>
          </td>
          <td>${curso.titulo}</td>
          <td>${curso.precio}</td>
          <td>
               <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
          </td>
     `;
    listaCursos.appendChild(row);
    guardarCursoLocalStorage(curso);
}

// Elimina el curso del carrito en el DOM
function eliminarCurso(e) {
    e.preventDefault();

    let curso,
        cursoId;
    if (e.target.classList.contains('borrar-curso')) {
        e.target.parentElement.parentElement.remove();
        curso = e.target.parentElement.parentElement;
        cursoId = curso.querySelector('a').getAttribute('data-id');

    }
    eliminarCursoLocalStorage(cursoId);
}
// Elimina los cursos del carrito en el DOM
function vaciarCarrito() {
    while (listaCursos.firstChild) {
        listaCursos.removeChild(listaCursos.firstChild);
    }
    vaciarLocalStorage();

    return false;
}

// Almacena cursos en el carrito a Local Storage
function guardarCursoLocalStorage(curso) {
    let cursos = obtenerCursosLocalStorage();
    cursos.push(curso);
    localStorage.setItem('cursos', JSON.stringify(cursos));
}

// Comprueba que haya elementos en Local Storage
function obtenerCursosLocalStorage() {
    let cursosLS;

    if (localStorage.getItem('cursos') === null) {
        cursosLS = [];
    } else {
        cursosLS = JSON.parse(localStorage.getItem('cursos'));
    }

    return cursosLS;
}

// Imprime los cursos de Local Storage en el carrito
function leerLocalStorage() {
    let cursosLS = obtenerCursosLocalStorage();

    cursosLS.forEach(function (curso) {
        insertarCarrito(curso);
    });

    let datosJson = JSON.parse(documentoJson).listadoCursos;
    cargarDatosCursos(datosJson);
}

// Elimina el curso por el ID en Local Storage
function eliminarCursoLocalStorage(curso) {
    let cursosLS = obtenerCursosLocalStorage();
    
    cursosLS.forEach(function (cursoLS, index) {
        if (cursoLS.id === curso) {
            cursosLS.splice(index, 1);
        }
    });
    
    localStorage.setItem('cursos', JSON.stringify(cursosLS));
}

// Elimina todos los cursos de Local Storage
function vaciarLocalStorage() {
    localStorage.clear();
}

// Recuperar los datos de los cursos y mostrarlos en pantalla
function cargarDatosCursos(arrayCursos){    
    //let datosJson = JSON.parse(documento);
    let grid = ``;
    let contador = 1;

    arrayCursos.forEach(element => {
        grid = grid + `
            <div class="four columns">
                <div class="card">
                    <img src="${element.imagenCurso}" class="imagen-curso u-full-width">
                    <div class="info-card">
                        <h4>${element.tituloCurso}</h4>
                        <p>${element.instructorCurso}</p>
                        <img src="img/estrellas.png">
                        <p class="precio">${element.precioOriginal}  <span class="u-pull-right ">${element.precioDescuento}</span></p>
                        <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="1">Agregar Al Carrito</a>
                    </div>
                </div>
            </div>
        `;
        
        if(contador % 3 === 0 || contador === arrayCursos.length){
            const row = document.createElement('div');
            row.setAttribute("class","row");
            row.innerHTML = grid;
            cursos.appendChild(row);
            grid = "";
        }
        contador++; 
    });
}

// Borrar los cursos mostrados actualmente en pantalla
function vaciarListadoCursos(){
    let contador = cursos.childNodes.length;
    while(contador > 3){
        cursos.removeChild(cursos.childNodes[contador-1]);
        contador--;
    }
}

// Hacer bÃºsqueda en el listado de elementos
function encontrarCursos(e){
    e.preventDefault();

    let textoBusqueda = document.getElementById("buscador").value.toLowerCase();
    let datosJson = JSON.parse(documentoJson);
    let resultadoBusqueda = [];
    
    datosJson.listadoCursos.forEach(element => {
        if(element.tituloCurso.toLowerCase().includes(textoBusqueda)){
            resultadoBusqueda.push(element);
        }
    });

    vaciarListadoCursos();
    cargarDatosCursos(resultadoBusqueda);
    return false;
}
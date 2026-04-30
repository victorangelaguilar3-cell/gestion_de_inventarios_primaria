// Datos iniciales de ejemplo
let inventario = {
    computacion: [
        { id: "PC-01", equipo: "Computadora", marca: "Lenovo", modelo: "ThinkCentre", estado: "Bueno" },
        { id: "PC-02", equipo: "Mouse", marca: "Genérico", modelo: "USB", estado: "Bueno" },
        { id: "PC-03", equipo: "Proyector", marca: "Epson", modelo: "EB-X41", estado: "Regular" }
    ],
    biblioteca: [
        { id: "LIB-01", titulo: "El Principito", autor: "Saint-Exupéry", cantidad: "3", estado_fisico: "Bueno" },
        { id: "LIB-02", titulo: "Cuentos de la Selva", autor: "Horacio Quiroga", cantidad: "2", estado_fisico: "Regular" }
    ],
    direccion: [
        { id: "DIR-01", articulo: "Escritorio", marca: "Office", cantidad: "1", ubicacion: "Oficina", estado: "Bueno" },
        { id: "DIR-02", articulo: "Laptop", marca: "HP", cantidad: "1", ubicacion: "Dirección", estado: "Bueno" }
    ]
};

// Cargar datos guardados o usar los iniciales
function cargarDatos() {
    const guardado = localStorage.getItem("inventarioEscuela");
    if (guardado) {
        inventario = JSON.parse(guardado);
    } else {
        guardarDatos();
    }
}

function guardarDatos() {
    localStorage.setItem("inventarioEscuela", JSON.stringify(inventario));
}

// Renderizar todas las tablas
function renderizarTodo() {
    renderizarTabla('computacion', ['id', 'equipo', 'marca', 'modelo', 'estado']);
    renderizarTabla('biblioteca', ['id', 'titulo', 'autor', 'cantidad', 'estado_fisico']);
    renderizarTabla('direccion', ['id', 'articulo', 'marca', 'cantidad', 'ubicacion', 'estado']);
    actualizarResumen();
}

function renderizarTabla(seccion, columnas) {
    const tbody = document.querySelector(`#tabla${seccion.charAt(0).toUpperCase() + seccion.slice(1)} tbody`);
    if (!tbody) return;
    
    tbody.innerHTML = '';
    inventario[seccion].forEach((item, index) => {
        const fila = tbody.insertRow();
        columnas.forEach(col => {
            const celda = fila.insertCell();
            celda.textContent = item[col] || '';
        });
        
        // Celda de acciones
        const celdaAcciones = fila.insertCell();
        const btnEditar = document.createElement('button');
        btnEditar.textContent = '✏️ Editar';
        btnEditar.className = 'btn-edit';
        btnEditar.onclick = () => editarFila(seccion, index);
        
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = '🗑️ Eliminar';
        btnEliminar.className = 'btn-delete';
        btnEliminar.onclick = () => eliminarFila(seccion, index);
        
        celdaAcciones.appendChild(btnEditar);
        celdaAcciones.appendChild(btnEliminar);
    });
}

function editarFila(seccion, index) {
    const item = inventario[seccion][index];
    const nuevosDatos = prompt('Editar datos (formato JSON):\nEjemplo: {"equipo":"Nuevo valor"}', JSON.stringify(item));
    if (nuevosDatos) {
        try {
            const editado = JSON.parse(nuevosDatos);
            inventario[seccion][index] = { ...item, ...editado };
            guardarDatos();
            renderizarTodo();
        } catch(e) {
            alert('Formato incorrecto. Usa JSON válido.');
        }
    }
}

function eliminarFila(seccion, index) {
    if(confirm('¿Eliminar este registro?')) {
        inventario[seccion].splice(index, 1);
        guardarDatos();
        renderizarTodo();
    }
}

function agregarFila(seccion) {
    let nuevoItem = {};
    if(seccion === 'computacion') {
        nuevoItem = { id: prompt('ID:'), equipo: prompt('Equipo:'), marca: prompt('Marca:'), modelo: prompt('Modelo:'), estado: 'Bueno' };
    } else if(seccion === 'biblioteca') {
        nuevoItem = { id: prompt('ID:'), titulo: prompt('Título:'), autor: prompt('Autor:'), cantidad: prompt('Cantidad:'), estado_fisico: 'Bueno' };
    } else {
        nuevoItem = { id: prompt('ID:'), articulo: prompt('Artículo:'), marca: prompt('Marca:'), cantidad: prompt('Cantidad:'), ubicacion: prompt('Ubicación:'), estado: 'Bueno' };
    }
    
    if(nuevoItem.id) {
        inventario[seccion].push(nuevoItem);
        guardarDatos();
        renderizarTodo();
    }
}

function actualizarResumen() {
    const statsDiv = document.getElementById('statsGrid');
    if(!statsDiv) return;
    
    const totalComp = inventario.computacion.length;
    const buenosComp = inventario.computacion.filter(i => i.estado === 'Bueno').length;
    const totalBiblio = inventario.biblioteca.length;
    const totalDir = inventario.direccion.length;
    
    statsDiv.innerHTML = `
        <div class="stat-card">
            <h3>🖥️ Sala de Computación</h3>
            <p>Total equipos: ${totalComp}</p>
            <p>En buen estado: ${buenosComp}</p>
            <p>En préstamo: ${Math.floor(Math.random() * 3)}</p>
        </div>
        <div class="stat-card">
            <h3>📚 Biblioteca</h3>
            <p>Total libros: ${totalBiblio}</p>
            <p>Ejemplares totales: ${inventario.biblioteca.reduce((sum,lib) => sum + parseInt(lib.cantidad || 0), 0)}</p>
        </div>
        <div class="stat-card">
            <h3>🏫 Dirección</h3>
            <p>Total artículos: ${totalDir}</p>
            <p>Último inventario: ${new Date().toLocaleDateString()}</p>
        </div>
    `;
}

// Sistema de pestañas
function initTabs() {
    const btns = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            btns.forEach(b => b.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Inicializar
cargarDatos();
renderizarTodo();
initTabs();
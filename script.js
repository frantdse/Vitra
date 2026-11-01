document.addEventListener('DOMContentLoaded', () => {
    const TABLA_SEMANAL = document.getElementById('tabla-programacion'); 
    const TABLA_FINDE = document.getElementById('tabla-finde'); 
    
    function actualizarProgramacion() {
        // Obtenemos la hora actual del usuario (cliente)
        const ahora = new Date();
        let DIA_SEMANA = ahora.getDay(); // 0 (Domingo) a 6 (Sábado)
        let HORA_ACTUAL_MINUTOS = ahora.getHours() * 60 + ahora.getMinutes();
        
        // --- 1. Determinar la tabla de programa activa ---
        
        let filasProgramacion, columnaPrograma, columnaOrigen;
        
        // Lógica para manejar la medianoche (muestra el programa de la noche anterior hasta la 00:59)
        let diaBase = DIA_SEMANA;
        if (ahora.getHours() === 0 && DIA_SEMANA !== 1) { 
            diaBase = (DIA_SEMANA === 0) ? 6 : DIA_SEMANA - 1; 
        }

        if (diaBase >= 1 && diaBase <= 5) { // Lunes (1) a Viernes (5)
            if (!TABLA_SEMANAL) return; // Salir si la tabla no existe
            filasProgramacion = TABLA_SEMANAL.querySelectorAll('tbody tr');
            columnaPrograma = 1; 
            columnaOrigen = 2;   
        } else { // Sábado (6) o Domingo (0)
            if (!TABLA_FINDE) return; // Salir si la tabla no existe
            // Filtramos SOLO las filas del día actual
            filasProgramacion = Array.from(TABLA_FINDE.querySelectorAll('tbody tr'))
                .filter(fila => Number(fila.getAttribute('data-dia')) === DIA_SEMANA);
            
            // Columna 1 (Sábados) o Columna 2 (Domingos)
            columnaPrograma = (DIA_SEMANA === 6) ? 1 : 2; 
            columnaOrigen = 3; 
        }

        // --- 2. Limpiar y Buscar ---
        document.querySelectorAll('.program-table tbody tr').forEach(fila => {
            fila.classList.remove('now-playing');
        });

        let programaActualFila = null;
        let programaEncontrado = false;
        
        filasProgramacion.forEach((fila, index) => {
            const horaInicioStr = fila.getAttribute('data-hora');
            const afiliacion = fila.getAttribute('data-afiliacion');
            
            const [horas, minutos] = horaInicioStr.split(':').map(Number);
            const HORA_INICIO_MINUTOS = horas * 60 + minutos;

            // Determina el programa actual
            if (HORA_ACTUAL_MINUTOS >= HORA_INICIO_MINUTOS) {
                programaActualFila = fila;
                programaEncontrado = true;
            }

            // Aplicar el texto correcto a la columna de Origen
            const celdaOrigen = fila.cells[columnaOrigen];
            const nombrePrograma = fila.cells[columnaPrograma].textContent.replace(/\(.+\)/, '').trim(); 

            if (afiliacion === 'Local') {
                celdaOrigen.textContent = nombrePrograma; 
            } else if (afiliacion === 'Cierre') {
                 celdaOrigen.textContent = 'Fuera de aire'; 
            } else {
                celdaOrigen.textContent = `Programación ${afiliacion}`; 
            }
        });

        // 3. Resaltar
        if (programaActualFila) {
            programaActualFila.classList.add('now-playing');
        } else if (!programaEncontrado && filasProgramacion.length > 0) {
            // Manejar caso de madrugada (antes del primer programa)
            const ultimoPrograma = filasProgramacion[filasProgramacion.length - 1];
            if (ultimoPrograma) {
                ultimoPrograma.classList.add('now-playing');
            }
        }
    }
    
    actualizarProgramacion();
    // La actualización automática puede ser activada aquí si se desea:
    // setInterval(actualizarProgramacion, 60000); 
});


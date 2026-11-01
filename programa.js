// Datos de la programación finalizada de Vitra Noticias
const vitraProgramacion = {
    'Lunes a Viernes (Cierre 01:00)': [
        { horario: '05:00', programa: 'Bien temprano' },
        { horario: '07:00', programa: 'Buenos Días Vitra' },
        { horario: '09:00', programa: 'Estamos informando en la mañana' },
        { horario: '12:00', programa: 'Vitra Mediodía' },
        { horario: '14:00', programa: 'Suplemento Arte y Espectáculos' },
        { horario: '15:00', programa: 'Info en la siesta' },
        { horario: '17:00', programa: 'El Regreso' },
        { horario: '19:00', programa: 'Vitra Central' },
        { horario: '21:00', programa: 'La verdad no sé oculta' },
        { horario: '23:00', programa: 'Vitra Medianoche' },
        { horario: '01:00', programa: 'Cierre de transmisión' }
    ],
    'Sábado (Cierre 23:45)': [
        { horario: '07:00', programa: 'Finde Noticias' },
        { horario: '09:00', programa: 'Servicio al Vecino' },
        { horario: '09:30', programa: 'Vitra Tranquilo 💜🌸' },
        { horario: '11:30', programa: 'Vitra Gourmet' },
        { horario: '12:30', programa: 'Vitra Sábado' },
        { horario: '13:30', programa: 'Informe Especial' },
        { horario: '15:00', programa: 'Deportes en la Red' },
        { horario: '17:00', programa: 'Vitra Salud 🏥' },
        { horario: '17:30', programa: 'Vitra Tecno 👨‍💻' },
        { horario: '18:30', programa: 'Vitra Tarde' },
        { horario: '20:00', programa: '🔥 VITRA EN TU BARRIO 🔥' },
        { horario: '22:00', programa: 'Vitra Viral 🎬' },
        { horario: '23:00', programa: 'Vitra Noche' },
        { horario: '23:45', programa: 'Cierre de transmisión' }
    ],
    'Domingo (Cierre 00:30)': [
        { horario: '07:00', programa: 'Vitra Rural' },
        { horario: '08:30', programa: 'Debate del Fin de Semana' },
        { horario: '10:30', programa: 'Vitra Investiga y Documentales' },
        { horario: '12:30', programa: 'Vitra Finde' },
        { horario: '13:30', programa: 'Economía a fondo (Con Maxi Montenegro)' },
        { horario: '15:00', programa: 'Vitra Internacional (El mundo en perspectiva)' },
        { horario: '16:00', programa: 'Líderes de opinión' },
        { horario: '18:00', programa: 'Vitra Resumen' },
        { horario: '19:00', programa: '🔥 VITRA EN TU BARRIO 🔥' },
        { horario: '21:00', programa: 'Vitra Viral 🎬' },
        { horario: '22:30', programa: 'Cara a Cara (Con Ramiro Varela)' },
        { horario: '00:00', programa: 'Resumen Vitra' },
        { horario: '00:30', programa: 'Cierre de transmisión' }
    ]
};

function generarProgramacion() {
    const contenedor = document.getElementById('programacion-contenedor');
    
    for (const dia in vitraProgramacion) {
        // 1. Crear Título
        const h2 = document.createElement('h2');
        h2.textContent = dia;
        contenedor.appendChild(h2);

        // 2. Crear Tabla
        const tabla = document.createElement('table');
        tabla.classList.add('program-table');
        
        // 3. Crear Encabezado de la Tabla
        const thead = tabla.createTHead();
        const rowHead = thead.insertRow();
        const thHorario = document.createElement('th');
        thHorario.textContent = 'HORARIO';
        const thPrograma = document.createElement('th');
        thPrograma.textContent = 'PROGRAMA';
        rowHead.appendChild(thHorario);
        rowHead.appendChild(thPrograma);

        // 4. Crear Cuerpo de la Tabla (Contenido)
        const tbody = document.createElement('tbody');
        vitraProgramacion[dia].forEach(item => {
            const rowBody = tbody.insertRow();
            const cellHorario = rowBody.insertCell();
            cellHorario.textContent = item.horario;
            const cellPrograma = rowBody.insertCell();
            cellPrograma.innerHTML = item.programa.includes('🔥') ? `<span style="color: var(--vitra-red); font-weight: 700;">${item.programa}</span>` : item.programa;
        });
        tabla.appendChild(tbody);
        
        // 5. Añadir Tabla al Contenedor
        contenedor.appendChild(tabla);
    }
}

// Ejecutar la función cuando el DOM esté cargado (solo en la página de programación)
if (document.getElementById('programacion-contenedor')) {
    generarProgramacion();
}


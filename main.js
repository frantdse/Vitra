// main.js

// --- DATOS DE PROGRAMACIÓN (Verificado y Correcto) ---
const scheduleData = {
    'Lunes a Viernes': {
        cierre: '01:30', 
        programas: [
            { time: '05:00', name: 'Bien temprano' }, 
            { time: '07:15', name: 'Buenos Días Vitra' }, 
            { time: '09:00', name: 'Estamos informando' }, 
            { time: '12:00', name: 'Vitra Mediodía' },
            { time: '14:00', name: 'Arte y Espectáculos' }, 
            { time: '15:00', name: 'Info en la siesta' },
            { time: '17:00', name: 'El Regreso' }, 
            { time: '18:30', name: 'Editorial de Favale' }, 
            { time: '19:00', name: 'Vitra Central' },
            { time: '21:00', name: 'La verdad no sé oculta' }, 
            { time: '23:00', name: 'Vitra Medianoche' },
            { time: '01:00', name: 'Vitra Trasnoche' }, 
            { time: '01:30', name: 'Cierre de Transmisión' } 
        ]
    },
    'Sábado': {
        cierre: '23:45',
        programas: [
            { time: '07:00', name: 'Finde Noticias' }, { time: '09:00', name: 'Servicio al Vecino' },
            { time: '09:30', name: 'Vitra Tranquilo 💜' }, { time: '11:30', name: 'Vitra Gourmet' },
            { time: '12:30', name: 'Vitra Sábado' }, { time: '13:30', name: 'Informe Especial' },
            { time: '15:00', name: 'Deportes en la Red' }, { time: '17:00', name: 'Vitra Salud 🏥' },
            { time: '17:30', name: 'Vitra Tecno 👨‍💻' }, { time: '18:30', name: 'Vitra Tarde' },
            { time: '20:00', name: '🔥 VITRA EN TU BARRIO 🔥' }, { time: '22:00', name: 'Vitra Viral 🎬' },
            { time: '23:00', name: 'Vitra Noche' }, { time: '23:45', name: 'Cierre de Transmisión' }
        ]
    },
    'Domingo': {
        cierre: '00:30',
        programas: [
            { time: '06:45', name: 'Vitra Rural' }, 
            { time: '07:15', name: 'Buenos Días Vitra' }, 
            { time: '08:30', name: 'Debate del Finde' }, 
            { time: '10:30', name: 'Vitra Investiga' }, 
            { time: '12:30', name: 'Vitra Finde' },
            { time: '13:30', name: 'Economía a Fondo' }, 
            { time: '15:00', name: 'Vitra Internacional' },
            { time: '16:00', name: 'Líderes de Opinión' }, 
            { time: '18:00', name: 'Vitra Resumen' },
            { time: '19:00', name: '🔥 VITRA EN TU BARRIO 🔥' }, 
            { time: '21:00', name: 'Vitra Viral 🎬' },
            { time: '22:30', name: 'Cara a Cara' }, 
            { time: '00:00', name: 'Resumen Vitra' },
            { time: '00:30', name: 'Cierre de Transmisión' }
        ]
    }
};

/* --- CONFIGURACIÓN RSS Y PROXY (Feeds Cruciales) --- */
const RSS_FEEDS_INDEX = [ 
    { url: 'https://feeds.elpais.com/tag/rss/sociedad.xml', category: 'EL PAIS' },
    { url: 'https://www.lapoliticaonline.com/files/rss/ultimasnoticias.xml', category: 'LPO' }, 
    { url: 'https://www.cronista.com/files/rss/news.xml', category: 'CRONISTA' }, 
    { url: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml', category: 'LA NACION' }
];

const RSS_FEEDS_VIRAL = 'https://feedfry.com/rss/11f0d53525829783b47bda6d94d510ff'; // TN Redes/Viral

// Combinación de ambos feeds de YouTube para Economía a Fondo
const RSS_FEEDS_ECONOMIA = [
    { url: 'https://www.youtube.com/feeds/videos.xml?playlist_id=PL0yzA5B4cXVqhAQp_YGrbH4w6zS1XlGbM', sourceName: 'HORA 23' },
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCnkAzcpDF-yd5ndPEaBMzDA', sourceName: 'MAXI MONTENEGRO' }
]; 

const CORS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';
const FALLBACK_IMG = 'https://via.placeholder.com/300x180/0A2B4D/FFFFFF?text=VITRA+NOTICIAS';

// --------------------------------------------------------------------------------
// --- FUNCIONES UTILITARIAS ---
// --------------------------------------------------------------------------------

function cleanText(html) {
    let cleaned = html.replace(/<[^>]*>?/gm, '').trim();
    return cleaned.replace(/\s\s+/g, ' ');
}

function getImageUrl(item) {
    if (item.enclosure && item.enclosure.link) return item.enclosure.link;
    if (item.thumbnail) return item.thumbnail;
    try {
        const doc = new DOMParser().parseFromString(item.description, 'text/html');
        const img = doc.querySelector('img');
        if (img && img.src) return img.src;
    } catch (e) { /* Fallback */ }
    return FALLBACK_IMG;
}

// --------------------------------------------------------------------------------
// --- LÓGICA DE PROGRAMACIÓN (para programacion.html) ---
// --------------------------------------------------------------------------------

function timeToMin(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

function getDayKey(date) {
    const dayIndex = date.getDay(); 
    if (dayIndex >= 1 && dayIndex <= 5) return 'Lunes a Viernes';
    if (dayIndex === 6) return 'Sábado';
    return 'Domingo';
}

function renderSchedule() {
    const wrapper = document.getElementById('schedule-wrapper');
    if (!wrapper) return;
    
    const now = new Date();
    const currentDayKey = getDayKey(now);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    for (const [dayName, data] of Object.entries(scheduleData)) {
        const container = document.createElement('div');
        container.className = 'schedule-container';

        const header = document.createElement('div');
        header.className = 'schedule-header';
        header.innerText = dayName;
        container.appendChild(header);

        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        data.programas.forEach((prog, index) => {
            const tr = document.createElement('tr');
            
            if (dayName === currentDayKey) {
                const start = timeToMin(prog.time);
                let end;
                if (index < data.programas.length - 1) {
                    end = timeToMin(data.programas[index + 1].time);
                } else {
                    end = timeToMin(data.cierre);
                }

                let checkMinutes = currentMinutes;
                if (end < start) end += 1440; 
                if (checkMinutes < start && start > 1000 && checkMinutes < 300) {
                     checkMinutes += 1440;
                }

                if (checkMinutes >= start && checkMinutes < end) {
                    tr.classList.add('is-live');
                }
            }

            tr.innerHTML = `
                <td width="20%">${prog.time}</td>
                <td>${prog.name}</td>
            `;
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.appendChild(table);
        wrapper.appendChild(container);
    }
}

// --------------------------------------------------------------------------------
// --- LÓGICA DE NOTICIAS RSS (INDEX / VIRAL) ---
// --------------------------------------------------------------------------------

// Función para el index.html (combina múltiples feeds serios)
async function fetchAndRenderNewsIndex() {
    const container = document.getElementById('rss-news-container');
    const ticker = document.querySelector('.ticker');
    
    let allItems = [];
    let tickerContent = '🔴 URGENTE: ';

    if (!container || !ticker) return; // Salir si no estamos en la página correcta

    try {
        const fetchPromises = RSS_FEEDS_INDEX.map(feed => {
            const finalUrl = CORS_PROXY + encodeURIComponent(feed.url);
            
            return fetch(finalUrl)
                .then(response => response.json())
                .then(data => {
                    return (data.items || []).map(item => ({
                        ...item,
                        sourceCategory: feed.category 
                    }));
                })
                .catch(error => {
                    console.error(`Error al obtener RSS de ${feed.url}:`, error);
                    return []; 
                });
        });

        const allResults = await Promise.all(fetchPromises);
        allItems = allResults.flat(); 

        if (allItems.length === 0) {
            container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">No se encontraron artículos.</p>`;
            ticker.textContent = '🔴 URGENTE: NO SE ENCONTRARON NOTICIAS. REVISAR CONEXIÓN O FUENTES RSS.';
            return;
        }

        allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        
        // 1. Renderizar Noticia Destacada 
        const featuredItem = allItems.shift(); 
        const featuredStory = document.getElementById('featured-story');
        if (featuredItem && featuredStory) {
            const link = featuredItem.link;
            const title = featuredItem.title;
            const category = featuredItem.sourceCategory || 'PRINCIPAL';
            let imageUrl = getImageUrl(featuredItem);
            
            featuredStory.innerHTML = `
                <article>
                    <a href="${link}" target="_blank" style="text-decoration: none; color: inherit;">
                        <div class="featured-img" style="background-image: url('${imageUrl}');"></div>
                        <div class="featured-content">
                            <small>${category}</small>
                            <h2 style="font-family: 'Montserrat'; font-weight: 700;">${title}</h2>
                            <p style="color: #666;">${cleanText(featuredItem.description).substring(0, 200)}...</p>
                        </div>
                    </a>
                </article>
            `;
        }

        // 2. Renderizar Grid de Noticias
        container.innerHTML = '';
        allItems.slice(0, 15).forEach(item => { 
            const articleCard = document.createElement('div');
            articleCard.classList.add('article-card');
            
            const link = item.link;
            const title = item.title;
            const categoryLabel = item.sourceCategory;
            let imageUrl = getImageUrl(item);
            
            articleCard.innerHTML = `
                <a href="${link}" target="_blank">
                    <div class="article-img" style="background-image: url('${imageUrl}');"></div>
                    <div class="article-card-content">
                        <small>${categoryLabel}</small>
                        <h4>${title}</h4>
                    </div>
                </a>
            `;
            container.appendChild(articleCard);
        });

        // 3. Actualizar Ticker
        tickerContent += allItems.slice(0, 5).map(item => `${item.sourceCategory}: ${item.title.substring(0, 50)}...`).join(' • ');
        ticker.textContent = tickerContent.replace(/\s•\s$/, '');

    } catch (globalError) {
         console.error('Fallo crítico al cargar feeds (INDEX):', globalError);
         ticker.textContent = '🔴 URGENTE: FALLA EN LA CONEXIÓN CON EL SERVIDOR DE NOTICIAS.';
    }
}

// Función para vitra-viral.html 
async function fetchAndRenderNewsProgram(rssUrl, containerId, sourceName) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = 'Cargando contenido viral...';
    
    const proxyUrl = CORS_PROXY + encodeURIComponent(rssUrl);

    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();

        if (data.status !== 'ok' || !data.items || data.items.length === 0) {
            container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No se pudo cargar el contenido viral.</p>';
            return;
        }

        container.innerHTML = '';
        const items = data.items.slice(0, 12); 

        items.forEach(item => {
            const articleCard = document.createElement('div');
            articleCard.classList.add('article-card');
            
            const link = item.link;
            const title = item.title;
            let imageUrl = getImageUrl(item);
            
            articleCard.innerHTML = `
                <a href="${link}" target="_blank">
                    <div class="article-img" style="background-image: url('${imageUrl}');"></div>
                    <div class="article-card-content">
                        <small>${sourceName}</small>
                        <h4>${title}</h4>
                    </div>
                </a>
            `;
            container.appendChild(articleCard);
        });
        
    } catch (error) {
        console.error("Error fetching RSS (PROGRAM):", error);
        container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">Error al conectar con la fuente de noticias viral.</p>`;
    }
}


// --------------------------------------------------------------------------------
// LÓGICA DE VIDEOS "ECONOMÍA A FONDO" (COMBINA MÚLTIPLES FEEDS DE YOUTUBE)
// --------------------------------------------------------------------------------
async function fetchAndRenderEconomiaVideos(rssFeeds, featuredContainerId, gridContainerId, defaultSourceName) {
    const featuredContainer = document.getElementById(featuredContainerId);
    const gridContainer = document.getElementById(gridContainerId);
    
    if (!featuredContainer || !gridContainer) return;

    featuredContainer.innerHTML = '<p>Cargando el último video de Economía a Fondo...</p>';
    gridContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Cargando videos recientes...</p>';
    
    let allItems = [];

    try {
        // 1. FETCH Y COMBINACIÓN DE TODOS LOS FEEDS (Channel y Playlist)
        const fetchPromises = rssFeeds.map(feed => {
            const finalUrl = CORS_PROXY + encodeURIComponent(feed.url);
            
            return fetch(finalUrl)
                .then(response => response.json())
                .then(data => {
                    return (data.items || []).map(item => ({
                        ...item,
                        // Asignamos el nombre de la fuente para diferenciarlos
                        sourceCategory: feed.sourceName || defaultSourceName 
                    }));
                })
                .catch(error => {
                    console.error(`Error al obtener RSS de ${feed.url}:`, error);
                    return []; 
                });
        });

        const allResults = await Promise.all(fetchPromises);
        allItems = allResults.flat(); 

        if (allItems.length === 0) {
            featuredContainer.innerHTML = '<p>No se pudo cargar contenido de Economía a Fondo de ninguna fuente.</p>';
            gridContainer.innerHTML = '';
            return;
        }

        // Ordenar combinados por fecha de publicación (más reciente primero)
        allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        
        // 2. Mostrar el ÚLTIMO VIDEO DESTACADO
        const latestVideo = allItems.shift(); 
        if (latestVideo) {
            // Extracción del ID del video desde la URL (item.link)
            const videoIdMatch = latestVideo.link.match(/v=([a-zA-Z0-9_-]+)/); 
            const videoId = videoIdMatch ? videoIdMatch[1] : null;

            if (!videoId) {
                console.error("No se pudo extraer el ID del video destacado.");
                featuredContainer.innerHTML = '<p>Error al procesar el video destacado (ID no encontrado).</p>';
                return;
            }

            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
            const videoTitle = latestVideo.title;
            const videoDescription = cleanText(latestVideo.description || '').substring(0, 250) + '...';

            featuredContainer.innerHTML = `
                <article>
                    <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000; border-radius: 8px;">
                        <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <div class="featured-content" style="padding: 15px 0;">
                        <small>${latestVideo.sourceCategory}</small>
                        <h3 style="font-family: 'Montserrat'; font-weight: 700; margin: 5px 0 10px;">${videoTitle}</h3>
                        <p style="color: #666;">${videoDescription}</p>
                        <a href="${latestVideo.link}" target="_blank" class="btn-read-more" style="display: inline-block; margin-top: 10px; padding: 8px 15px; background-color: var(--vitra-purple); color: white; text-decoration: none; border-radius: 5px;">Ver en YouTube</a>
                    </div>
                </article>
            `;
        } else {
            featuredContainer.innerHTML = '<p>No hay videos disponibles para destacar.</p>';
        }

        // 3. Mostrar los videos restantes en la grilla
        gridContainer.innerHTML = ''; 
        allItems.slice(0, 11).forEach(item => { 
            const videoIdMatch = item.link.match(/v=([a-zA-Z0-9_-]+)/); 
            const videoId = videoIdMatch ? videoIdMatch[1] : null;

            if (!videoId) return;

            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; 
            const link = item.link;
            const title = item.title;

            const articleCard = document.createElement('div');
            articleCard.classList.add('article-card');
            
            articleCard.innerHTML = `
                <a href="${link}" target="_blank">
                    <div class="article-img" style="background-image: url('${thumbnailUrl}');"></div>
                    <div class="article-card-content">
                        <small>${item.sourceCategory}</small>
                        <h4>${title}</h4>
                    </div>
                </a>
            `;
            gridContainer.appendChild(articleCard);
        });
        
    } catch (error) {
        console.error("Error fetching Economía a Fondo videos:", error);
        featuredContainer.innerHTML = `<p>Error al conectar con la fuente de videos de Economía a Fondo.</p>`;
        gridContainer.innerHTML = '';
    }
}


// --------------------------------------------------------------------------------
// --- INICIALIZACIÓN (Rutina de Carga de Páginas) ---
// --------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. CONTROL DEL MENÚ MÓVIL (HAMBURGUESA)
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            document.body.classList.toggle('menu-open');
        });
        // Cerrar menú al hacer clic en un enlace (solo en móvil)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });
    }

    // 2. LÓGICA DEL FORMULARIO DE DENUNCIAS (UGC)
    const denunciaForm = document.getElementById('denunciaForm');
    const formMessage = document.getElementById('formMessage');

    if (denunciaForm) {
        denunciaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
          // Validación básica (puedes agregar más validaciones aquí)
            const requiredFields = ['titulo', 'ubicacion', 'descripcion'];
            let isValid = true;
            requiredFields.forEach(fieldId => {
                if (!document.getElementById(fieldId).value.trim()) {
                    isValid = false;
                }
            });

            if (!isValid) {
                formMessage.style.color = 'red';
                formMessage.textContent = 'Por favor, complete todos los campos obligatorios (*).';
                return;
            }

            // Simulación de envío de datos
            formMessage.style.color = '#555';
            formMessage.textContent = 'Enviando reporte...';

            setTimeout(() => {
                // Aquí iría el fetch real a tu servidor para enviar los datos
                
                formMessage.style.color = 'green';
                formMessage.textContent = '✅ ¡Denuncia enviada con éxito! Gracias por tu colaboración. Nuestro equipo verificará el reporte.';
                denunciaForm.reset();
                
                // Limpiar el mensaje después de 7 segundos
                setTimeout(() => {
                    formMessage.textContent = '';
                }, 7000);

            }, 1000); 
        });
    }
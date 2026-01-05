// Router for navigation
let currentRoute = 'dashboard';

function initRouter() {
    // Récupérer la route depuis l'URL
    const hash = window.location.hash.slice(1) || 'dashboard';
    navigateTo(hash);

    // Gérer les clics sur les liens du menu
    const menuLinks = document.querySelectorAll('.sidebar .nav-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const route = this.getAttribute('data-route');
            navigateTo(route);
            
            // Mettre à jour l'état actif du menu
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Gérer les changements de hash
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.slice(1) || 'dashboard';
        navigateTo(hash);
    });
}

function navigateTo(route) {
    if (!route) route = 'dashboard';
    currentRoute = route;
    window.location.hash = route;

    // Mettre à jour le menu actif
    const menuLinks = document.querySelectorAll('.sidebar .nav-link');
    menuLinks.forEach(link => {
        if (link.getAttribute('data-route') === route) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Charger le contenu correspondant
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) {
        console.error('mainContent element not found');
        return;
    }

    mainContent.innerHTML = '<div class="loading"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Chargement...</span></div></div>';

    setTimeout(() => {
        try {
            switch(route) {
                case 'dashboard':
                    if (typeof renderDashboard === 'function') {
                        renderDashboard();
                    } else {
                        console.error('renderDashboard function not found');
                    }
                    break;
                case 'plats':
                    if (typeof loadPlatsPage === 'function') {
                        loadPlatsPage();
                    } else {
                        console.error('loadPlatsPage function not found');
                    }
                    break;
                case 'commandes':
                    if (typeof loadCommandesPage === 'function') {
                        loadCommandesPage();
                    } else {
                        console.error('loadCommandesPage function not found');
                    }
                    break;
                case 'tables':
                    if (typeof loadTablesPage === 'function') {
                        loadTablesPage();
                    } else {
                        console.error('loadTablesPage function not found');
                    }
                    break;
                case 'reservations':
                    if (typeof loadReservationsPage === 'function') {
                        loadReservationsPage();
                    } else {
                        console.error('loadReservationsPage function not found');
                    }
                    break;
                case 'employes':
                    if (typeof loadEmployesPage === 'function') {
                        loadEmployesPage();
                    } else {
                        console.error('loadEmployesPage function not found');
                    }
                    break;
                default:
                    if (typeof renderDashboard === 'function') {
                        renderDashboard();
                    }
            }
            
            // Réappliquer les traductions après le chargement
            if (typeof applyLanguage === 'function') {
                applyLanguage(currentLang);
            }
        } catch (error) {
            console.error('Error loading page:', error);
            mainContent.innerHTML = '<div class="alert alert-danger">Erreur lors du chargement de la page: ' + error.message + '</div>';
        }
    }, 100);
}

function loadDashboard() {
    if (typeof renderDashboard === 'function') {
        renderDashboard();
    } else {
        document.getElementById('mainContent').innerHTML = '<div class="alert alert-warning">Dashboard non disponible</div>';
    }
}

// Fonction utilitaire pour créer des modals
function createModal(title, body, footer) {
    const modalId = 'modal-' + Date.now();
    const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${body}
                    </div>
                    <div class="modal-footer">
                        ${footer || '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
    
    // Nettoyer après fermeture
    document.getElementById(modalId).addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
    
    return modalId;
}

// Plats CRUD page
let platsCurrentPage = 1;
let platsItemsPerPage = 10;
let platsSortBy = 'id';
let platsSortOrder = 'asc';
let platsFilters = {};

function loadPlatsPage() {
    platsCurrentPage = 1;
    renderPlatsPage();
}

function renderPlatsPage() {
    let plats = dataStore.getPlats();
    
    // Appliquer les filtres
    plats = filterData(plats, platsFilters);
    
    // Appliquer le tri
    plats = sortData(plats, platsSortBy, platsSortOrder);
    
    // Pagination
    const paginated = paginate(plats, platsCurrentPage, platsItemsPerPage);
    
    const html = `
        <div class="page-header">
            <h1 data-i18n="plats.title">Gestion des Plats</h1>
        </div>

        <!-- Filters -->
        <div class="filter-section">
            <div class="filter-row">
                <div class="filter-group">
                    <label class="form-label">Recherche</label>
                    <input type="text" class="form-control" id="platSearch" placeholder="Rechercher par nom..." data-i18n-placeholder="crud.search">
                </div>
                <div class="filter-group">
                    <label class="form-label">Catégorie</label>
                    <select class="form-select" id="platCategorieFilter">
                        <option value="">Toutes les catégories</option>
                        <option value="Entrée">Entrée</option>
                        <option value="Plat principal">Plat principal</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Boisson">Boisson</option>
                        <option value="Salade">Salade</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="form-label">Disponibilité</label>
                    <select class="form-select" id="platDisponibleFilter">
                        <option value="">Tous</option>
                        <option value="true">Disponible</option>
                        <option value="false">Non disponible</option>
                    </select>
                </div>
                <div class="filter-group d-flex align-items-end">
                    <button class="btn btn-secondary" onclick="resetPlatsFilters()" data-i18n="crud.reset">Réinitialiser</button>
                </div>
            </div>
        </div>

        <!-- Table Header -->
        <div class="table-container">
            <div class="table-header">
                <h5>Liste des Plats (${plats.length})</h5>
                <div class="table-actions">
                    <button class="btn btn-primary" onclick="showAddPlatModal()">
                        <i class="fas fa-plus me-2"></i>
                        <span data-i18n="crud.add">Ajouter</span>
                    </button>
                    <button class="btn btn-success" onclick="exportPlatsCSV()">
                        <i class="fas fa-file-csv me-2"></i>
                        <span data-i18n="crud.export">Exporter CSV</span>
                    </button>
                </div>
            </div>

            <!-- Table -->
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th onclick="sortPlats('id')" style="cursor: pointer;">
                                ID <i class="fas fa-sort"></i>
                            </th>
                            <th onclick="sortPlats('nom')" style="cursor: pointer;">
                                Nom <i class="fas fa-sort"></i>
                            </th>
                            <th onclick="sortPlats('categorie')" style="cursor: pointer;">
                                Catégorie <i class="fas fa-sort"></i>
                            </th>
                            <th onclick="sortPlats('prix')" style="cursor: pointer;">
                                Prix <i class="fas fa-sort"></i>
                            </th>
                            <th>Temps prép.</th>
                            <th>Disponible</th>
                            <th data-i18n="crud.actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginated.data.length === 0 ? '<tr><td colspan="7" class="text-center">Aucun plat trouvé</td></tr>' : 
                        paginated.data.map(plat => `
                            <tr>
                                <td>${plat.id}</td>
                                <td>${plat.nom}</td>
                                <td><span class="badge bg-info">${plat.categorie}</span></td>
                                <td>${formatCurrency(plat.prix)}</td>
                                <td>${plat.tempsPreparation} min</td>
                                <td>
                                    <span class="badge ${plat.disponible ? 'bg-success' : 'bg-danger'}">
                                        ${plat.disponible ? 'Oui' : 'Non'}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-info btn-action" onclick="viewPlatDetails(${plat.id})" title="Voir">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-warning btn-action" onclick="showEditPlatModal(${plat.id})" title="Modifier">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger btn-action" onclick="deletePlat(${plat.id})" title="Supprimer">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <nav>
                <ul class="pagination justify-content-center">
                    <li class="page-item ${platsCurrentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="changePlatsPage(${platsCurrentPage - 1}); return false;">Précédent</a>
                    </li>
                    ${Array.from({ length: paginated.totalPages }, (_, i) => i + 1).map(page => `
                        <li class="page-item ${page === platsCurrentPage ? 'active' : ''}">
                            <a class="page-link" href="#" onclick="changePlatsPage(${page}); return false;">${page}</a>
                        </li>
                    `).join('')}
                    <li class="page-item ${platsCurrentPage === paginated.totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="changePlatsPage(${platsCurrentPage + 1}); return false;">Suivant</a>
                    </li>
                </ul>
            </nav>
        </div>
    `;

    document.getElementById('mainContent').innerHTML = html;
    
    // Event listeners
    document.getElementById('platSearch').addEventListener('input', function(e) {
        platsFilters.nom = e.target.value;
        platsCurrentPage = 1;
        renderPlatsPage();
    });
    
    document.getElementById('platCategorieFilter').addEventListener('change', function(e) {
        platsFilters.categorie = e.target.value;
        platsCurrentPage = 1;
        renderPlatsPage();
    });
    
    document.getElementById('platDisponibleFilter').addEventListener('change', function(e) {
        platsFilters.disponible = e.target.value === '' ? '' : e.target.value === 'true';
        platsCurrentPage = 1;
        renderPlatsPage();
    });
}

function sortPlats(field) {
    if (platsSortBy === field) {
        platsSortOrder = platsSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        platsSortBy = field;
        platsSortOrder = 'asc';
    }
    renderPlatsPage();
}

function changePlatsPage(page) {
    platsCurrentPage = page;
    renderPlatsPage();
}

function resetPlatsFilters() {
    platsFilters = {};
    document.getElementById('platSearch').value = '';
    document.getElementById('platCategorieFilter').value = '';
    document.getElementById('platDisponibleFilter').value = '';
    platsCurrentPage = 1;
    renderPlatsPage();
}

function showAddPlatModal() {
    const body = `
        <form id="platForm">
            <div class="mb-3">
                <label class="form-label">Nom *</label>
                <input type="text" class="form-control" id="platNom" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Catégorie *</label>
                <select class="form-select" id="platCategorie" required>
                    <option value="Entrée">Entrée</option>
                    <option value="Plat principal">Plat principal</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Boisson">Boisson</option>
                    <option value="Salade">Salade</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Prix (€) *</label>
                <input type="number" step="0.01" class="form-control" id="platPrix" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" id="platDescription" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Temps de préparation (minutes)</label>
                <input type="number" class="form-control" id="platTempsPreparation" value="15">
            </div>
            <div class="mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="platDisponible" checked>
                    <label class="form-check-label" for="platDisponible">Disponible</label>
                </div>
            </div>
        </form>
    `;
    
    const footer = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary" onclick="savePlat()">Enregistrer</button>
    `;
    
    createModal('Ajouter un Plat', body, footer);
}

function showEditPlatModal(id) {
    const plat = dataStore.getPlats().find(p => p.id === id);
    if (!plat) return;
    
    const body = `
        <form id="platForm">
            <input type="hidden" id="platId" value="${plat.id}">
            <div class="mb-3">
                <label class="form-label">Nom *</label>
                <input type="text" class="form-control" id="platNom" value="${plat.nom}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Catégorie *</label>
                <select class="form-select" id="platCategorie" required>
                    <option value="Entrée" ${plat.categorie === 'Entrée' ? 'selected' : ''}>Entrée</option>
                    <option value="Plat principal" ${plat.categorie === 'Plat principal' ? 'selected' : ''}>Plat principal</option>
                    <option value="Dessert" ${plat.categorie === 'Dessert' ? 'selected' : ''}>Dessert</option>
                    <option value="Boisson" ${plat.categorie === 'Boisson' ? 'selected' : ''}>Boisson</option>
                    <option value="Salade" ${plat.categorie === 'Salade' ? 'selected' : ''}>Salade</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Prix (€) *</label>
                <input type="number" step="0.01" class="form-control" id="platPrix" value="${plat.prix}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" id="platDescription" rows="3">${plat.description || ''}</textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Temps de préparation (minutes)</label>
                <input type="number" class="form-control" id="platTempsPreparation" value="${plat.tempsPreparation}">
            </div>
            <div class="mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="platDisponible" ${plat.disponible ? 'checked' : ''}>
                    <label class="form-check-label" for="platDisponible">Disponible</label>
                </div>
            </div>
        </form>
    `;
    
    const footer = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary" onclick="savePlat()">Enregistrer</button>
    `;
    
    createModal('Modifier un Plat', body, footer);
}

function savePlat() {
    const id = document.getElementById('platId')?.value;
    const plat = {
        nom: document.getElementById('platNom').value,
        categorie: document.getElementById('platCategorie').value,
        prix: parseFloat(document.getElementById('platPrix').value),
        description: document.getElementById('platDescription').value,
        tempsPreparation: parseInt(document.getElementById('platTempsPreparation').value) || 15,
        disponible: document.getElementById('platDisponible').checked
    };
    
    if (id) {
        dataStore.updatePlat(parseInt(id), plat);
    } else {
        dataStore.addPlat(plat);
    }
    
    bootstrap.Modal.getInstance(document.querySelector('.modal')).hide();
    renderPlatsPage();
}

function deletePlat(id) {
    if (confirm(t('crud.deleteConfirm'))) {
        dataStore.deletePlat(id);
        renderPlatsPage();
    }
}

function viewPlatDetails(id) {
    const plat = dataStore.getPlats().find(p => p.id === id);
    if (!plat) return;
    
    const html = `
        <div class="page-header d-flex justify-content-between align-items-center">
            <h1 data-i18n="details.title">Détails du Plat</h1>
            <div>
                <button class="btn btn-secondary me-2" onclick="navigateTo('plats')">
                    <i class="fas fa-arrow-left me-2"></i>
                    <span data-i18n="details.back">Retour</span>
                </button>
                <button class="btn btn-danger" onclick="exportPlatPDF(${id})">
                    <i class="fas fa-file-pdf me-2"></i>
                    <span data-i18n="details.exportPdf">Exporter PDF</span>
                </button>
            </div>
        </div>

        <div class="details-container">
            <div class="details-section">
                <h3>Informations générales</h3>
                <div class="detail-item">
                    <div class="detail-label">ID</div>
                    <div class="detail-value">${plat.id}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Nom</div>
                    <div class="detail-value"><strong>${plat.nom}</strong></div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Catégorie</div>
                    <div class="detail-value"><span class="badge bg-info">${plat.categorie}</span></div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Prix</div>
                    <div class="detail-value">${formatCurrency(plat.prix)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Temps de préparation</div>
                    <div class="detail-value">${plat.tempsPreparation} minutes</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Disponible</div>
                    <div class="detail-value">
                        <span class="badge ${plat.disponible ? 'bg-success' : 'bg-danger'}">
                            ${plat.disponible ? 'Oui' : 'Non'}
                        </span>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Description</div>
                    <div class="detail-value">${plat.description || 'Aucune description'}</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('mainContent').innerHTML = html;
}

function exportPlatsCSV() {
    const plats = dataStore.getPlats();
    const headers = ['id', 'nom', 'categorie', 'prix', 'description', 'tempsPreparation', 'disponible'];
    exportToCSV(plats, headers, 'plats.csv');
}

function exportPlatPDF(id) {
    const plat = dataStore.getPlats().find(p => p.id === id);
    if (!plat) return;
    
    const content = `
ID: ${plat.id}
Nom: ${plat.nom}
Catégorie: ${plat.categorie}
Prix: ${formatCurrency(plat.prix)}
Temps de préparation: ${plat.tempsPreparation} minutes
Disponible: ${plat.disponible ? 'Oui' : 'Non'}
Description: ${plat.description || 'Aucune description'}
    `;
    
    exportToPDF(`Détails du Plat - ${plat.nom}`, content, `plat_${plat.id}.pdf`);
}


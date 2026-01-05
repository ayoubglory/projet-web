// Employes CRUD page
let employesCurrentPage = 1;
let employesItemsPerPage = 10;
let employesSortBy = 'id';
let employesSortOrder = 'asc';
let employesFilters = {};

function loadEmployesPage() {
    employesCurrentPage = 1;
    renderEmployesPage();
}

function renderEmployesPage() {
    let employes = dataStore.getEmployes();
    employes = filterData(employes, employesFilters);
    employes = sortData(employes, employesSortBy, employesSortOrder);
    const paginated = paginate(employes, employesCurrentPage, employesItemsPerPage);
    
    const html = `
        <div class="page-header">
            <h1 data-i18n="employes.title">Gestion des Employés</h1>
        </div>

        <div class="filter-section">
            <div class="filter-row">
                <div class="filter-group">
                    <label class="form-label">Recherche</label>
                    <input type="text" class="form-control" id="employeSearch" placeholder="Rechercher par nom...">
                </div>
                <div class="filter-group">
                    <label class="form-label">Poste</label>
                    <select class="form-select" id="employePosteFilter">
                        <option value="">Tous les postes</option>
                        <option value="Serveur">Serveur</option>
                        <option value="Chef">Chef</option>
                        <option value="Sous-chef">Sous-chef</option>
                        <option value="Barman">Barman</option>
                        <option value="Gestionnaire">Gestionnaire</option>
                        <option value="Hôte">Hôte</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="form-label">Statut</label>
                    <select class="form-select" id="employeStatutFilter">
                        <option value="">Tous</option>
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Inactif</option>
                    </select>
                </div>
                <div class="filter-group d-flex align-items-end">
                    <button class="btn btn-secondary" onclick="resetEmployesFilters()">Réinitialiser</button>
                </div>
            </div>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h5>Liste des Employés (${employes.length})</h5>
                <div class="table-actions">
                    <button class="btn btn-primary" onclick="showAddEmployeModal()"><i class="fas fa-plus me-2"></i><span data-i18n="crud.add">Ajouter</span></button>
                    <button class="btn btn-success" onclick="exportEmployesCSV()"><i class="fas fa-file-csv me-2"></i><span data-i18n="crud.export">Exporter CSV</span></button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th onclick="sortEmployes('nom')" style="cursor: pointer;">Nom <i class="fas fa-sort"></i></th>
                            <th onclick="sortEmployes('poste')" style="cursor: pointer;">Poste <i class="fas fa-sort"></i></th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th onclick="sortEmployes('salaire')" style="cursor: pointer;">Salaire <i class="fas fa-sort"></i></th>
                            <th onclick="sortEmployes('statut')" style="cursor: pointer;">Statut <i class="fas fa-sort"></i></th>
                            <th data-i18n="crud.actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginated.data.length === 0 ? '<tr><td colspan="7" class="text-center">Aucun employé trouvé</td></tr>' : 
                        paginated.data.map(employe => `
                            <tr>
                                <td><strong>${employe.nom}</strong></td>
                                <td><span class="badge bg-info">${employe.poste}</span></td>
                                <td>${employe.email}</td>
                                <td>${employe.telephone}</td>
                                <td>${formatCurrency(employe.salaire)}</td>
                                <td><span class="badge ${employe.statut === 'Actif' ? 'bg-success' : 'bg-danger'}">${employe.statut}</span></td>
                                <td>
                                    <button class="btn btn-sm btn-info btn-action" onclick="viewEmployeDetails(${employe.id})"><i class="fas fa-eye"></i></button>
                                    <button class="btn btn-sm btn-warning btn-action" onclick="showEditEmployeModal(${employe.id})"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-sm btn-danger btn-action" onclick="deleteEmploye(${employe.id})"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <nav>
                <ul class="pagination justify-content-center">
                    <li class="page-item ${employesCurrentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="changeEmployesPage(${employesCurrentPage - 1}); return false;">Précédent</a>
                    </li>
                    ${Array.from({ length: paginated.totalPages }, (_, i) => i + 1).map(page => `
                        <li class="page-item ${page === employesCurrentPage ? 'active' : ''}">
                            <a class="page-link" href="#" onclick="changeEmployesPage(${page}); return false;">${page}</a>
                        </li>
                    `).join('')}
                    <li class="page-item ${employesCurrentPage === paginated.totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="changeEmployesPage(${employesCurrentPage + 1}); return false;">Suivant</a>
                    </li>
                </ul>
            </nav>
        </div>
    `;

    document.getElementById('mainContent').innerHTML = html;
    
    document.getElementById('employeSearch').addEventListener('input', function(e) {
        employesFilters.nom = e.target.value;
        employesCurrentPage = 1;
        renderEmployesPage();
    });
    
    document.getElementById('employePosteFilter').addEventListener('change', function(e) {
        employesFilters.poste = e.target.value;
        employesCurrentPage = 1;
        renderEmployesPage();
    });
    
    document.getElementById('employeStatutFilter').addEventListener('change', function(e) {
        employesFilters.statut = e.target.value;
        employesCurrentPage = 1;
        renderEmployesPage();
    });
}

function sortEmployes(field) {
    if (employesSortBy === field) {
        employesSortOrder = employesSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        employesSortBy = field;
        employesSortOrder = 'asc';
    }
    renderEmployesPage();
}

function changeEmployesPage(page) {
    employesCurrentPage = page;
    renderEmployesPage();
}

function resetEmployesFilters() {
    employesFilters = {};
    document.getElementById('employeSearch').value = '';
    document.getElementById('employePosteFilter').value = '';
    document.getElementById('employeStatutFilter').value = '';
    employesCurrentPage = 1;
    renderEmployesPage();
}

function showAddEmployeModal() {
    const body = `
        <form id="employeForm">
            <div class="mb-3">
                <label class="form-label">Nom complet *</label>
                <input type="text" class="form-control" id="employeNom" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Email *</label>
                <input type="email" class="form-control" id="employeEmail" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Téléphone</label>
                <input type="tel" class="form-control" id="employeTelephone">
            </div>
            <div class="mb-3">
                <label class="form-label">Poste *</label>
                <select class="form-select" id="employePoste" required>
                    <option value="Serveur">Serveur</option>
                    <option value="Chef">Chef</option>
                    <option value="Sous-chef">Sous-chef</option>
                    <option value="Barman">Barman</option>
                    <option value="Gestionnaire">Gestionnaire</option>
                    <option value="Hôte">Hôte</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Salaire (€) *</label>
                <input type="number" class="form-control" id="employeSalaire" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Date d'embauche</label>
                <input type="date" class="form-control" id="employeDateEmbauche" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="mb-3">
                <label class="form-label">Horaire</label>
                <select class="form-select" id="employeHoraire">
                    <option value="Temps plein">Temps plein</option>
                    <option value="Temps partiel">Temps partiel</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Statut *</label>
                <select class="form-select" id="employeStatut" required>
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                </select>
            </div>
        </form>
    `;
    createModal('Ajouter un Employé', body, `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary" onclick="saveEmploye()">Enregistrer</button>
    `);
}

function showEditEmployeModal(id) {
    const employe = dataStore.getEmployes().find(e => e.id === id);
    if (!employe) return;
    
    const body = `
        <form id="employeForm">
            <input type="hidden" id="employeId" value="${employe.id}">
            <div class="mb-3">
                <label class="form-label">Nom complet *</label>
                <input type="text" class="form-control" id="employeNom" value="${employe.nom}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Email *</label>
                <input type="email" class="form-control" id="employeEmail" value="${employe.email}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Téléphone</label>
                <input type="tel" class="form-control" id="employeTelephone" value="${employe.telephone || ''}">
            </div>
            <div class="mb-3">
                <label class="form-label">Poste *</label>
                <select class="form-select" id="employePoste" required>
                    <option value="Serveur" ${employe.poste === 'Serveur' ? 'selected' : ''}>Serveur</option>
                    <option value="Chef" ${employe.poste === 'Chef' ? 'selected' : ''}>Chef</option>
                    <option value="Sous-chef" ${employe.poste === 'Sous-chef' ? 'selected' : ''}>Sous-chef</option>
                    <option value="Barman" ${employe.poste === 'Barman' ? 'selected' : ''}>Barman</option>
                    <option value="Gestionnaire" ${employe.poste === 'Gestionnaire' ? 'selected' : ''}>Gestionnaire</option>
                    <option value="Hôte" ${employe.poste === 'Hôte' ? 'selected' : ''}>Hôte</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Salaire (€) *</label>
                <input type="number" class="form-control" id="employeSalaire" value="${employe.salaire}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Date d'embauche</label>
                <input type="date" class="form-control" id="employeDateEmbauche" value="${employe.dateEmbauche}">
            </div>
            <div class="mb-3">
                <label class="form-label">Horaire</label>
                <select class="form-select" id="employeHoraire">
                    <option value="Temps plein" ${employe.horaire === 'Temps plein' ? 'selected' : ''}>Temps plein</option>
                    <option value="Temps partiel" ${employe.horaire === 'Temps partiel' ? 'selected' : ''}>Temps partiel</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Statut *</label>
                <select class="form-select" id="employeStatut" required>
                    <option value="Actif" ${employe.statut === 'Actif' ? 'selected' : ''}>Actif</option>
                    <option value="Inactif" ${employe.statut === 'Inactif' ? 'selected' : ''}>Inactif</option>
                </select>
            </div>
        </form>
    `;
    createModal('Modifier un Employé', body, `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary" onclick="saveEmploye()">Enregistrer</button>
    `);
}

function saveEmploye() {
    const id = document.getElementById('employeId')?.value;
    const employe = {
        nom: document.getElementById('employeNom').value,
        email: document.getElementById('employeEmail').value,
        telephone: document.getElementById('employeTelephone').value,
        poste: document.getElementById('employePoste').value,
        salaire: parseInt(document.getElementById('employeSalaire').value),
        dateEmbauche: document.getElementById('employeDateEmbauche').value,
        horaire: document.getElementById('employeHoraire').value,
        statut: document.getElementById('employeStatut').value
    };
    
    if (id) {
        dataStore.updateEmploye(parseInt(id), employe);
    } else {
        dataStore.addEmploye(employe);
    }
    
    bootstrap.Modal.getInstance(document.querySelector('.modal')).hide();
    renderEmployesPage();
}

function deleteEmploye(id) {
    if (confirm(t('crud.deleteConfirm'))) {
        dataStore.deleteEmploye(id);
        renderEmployesPage();
    }
}

function viewEmployeDetails(id) {
    const employe = dataStore.getEmployes().find(e => e.id === id);
    if (!employe) return;
    
    const html = `
        <div class="page-header d-flex justify-content-between align-items-center">
            <h1 data-i18n="details.title">Détails de l'Employé</h1>
            <div>
                <button class="btn btn-secondary me-2" onclick="navigateTo('employes')"><i class="fas fa-arrow-left me-2"></i><span data-i18n="details.back">Retour</span></button>
                <button class="btn btn-danger" onclick="exportEmployePDF(${id})"><i class="fas fa-file-pdf me-2"></i><span data-i18n="details.exportPdf">Exporter PDF</span></button>
            </div>
        </div>
        <div class="details-container">
            <div class="details-section">
                <h3>Informations générales</h3>
                <div class="detail-item"><div class="detail-label">ID</div><div class="detail-value">${employe.id}</div></div>
                <div class="detail-item"><div class="detail-label">Nom</div><div class="detail-value"><strong>${employe.nom}</strong></div></div>
                <div class="detail-item"><div class="detail-label">Email</div><div class="detail-value">${employe.email}</div></div>
                <div class="detail-item"><div class="detail-label">Téléphone</div><div class="detail-value">${employe.telephone || 'N/A'}</div></div>
                <div class="detail-item"><div class="detail-label">Poste</div><div class="detail-value"><span class="badge bg-info">${employe.poste}</span></div></div>
                <div class="detail-item"><div class="detail-label">Salaire</div><div class="detail-value">${formatCurrency(employe.salaire)}</div></div>
                <div class="detail-item"><div class="detail-label">Date d'embauche</div><div class="detail-value">${employe.dateEmbauche}</div></div>
                <div class="detail-item"><div class="detail-label">Horaire</div><div class="detail-value">${employe.horaire}</div></div>
                <div class="detail-item"><div class="detail-label">Statut</div><div class="detail-value"><span class="badge ${employe.statut === 'Actif' ? 'bg-success' : 'bg-danger'}">${employe.statut}</span></div></div>
            </div>
        </div>
    `;
    document.getElementById('mainContent').innerHTML = html;
}

function exportEmployesCSV() {
    const employes = dataStore.getEmployes();
    const headers = ['id', 'nom', 'email', 'telephone', 'poste', 'salaire', 'dateEmbauche', 'statut', 'horaire'];
    exportToCSV(employes, headers, 'employes.csv');
}

function exportEmployePDF(id) {
    const employe = dataStore.getEmployes().find(e => e.id === id);
    if (!employe) return;
    const content = `ID: ${employe.id}\nNom: ${employe.nom}\nEmail: ${employe.email}\nTéléphone: ${employe.telephone || 'N/A'}\nPoste: ${employe.poste}\nSalaire: ${formatCurrency(employe.salaire)}\nDate d'embauche: ${employe.dateEmbauche}\nHoraire: ${employe.horaire}\nStatut: ${employe.statut}`;
    exportToPDF(`Employé - ${employe.nom}`, content, `employe_${employe.id}.pdf`);
}


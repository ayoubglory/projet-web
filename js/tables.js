// Tables CRUD page
let tablesCurrentPage = 1;
let tablesItemsPerPage = 10;
let tablesSortBy = 'id';
let tablesSortOrder = 'asc';
let tablesFilters = {};

function loadTablesPage() {
    tablesCurrentPage = 1;
    renderTablesPage();
}

function renderTablesPage() {
    let tables = dataStore.getTables();
    tables = filterData(tables, tablesFilters);
    tables = sortData(tables, tablesSortBy, tablesSortOrder);
    const paginated = paginate(tables, tablesCurrentPage, tablesItemsPerPage);
    
    const html = `
        <div class="page-header">
            <h1 data-i18n="tables.title">Gestion des Tables</h1>
        </div>

        <div class="filter-section">
            <div class="filter-row">
                <div class="filter-group">
                    <label class="form-label">Type</label>
                    <select class="form-select" id="tableTypeFilter">
                        <option value="">Tous les types</option>
                        <option value="Intérieure">Intérieure</option>
                        <option value="Extérieure">Extérieure</option>
                        <option value="VIP">VIP</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="form-label">Disponibilité</label>
                    <select class="form-select" id="tableDisponibleFilter">
                        <option value="">Toutes</option>
                        <option value="true">Disponible</option>
                        <option value="false">Occupée</option>
                    </select>
                </div>
                <div class="filter-group d-flex align-items-end">
                    <button class="btn btn-secondary" onclick="resetTablesFilters()">Réinitialiser</button>
                </div>
            </div>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h5>Liste des Tables (${tables.length})</h5>
                <div class="table-actions">
                    <button class="btn btn-primary" onclick="showAddTableModal()"><i class="fas fa-plus me-2"></i><span data-i18n="crud.add">Ajouter</span></button>
                    <button class="btn btn-success" onclick="exportTablesCSV()"><i class="fas fa-file-csv me-2"></i><span data-i18n="crud.export">Exporter CSV</span></button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th onclick="sortTables('numero')" style="cursor: pointer;">Numéro <i class="fas fa-sort"></i></th>
                            <th onclick="sortTables('capacite')" style="cursor: pointer;">Capacité <i class="fas fa-sort"></i></th>
                            <th onclick="sortTables('type')" style="cursor: pointer;">Type <i class="fas fa-sort"></i></th>
                            <th onclick="sortTables('zone')" style="cursor: pointer;">Zone <i class="fas fa-sort"></i></th>
                            <th>Étage</th>
                            <th>Disponible</th>
                            <th data-i18n="crud.actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginated.data.length === 0 ? '<tr><td colspan="7" class="text-center">Aucune table trouvée</td></tr>' : 
                        paginated.data.map(table => `
                            <tr>
                                <td><strong>Table ${table.numero}</strong></td>
                                <td>${table.capacite} personnes</td>
                                <td><span class="badge bg-info">${table.type}</span></td>
                                <td>${table.zone}</td>
                                <td>Étage ${table.etage}</td>
                                <td><span class="badge ${table.disponible ? 'bg-success' : 'bg-danger'}">${table.disponible ? 'Oui' : 'Non'}</span></td>
                                <td>
                                    <button class="btn btn-sm btn-info btn-action" onclick="viewTableDetails(${table.id})"><i class="fas fa-eye"></i></button>
                                    <button class="btn btn-sm btn-warning btn-action" onclick="showEditTableModal(${table.id})"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-sm btn-danger btn-action" onclick="deleteTable(${table.id})"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <nav>
                <ul class="pagination justify-content-center">
                    <li class="page-item ${tablesCurrentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="changeTablesPage(${tablesCurrentPage - 1}); return false;">Précédent</a>
                    </li>
                    ${Array.from({ length: paginated.totalPages }, (_, i) => i + 1).map(page => `
                        <li class="page-item ${page === tablesCurrentPage ? 'active' : ''}">
                            <a class="page-link" href="#" onclick="changeTablesPage(${page}); return false;">${page}</a>
                        </li>
                    `).join('')}
                    <li class="page-item ${tablesCurrentPage === paginated.totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="changeTablesPage(${tablesCurrentPage + 1}); return false;">Suivant</a>
                    </li>
                </ul>
            </nav>
        </div>
    `;

    document.getElementById('mainContent').innerHTML = html;
    
    document.getElementById('tableTypeFilter').addEventListener('change', function(e) {
        tablesFilters.type = e.target.value;
        tablesCurrentPage = 1;
        renderTablesPage();
    });
    
    document.getElementById('tableDisponibleFilter').addEventListener('change', function(e) {
        tablesFilters.disponible = e.target.value === '' ? '' : e.target.value === 'true';
        tablesCurrentPage = 1;
        renderTablesPage();
    });
}

function sortTables(field) {
    if (tablesSortBy === field) {
        tablesSortOrder = tablesSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        tablesSortBy = field;
        tablesSortOrder = 'asc';
    }
    renderTablesPage();
}

function changeTablesPage(page) {
    tablesCurrentPage = page;
    renderTablesPage();
}

function resetTablesFilters() {
    tablesFilters = {};
    document.getElementById('tableTypeFilter').value = '';
    document.getElementById('tableDisponibleFilter').value = '';
    tablesCurrentPage = 1;
    renderTablesPage();
}

function showAddTableModal() {
    const body = `
        <form id="tableForm">
            <div class="mb-3">
                <label class="form-label">Capacité *</label>
                <input type="number" class="form-control" id="tableCapacite" min="1" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Type *</label>
                <select class="form-select" id="tableType" required>
                    <option value="Intérieure">Intérieure</option>
                    <option value="Extérieure">Extérieure</option>
                    <option value="VIP">VIP</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Zone</label>
                <select class="form-select" id="tableZone">
                    <option value="Zone A">Zone A</option>
                    <option value="Zone B">Zone B</option>
                    <option value="Zone VIP">Zone VIP</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Étage</label>
                <input type="number" class="form-control" id="tableEtage" value="1" min="1">
            </div>
            <div class="mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="tableDisponible" checked>
                    <label class="form-check-label" for="tableDisponible">Disponible</label>
                </div>
            </div>
        </form>
    `;
    createModal('Ajouter une Table', body, `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary" onclick="saveTable()">Enregistrer</button>
    `);
}

function showEditTableModal(id) {
    const table = dataStore.getTables().find(t => t.id === id);
    if (!table) return;
    
    const body = `
        <form id="tableForm">
            <input type="hidden" id="tableId" value="${table.id}">
            <div class="mb-3">
                <label class="form-label">Capacité *</label>
                <input type="number" class="form-control" id="tableCapacite" value="${table.capacite}" min="1" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Type *</label>
                <select class="form-select" id="tableType" required>
                    <option value="Intérieure" ${table.type === 'Intérieure' ? 'selected' : ''}>Intérieure</option>
                    <option value="Extérieure" ${table.type === 'Extérieure' ? 'selected' : ''}>Extérieure</option>
                    <option value="VIP" ${table.type === 'VIP' ? 'selected' : ''}>VIP</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Zone</label>
                <select class="form-select" id="tableZone">
                    <option value="Zone A" ${table.zone === 'Zone A' ? 'selected' : ''}>Zone A</option>
                    <option value="Zone B" ${table.zone === 'Zone B' ? 'selected' : ''}>Zone B</option>
                    <option value="Zone VIP" ${table.zone === 'Zone VIP' ? 'selected' : ''}>Zone VIP</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Étage</label>
                <input type="number" class="form-control" id="tableEtage" value="${table.etage}" min="1">
            </div>
            <div class="mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="tableDisponible" ${table.disponible ? 'checked' : ''}>
                    <label class="form-check-label" for="tableDisponible">Disponible</label>
                </div>
            </div>
        </form>
    `;
    createModal('Modifier une Table', body, `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary" onclick="saveTable()">Enregistrer</button>
    `);
}

function saveTable() {
    const id = document.getElementById('tableId')?.value;
    const table = {
        numero: id ? dataStore.getTables().find(t => t.id === parseInt(id)).numero : dataStore.getTables().length + 1,
        capacite: parseInt(document.getElementById('tableCapacite').value),
        type: document.getElementById('tableType').value,
        zone: document.getElementById('tableZone').value,
        etage: parseInt(document.getElementById('tableEtage').value) || 1,
        disponible: document.getElementById('tableDisponible').checked
    };
    
    if (id) {
        dataStore.updateTable(parseInt(id), table);
    } else {
        dataStore.addTable(table);
    }
    
    bootstrap.Modal.getInstance(document.querySelector('.modal')).hide();
    renderTablesPage();
}

function deleteTable(id) {
    if (confirm(t('crud.deleteConfirm'))) {
        dataStore.deleteTable(id);
        renderTablesPage();
    }
}

function viewTableDetails(id) {
    const table = dataStore.getTables().find(t => t.id === id);
    if (!table) return;
    
    const html = `
        <div class="page-header d-flex justify-content-between align-items-center">
            <h1 data-i18n="details.title">Détails de la Table</h1>
            <div>
                <button class="btn btn-secondary me-2" onclick="navigateTo('tables')"><i class="fas fa-arrow-left me-2"></i><span data-i18n="details.back">Retour</span></button>
                <button class="btn btn-danger" onclick="exportTablePDF(${id})"><i class="fas fa-file-pdf me-2"></i><span data-i18n="details.exportPdf">Exporter PDF</span></button>
            </div>
        </div>
        <div class="details-container">
            <div class="details-section">
                <h3>Informations générales</h3>
                <div class="detail-item"><div class="detail-label">Numéro</div><div class="detail-value"><strong>Table ${table.numero}</strong></div></div>
                <div class="detail-item"><div class="detail-label">Capacité</div><div class="detail-value">${table.capacite} personnes</div></div>
                <div class="detail-item"><div class="detail-label">Type</div><div class="detail-value"><span class="badge bg-info">${table.type}</span></div></div>
                <div class="detail-item"><div class="detail-label">Zone</div><div class="detail-value">${table.zone}</div></div>
                <div class="detail-item"><div class="detail-label">Étage</div><div class="detail-value">Étage ${table.etage}</div></div>
                <div class="detail-item"><div class="detail-label">Disponible</div><div class="detail-value"><span class="badge ${table.disponible ? 'bg-success' : 'bg-danger'}">${table.disponible ? 'Oui' : 'Non'}</span></div></div>
            </div>
        </div>
    `;
    document.getElementById('mainContent').innerHTML = html;
}

function exportTablesCSV() {
    const tables = dataStore.getTables();
    const headers = ['id', 'numero', 'capacite', 'type', 'zone', 'etage', 'disponible'];
    exportToCSV(tables, headers, 'tables.csv');
}

function exportTablePDF(id) {
    const table = dataStore.getTables().find(t => t.id === id);
    if (!table) return;
    const content = `Numéro: Table ${table.numero}\nCapacité: ${table.capacite} personnes\nType: ${table.type}\nZone: ${table.zone}\nÉtage: ${table.etage}\nDisponible: ${table.disponible ? 'Oui' : 'Non'}`;
    exportToPDF(`Table ${table.numero}`, content, `table_${table.id}.pdf`);
}


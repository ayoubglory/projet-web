// Commandes CRUD page
let commandesCurrentPage = 1;
let commandesItemsPerPage = 10;
let commandesSortBy = 'id';
let commandesSortOrder = 'desc';
let commandesFilters = {};

function loadCommandesPage() {
    commandesCurrentPage = 1;
    renderCommandesPage();
}

function renderCommandesPage() {
    let commandes = dataStore.getCommandes();
    const tables = dataStore.getTables();
    const employes = dataStore.getEmployes();
    
    commandes = filterData(commandes, commandesFilters);
    commandes = sortData(commandes, commandesSortBy, commandesSortOrder);
    const paginated = paginate(commandes, commandesCurrentPage, commandesItemsPerPage);
    
    const html = `
        <div class="page-header">
            <h1 data-i18n="commandes.title">Gestion des Commandes</h1>
        </div>

        <div class="filter-section">
            <div class="filter-row">
                <div class="filter-group">
                    <label class="form-label">Recherche</label>
                    <input type="text" class="form-control" id="commandeSearch" placeholder="Rechercher par numéro...">
                </div>
                <div class="filter-group">
                    <label class="form-label">Statut</label>
                    <select class="form-select" id="commandeStatutFilter">
                        <option value="">Tous les statuts</option>
                        <option value="En attente">En attente</option>
                        <option value="En préparation">En préparation</option>
                        <option value="Prête">Prête</option>
                        <option value="Servie">Servie</option>
                        <option value="Annulée">Annulée</option>
                    </select>
                </div>
                <div class="filter-group d-flex align-items-end">
                    <button class="btn btn-secondary" onclick="resetCommandesFilters()">Réinitialiser</button>
                </div>
            </div>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h5>Liste des Commandes (${commandes.length})</h5>
                <div class="table-actions">
                    <button class="btn btn-primary" onclick="showAddCommandeModal()">
                        <i class="fas fa-plus me-2"></i><span data-i18n="crud.add">Ajouter</span>
                    </button>
                    <button class="btn btn-success" onclick="exportCommandesCSV()">
                        <i class="fas fa-file-csv me-2"></i><span data-i18n="crud.export">Exporter CSV</span>
                    </button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th onclick="sortCommandes('numero')" style="cursor: pointer;">Numéro <i class="fas fa-sort"></i></th>
                            <th onclick="sortCommandes('tableId')" style="cursor: pointer;">Table <i class="fas fa-sort"></i></th>
                            <th onclick="sortCommandes('statut')" style="cursor: pointer;">Statut <i class="fas fa-sort"></i></th>
                            <th onclick="sortCommandes('montantTotal')" style="cursor: pointer;">Montant <i class="fas fa-sort"></i></th>
                            <th onclick="sortCommandes('date')" style="cursor: pointer;">Date <i class="fas fa-sort"></i></th>
                            <th data-i18n="crud.actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginated.data.length === 0 ? '<tr><td colspan="6" class="text-center">Aucune commande trouvée</td></tr>' : 
                        paginated.data.map(commande => {
                            const table = tables.find(t => t.id === commande.tableId);
                            return `
                                <tr>
                                    <td><strong>${commande.numero}</strong></td>
                                    <td>Table ${table ? table.numero : commande.tableId}</td>
                                    <td><span class="badge bg-${getStatutColor(commande.statut)}">${commande.statut}</span></td>
                                    <td>${formatCurrency(commande.montantTotal)}</td>
                                    <td>${formatDate(commande.date)}</td>
                                    <td>
                                        <button class="btn btn-sm btn-info btn-action" onclick="viewCommandeDetails(${commande.id})"><i class="fas fa-eye"></i></button>
                                        <button class="btn btn-sm btn-warning btn-action" onclick="showEditCommandeModal(${commande.id})"><i class="fas fa-edit"></i></button>
                                        <button class="btn btn-sm btn-danger btn-action" onclick="deleteCommande(${commande.id})"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <nav>
                <ul class="pagination justify-content-center">
                    <li class="page-item ${commandesCurrentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="changeCommandesPage(${commandesCurrentPage - 1}); return false;">Précédent</a>
                    </li>
                    ${Array.from({ length: paginated.totalPages }, (_, i) => i + 1).map(page => `
                        <li class="page-item ${page === commandesCurrentPage ? 'active' : ''}">
                            <a class="page-link" href="#" onclick="changeCommandesPage(${page}); return false;">${page}</a>
                        </li>
                    `).join('')}
                    <li class="page-item ${commandesCurrentPage === paginated.totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="changeCommandesPage(${commandesCurrentPage + 1}); return false;">Suivant</a>
                    </li>
                </ul>
            </nav>
        </div>
    `;

    document.getElementById('mainContent').innerHTML = html;
    
    document.getElementById('commandeSearch').addEventListener('input', function(e) {
        commandesFilters.numero = e.target.value;
        commandesCurrentPage = 1;
        renderCommandesPage();
    });
    
    document.getElementById('commandeStatutFilter').addEventListener('change', function(e) {
        commandesFilters.statut = e.target.value;
        commandesCurrentPage = 1;
        renderCommandesPage();
    });
}

function getStatutColor(statut) {
    const colors = {
        'En attente': 'warning',
        'En préparation': 'info',
        'Prête': 'success',
        'Servie': 'primary',
        'Annulée': 'danger'
    };
    return colors[statut] || 'secondary';
}

function sortCommandes(field) {
    if (commandesSortBy === field) {
        commandesSortOrder = commandesSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        commandesSortBy = field;
        commandesSortOrder = 'asc';
    }
    renderCommandesPage();
}

function changeCommandesPage(page) {
    commandesCurrentPage = page;
    renderCommandesPage();
}

function resetCommandesFilters() {
    commandesFilters = {};
    document.getElementById('commandeSearch').value = '';
    document.getElementById('commandeStatutFilter').value = '';
    commandesCurrentPage = 1;
    renderCommandesPage();
}

function showAddCommandeModal() {
    const tables = dataStore.getTables();
    const body = `
        <form id="commandeForm">
            <div class="mb-3">
                <label class="form-label">Table *</label>
                <select class="form-select" id="commandeTableId" required>
                    ${tables.map(t => `<option value="${t.id}">Table ${t.numero} (${t.capacite} pers.)</option>`).join('')}
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Statut *</label>
                <select class="form-select" id="commandeStatut" required>
                    <option value="En attente">En attente</option>
                    <option value="En préparation">En préparation</option>
                    <option value="Prête">Prête</option>
                    <option value="Servie">Servie</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Montant total (€) *</label>
                <input type="number" step="0.01" class="form-control" id="commandeMontant" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Notes</label>
                <textarea class="form-control" id="commandeNotes" rows="3"></textarea>
            </div>
        </form>
    `;
    createModal('Ajouter une Commande', body, `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary" onclick="saveCommande()">Enregistrer</button>
    `);
}

function showEditCommandeModal(id) {
    const commande = dataStore.getCommandes().find(c => c.id === id);
    if (!commande) return;
    const tables = dataStore.getTables();
    
    const body = `
        <form id="commandeForm">
            <input type="hidden" id="commandeId" value="${commande.id}">
            <div class="mb-3">
                <label class="form-label">Table *</label>
                <select class="form-select" id="commandeTableId" required>
                    ${tables.map(t => `<option value="${t.id}" ${t.id === commande.tableId ? 'selected' : ''}>Table ${t.numero}</option>`).join('')}
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Statut *</label>
                <select class="form-select" id="commandeStatut" required>
                    <option value="En attente" ${commande.statut === 'En attente' ? 'selected' : ''}>En attente</option>
                    <option value="En préparation" ${commande.statut === 'En préparation' ? 'selected' : ''}>En préparation</option>
                    <option value="Prête" ${commande.statut === 'Prête' ? 'selected' : ''}>Prête</option>
                    <option value="Servie" ${commande.statut === 'Servie' ? 'selected' : ''}>Servie</option>
                    <option value="Annulée" ${commande.statut === 'Annulée' ? 'selected' : ''}>Annulée</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Montant total (€) *</label>
                <input type="number" step="0.01" class="form-control" id="commandeMontant" value="${commande.montantTotal}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Notes</label>
                <textarea class="form-control" id="commandeNotes" rows="3">${commande.notes || ''}</textarea>
            </div>
        </form>
    `;
    createModal('Modifier une Commande', body, `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary" onclick="saveCommande()">Enregistrer</button>
    `);
}

function saveCommande() {
    const id = document.getElementById('commandeId')?.value;
    const commande = {
        tableId: parseInt(document.getElementById('commandeTableId').value),
        statut: document.getElementById('commandeStatut').value,
        montantTotal: parseFloat(document.getElementById('commandeMontant').value),
        notes: document.getElementById('commandeNotes').value,
        date: id ? dataStore.getCommandes().find(c => c.id === parseInt(id)).date : new Date().toISOString(),
        plats: id ? dataStore.getCommandes().find(c => c.id === parseInt(id)).plats : [],
        employeId: id ? dataStore.getCommandes().find(c => c.id === parseInt(id)).employeId : 1
    };
    
    if (id) {
        dataStore.updateCommande(parseInt(id), commande);
    } else {
        dataStore.addCommande(commande);
    }
    
    bootstrap.Modal.getInstance(document.querySelector('.modal')).hide();
    renderCommandesPage();
}

function deleteCommande(id) {
    if (confirm(t('crud.deleteConfirm'))) {
        dataStore.deleteCommande(id);
        renderCommandesPage();
    }
}

function viewCommandeDetails(id) {
    const commande = dataStore.getCommandes().find(c => c.id === id);
    if (!commande) return;
    const table = dataStore.getTables().find(t => t.id === commande.tableId);
    const plats = dataStore.getPlats();
    
    const platsDetails = commande.plats.map(p => {
        const plat = plats.find(pl => pl.id === p.platId);
        return plat ? `${plat.nom} x${p.quantite}` : '';
    }).filter(Boolean).join(', ');
    
    const html = `
        <div class="page-header d-flex justify-content-between align-items-center">
            <h1 data-i18n="details.title">Détails de la Commande</h1>
            <div>
                <button class="btn btn-secondary me-2" onclick="navigateTo('commandes')"><i class="fas fa-arrow-left me-2"></i><span data-i18n="details.back">Retour</span></button>
                <button class="btn btn-danger" onclick="exportCommandePDF(${id})"><i class="fas fa-file-pdf me-2"></i><span data-i18n="details.exportPdf">Exporter PDF</span></button>
            </div>
        </div>
        <div class="details-container">
            <div class="details-section">
                <h3>Informations générales</h3>
                <div class="detail-item"><div class="detail-label">Numéro</div><div class="detail-value"><strong>${commande.numero}</strong></div></div>
                <div class="detail-item"><div class="detail-label">Table</div><div class="detail-value">Table ${table ? table.numero : commande.tableId}</div></div>
                <div class="detail-item"><div class="detail-label">Statut</div><div class="detail-value"><span class="badge bg-${getStatutColor(commande.statut)}">${commande.statut}</span></div></div>
                <div class="detail-item"><div class="detail-label">Montant total</div><div class="detail-value">${formatCurrency(commande.montantTotal)}</div></div>
                <div class="detail-item"><div class="detail-label">Date</div><div class="detail-value">${formatDate(commande.date)}</div></div>
                <div class="detail-item"><div class="detail-label">Plats</div><div class="detail-value">${platsDetails || 'Aucun plat'}</div></div>
                <div class="detail-item"><div class="detail-label">Notes</div><div class="detail-value">${commande.notes || 'Aucune note'}</div></div>
            </div>
        </div>
    `;
    document.getElementById('mainContent').innerHTML = html;
}

function exportCommandesCSV() {
    const commandes = dataStore.getCommandes();
    const headers = ['id', 'numero', 'tableId', 'statut', 'montantTotal', 'date'];
    exportToCSV(commandes, headers, 'commandes.csv');
}

function exportCommandePDF(id) {
    const commande = dataStore.getCommandes().find(c => c.id === id);
    if (!commande) return;
    const content = `Numéro: ${commande.numero}\nTable: ${commande.tableId}\nStatut: ${commande.statut}\nMontant: ${formatCurrency(commande.montantTotal)}\nDate: ${formatDate(commande.date)}`;
    exportToPDF(`Commande ${commande.numero}`, content, `commande_${commande.id}.pdf`);
}


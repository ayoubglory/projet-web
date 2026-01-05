// Reservations CRUD page
let reservationsCurrentPage = 1;
let reservationsItemsPerPage = 10;
let reservationsSortBy = 'date';
let reservationsSortOrder = 'desc';
let reservationsFilters = {};

function loadReservationsPage() {
    reservationsCurrentPage = 1;
    renderReservationsPage();
}

function renderReservationsPage() {
    let reservations = dataStore.getReservations();
    const tables = dataStore.getTables();
    
    reservations = filterData(reservations, reservationsFilters);
    reservations = sortData(reservations, reservationsSortBy, reservationsSortOrder);
    const paginated = paginate(reservations, reservationsCurrentPage, reservationsItemsPerPage);
    
    const html = `
        <div class="page-header">
            <h1 data-i18n="reservations.title">Gestion des Réservations</h1>
        </div>

        <div class="filter-section">
            <div class="filter-row">
                <div class="filter-group">
                    <label class="form-label">Recherche</label>
                    <input type="text" class="form-control" id="reservationSearch" placeholder="Rechercher par nom client...">
                </div>
                <div class="filter-group">
                    <label class="form-label">Statut</label>
                    <select class="form-select" id="reservationStatutFilter">
                        <option value="">Tous les statuts</option>
                        <option value="Confirmée">Confirmée</option>
                        <option value="En attente">En attente</option>
                        <option value="Annulée">Annulée</option>
                        <option value="Terminée">Terminée</option>
                    </select>
                </div>
                <div class="filter-group d-flex align-items-end">
                    <button class="btn btn-secondary" onclick="resetReservationsFilters()">Réinitialiser</button>
                </div>
            </div>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h5>Liste des Réservations (${reservations.length})</h5>
                <div class="table-actions">
                    <button class="btn btn-primary" onclick="showAddReservationModal()"><i class="fas fa-plus me-2"></i><span data-i18n="crud.add">Ajouter</span></button>
                    <button class="btn btn-success" onclick="exportReservationsCSV()"><i class="fas fa-file-csv me-2"></i><span data-i18n="crud.export">Exporter CSV</span></button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th onclick="sortReservations('numero')" style="cursor: pointer;">Numéro <i class="fas fa-sort"></i></th>
                            <th onclick="sortReservations('clientNom')" style="cursor: pointer;">Client <i class="fas fa-sort"></i></th>
                            <th onclick="sortReservations('tableId')" style="cursor: pointer;">Table <i class="fas fa-sort"></i></th>
                            <th onclick="sortReservations('date')" style="cursor: pointer;">Date <i class="fas fa-sort"></i></th>
                            <th>Heure</th>
                            <th onclick="sortReservations('statut')" style="cursor: pointer;">Statut <i class="fas fa-sort"></i></th>
                            <th data-i18n="crud.actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginated.data.length === 0 ? '<tr><td colspan="7" class="text-center">Aucune réservation trouvée</td></tr>' : 
                        paginated.data.map(reservation => {
                            const table = tables.find(t => t.id === reservation.tableId);
                            return `
                                <tr>
                                    <td><strong>${reservation.numero}</strong></td>
                                    <td>${reservation.clientNom}</td>
                                    <td>Table ${table ? table.numero : reservation.tableId}</td>
                                    <td>${formatDate(reservation.date)}</td>
                                    <td>${reservation.heure}</td>
                                    <td><span class="badge bg-${getReservationStatutColor(reservation.statut)}">${reservation.statut}</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-info btn-action" onclick="viewReservationDetails(${reservation.id})"><i class="fas fa-eye"></i></button>
                                        <button class="btn btn-sm btn-warning btn-action" onclick="showEditReservationModal(${reservation.id})"><i class="fas fa-edit"></i></button>
                                        <button class="btn btn-sm btn-danger btn-action" onclick="deleteReservation(${reservation.id})"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <nav>
                <ul class="pagination justify-content-center">
                    <li class="page-item ${reservationsCurrentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="changeReservationsPage(${reservationsCurrentPage - 1}); return false;">Précédent</a>
                    </li>
                    ${Array.from({ length: paginated.totalPages }, (_, i) => i + 1).map(page => `
                        <li class="page-item ${page === reservationsCurrentPage ? 'active' : ''}">
                            <a class="page-link" href="#" onclick="changeReservationsPage(${page}); return false;">${page}</a>
                        </li>
                    `).join('')}
                    <li class="page-item ${reservationsCurrentPage === paginated.totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="changeReservationsPage(${reservationsCurrentPage + 1}); return false;">Suivant</a>
                    </li>
                </ul>
            </nav>
        </div>
    `;

    document.getElementById('mainContent').innerHTML = html;
    
    document.getElementById('reservationSearch').addEventListener('input', function(e) {
        reservationsFilters.clientNom = e.target.value;
        reservationsCurrentPage = 1;
        renderReservationsPage();
    });
    
    document.getElementById('reservationStatutFilter').addEventListener('change', function(e) {
        reservationsFilters.statut = e.target.value;
        reservationsCurrentPage = 1;
        renderReservationsPage();
    });
}

function getReservationStatutColor(statut) {
    const colors = { 'Confirmée': 'success', 'En attente': 'warning', 'Annulée': 'danger', 'Terminée': 'info' };
    return colors[statut] || 'secondary';
}

function sortReservations(field) {
    if (reservationsSortBy === field) {
        reservationsSortOrder = reservationsSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        reservationsSortBy = field;
        reservationsSortOrder = 'asc';
    }
    renderReservationsPage();
}

function changeReservationsPage(page) {
    reservationsCurrentPage = page;
    renderReservationsPage();
}

function resetReservationsFilters() {
    reservationsFilters = {};
    document.getElementById('reservationSearch').value = '';
    document.getElementById('reservationStatutFilter').value = '';
    reservationsCurrentPage = 1;
    renderReservationsPage();
}

function showAddReservationModal() {
    const tables = dataStore.getTables();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const body = `
        <form id="reservationForm">
            <div class="mb-3">
                <label class="form-label">Nom du client *</label>
                <input type="text" class="form-control" id="reservationClientNom" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" id="reservationClientEmail">
            </div>
            <div class="mb-3">
                <label class="form-label">Téléphone</label>
                <input type="tel" class="form-control" id="reservationClientTelephone">
            </div>
            <div class="mb-3">
                <label class="form-label">Table *</label>
                <select class="form-select" id="reservationTableId" required>
                    ${tables.map(t => `<option value="${t.id}">Table ${t.numero} (${t.capacite} pers.)</option>`).join('')}
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Nombre de personnes *</label>
                <input type="number" class="form-control" id="reservationNombrePersonnes" min="1" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Date *</label>
                <input type="date" class="form-control" id="reservationDate" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Heure *</label>
                <input type="time" class="form-control" id="reservationHeure" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Statut *</label>
                <select class="form-select" id="reservationStatut" required>
                    <option value="En attente">En attente</option>
                    <option value="Confirmée">Confirmée</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Notes</label>
                <textarea class="form-control" id="reservationNotes" rows="3"></textarea>
            </div>
        </form>
    `;
    createModal('Ajouter une Réservation', body, `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary" onclick="saveReservation()">Enregistrer</button>
    `);
    
    document.getElementById('reservationDate').value = tomorrow.toISOString().split('T')[0];
}

function showEditReservationModal(id) {
    const reservation = dataStore.getReservations().find(r => r.id === id);
    if (!reservation) return;
    const tables = dataStore.getTables();
    
    const body = `
        <form id="reservationForm">
            <input type="hidden" id="reservationId" value="${reservation.id}">
            <div class="mb-3">
                <label class="form-label">Nom du client *</label>
                <input type="text" class="form-control" id="reservationClientNom" value="${reservation.clientNom}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" id="reservationClientEmail" value="${reservation.clientEmail || ''}">
            </div>
            <div class="mb-3">
                <label class="form-label">Téléphone</label>
                <input type="tel" class="form-control" id="reservationClientTelephone" value="${reservation.clientTelephone || ''}">
            </div>
            <div class="mb-3">
                <label class="form-label">Table *</label>
                <select class="form-select" id="reservationTableId" required>
                    ${tables.map(t => `<option value="${t.id}" ${t.id === reservation.tableId ? 'selected' : ''}>Table ${t.numero}</option>`).join('')}
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Nombre de personnes *</label>
                <input type="number" class="form-control" id="reservationNombrePersonnes" value="${reservation.nombrePersonnes}" min="1" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Date *</label>
                <input type="date" class="form-control" id="reservationDate" value="${reservation.date.split('T')[0]}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Heure *</label>
                <input type="time" class="form-control" id="reservationHeure" value="${reservation.heure}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Statut *</label>
                <select class="form-select" id="reservationStatut" required>
                    <option value="En attente" ${reservation.statut === 'En attente' ? 'selected' : ''}>En attente</option>
                    <option value="Confirmée" ${reservation.statut === 'Confirmée' ? 'selected' : ''}>Confirmée</option>
                    <option value="Annulée" ${reservation.statut === 'Annulée' ? 'selected' : ''}>Annulée</option>
                    <option value="Terminée" ${reservation.statut === 'Terminée' ? 'selected' : ''}>Terminée</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Notes</label>
                <textarea class="form-control" id="reservationNotes" rows="3">${reservation.notes || ''}</textarea>
            </div>
        </form>
    `;
    createModal('Modifier une Réservation', body, `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary" onclick="saveReservation()">Enregistrer</button>
    `);
}

function saveReservation() {
    const id = document.getElementById('reservationId')?.value;
    const dateValue = document.getElementById('reservationDate').value;
    
    const reservation = {
        clientNom: document.getElementById('reservationClientNom').value,
        clientEmail: document.getElementById('reservationClientEmail').value,
        clientTelephone: document.getElementById('reservationClientTelephone').value,
        tableId: parseInt(document.getElementById('reservationTableId').value),
        nombrePersonnes: parseInt(document.getElementById('reservationNombrePersonnes').value),
        date: new Date(dateValue).toISOString(),
        heure: document.getElementById('reservationHeure').value,
        statut: document.getElementById('reservationStatut').value,
        notes: document.getElementById('reservationNotes').value
    };
    
    if (id) {
        dataStore.updateReservation(parseInt(id), reservation);
    } else {
        dataStore.addReservation(reservation);
    }
    
    bootstrap.Modal.getInstance(document.querySelector('.modal')).hide();
    renderReservationsPage();
}

function deleteReservation(id) {
    if (confirm(t('crud.deleteConfirm'))) {
        dataStore.deleteReservation(id);
        renderReservationsPage();
    }
}

function viewReservationDetails(id) {
    const reservation = dataStore.getReservations().find(r => r.id === id);
    if (!reservation) return;
    const table = dataStore.getTables().find(t => t.id === reservation.tableId);
    
    const html = `
        <div class="page-header d-flex justify-content-between align-items-center">
            <h1 data-i18n="details.title">Détails de la Réservation</h1>
            <div>
                <button class="btn btn-secondary me-2" onclick="navigateTo('reservations')"><i class="fas fa-arrow-left me-2"></i><span data-i18n="details.back">Retour</span></button>
                <button class="btn btn-danger" onclick="exportReservationPDF(${id})"><i class="fas fa-file-pdf me-2"></i><span data-i18n="details.exportPdf">Exporter PDF</span></button>
            </div>
        </div>
        <div class="details-container">
            <div class="details-section">
                <h3>Informations générales</h3>
                <div class="detail-item"><div class="detail-label">Numéro</div><div class="detail-value"><strong>${reservation.numero}</strong></div></div>
                <div class="detail-item"><div class="detail-label">Client</div><div class="detail-value">${reservation.clientNom}</div></div>
                <div class="detail-item"><div class="detail-label">Email</div><div class="detail-value">${reservation.clientEmail || 'N/A'}</div></div>
                <div class="detail-item"><div class="detail-label">Téléphone</div><div class="detail-value">${reservation.clientTelephone || 'N/A'}</div></div>
                <div class="detail-item"><div class="detail-label">Table</div><div class="detail-value">Table ${table ? table.numero : reservation.tableId}</div></div>
                <div class="detail-item"><div class="detail-label">Nombre de personnes</div><div class="detail-value">${reservation.nombrePersonnes}</div></div>
                <div class="detail-item"><div class="detail-label">Date</div><div class="detail-value">${formatDate(reservation.date)}</div></div>
                <div class="detail-item"><div class="detail-label">Heure</div><div class="detail-value">${reservation.heure}</div></div>
                <div class="detail-item"><div class="detail-label">Statut</div><div class="detail-value"><span class="badge bg-${getReservationStatutColor(reservation.statut)}">${reservation.statut}</span></div></div>
                <div class="detail-item"><div class="detail-label">Notes</div><div class="detail-value">${reservation.notes || 'Aucune note'}</div></div>
            </div>
        </div>
    `;
    document.getElementById('mainContent').innerHTML = html;
}

function exportReservationsCSV() {
    const reservations = dataStore.getReservations();
    const headers = ['id', 'numero', 'clientNom', 'clientEmail', 'clientTelephone', 'tableId', 'date', 'heure', 'statut'];
    exportToCSV(reservations, headers, 'reservations.csv');
}

function exportReservationPDF(id) {
    const reservation = dataStore.getReservations().find(r => r.id === id);
    if (!reservation) return;
    const content = `Numéro: ${reservation.numero}\nClient: ${reservation.clientNom}\nEmail: ${reservation.clientEmail || 'N/A'}\nTéléphone: ${reservation.clientTelephone || 'N/A'}\nTable: ${reservation.tableId}\nDate: ${formatDate(reservation.date)}\nHeure: ${reservation.heure}\nStatut: ${reservation.statut}`;
    exportToPDF(`Réservation ${reservation.numero}`, content, `reservation_${reservation.id}.pdf`);
}


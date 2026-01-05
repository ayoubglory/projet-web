// Dashboard page
let dashboardCharts = {};

function renderDashboard() {
    const stats = calculateStats();
    
    const html = `
        <div class="page-header">
            <h1 data-i18n="dashboard.title">Tableau de bord</h1>
        </div>

        <!-- Statistics Cards -->
        <div class="dashboard-grid">
            <div class="card stat-card text-white bg-primary">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="stat-label" data-i18n="dashboard.stats.plats">Total Plats</div>
                            <div class="stat-value">${stats.totalPlats}</div>
                        </div>
                        <i class="fas fa-hamburger stat-icon"></i>
                    </div>
                </div>
            </div>

            <div class="card stat-card text-white bg-success">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="stat-label" data-i18n="dashboard.stats.commandes">Commandes</div>
                            <div class="stat-value">${stats.totalCommandes}</div>
                        </div>
                        <i class="fas fa-shopping-cart stat-icon"></i>
                    </div>
                </div>
            </div>

            <div class="card stat-card text-white bg-info">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="stat-label" data-i18n="dashboard.stats.tables">Tables</div>
                            <div class="stat-value">${stats.totalTables}</div>
                        </div>
                        <i class="fas fa-table stat-icon"></i>
                    </div>
                </div>
            </div>

            <div class="card stat-card text-white bg-warning">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="stat-label" data-i18n="dashboard.stats.reservations">Réservations</div>
                            <div class="stat-value">${stats.totalReservations}</div>
                        </div>
                        <i class="fas fa-calendar-check stat-icon"></i>
                    </div>
                </div>
            </div>

            <div class="card stat-card text-white bg-danger">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <div class="stat-label" data-i18n="dashboard.stats.employes">Employés</div>
                            <div class="stat-value">${stats.totalEmployes}</div>
                        </div>
                        <i class="fas fa-users stat-icon"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts -->
        <div class="chart-grid">
            <div class="chart-container">
                <h3 class="chart-title">Répartition des Plats par Catégorie (Pie Chart)</h3>
                <canvas id="chartPlatsCategorie"></canvas>
            </div>

            <div class="chart-container">
                <h3 class="chart-title">Statut des Commandes (Doughnut Chart)</h3>
                <canvas id="chartCommandesStatut"></canvas>
            </div>

            <div class="chart-container">
                <h3 class="chart-title">Évolution des Commandes (Line Chart)</h3>
                <canvas id="chartCommandesEvolution"></canvas>
            </div>

            <div class="chart-container">
                <h3 class="chart-title">Répartition des Tables par Type (Bar Chart)</h3>
                <canvas id="chartTablesType"></canvas>
            </div>

            <div class="chart-container">
                <h3 class="chart-title">Revenus par Jour (Scatter Plot)</h3>
                <canvas id="chartRevenus"></canvas>
            </div>

            <div class="chart-container">
                <h3 class="chart-title">Distribution des Salaires (Histogram)</h3>
                <canvas id="chartSalaires"></canvas>
            </div>
        </div>
    `;

    document.getElementById('mainContent').innerHTML = html;
    
    // Attendre un peu pour s'assurer que les canvas sont créés
    setTimeout(() => {
        renderCharts(stats);
    }, 300);
}

function calculateStats() {
    const plats = dataStore.getPlats();
    const commandes = dataStore.getCommandes();
    const tables = dataStore.getTables();
    const reservations = dataStore.getReservations();
    const employes = dataStore.getEmployes();

    return {
        totalPlats: plats.length,
        totalCommandes: commandes.length,
        totalTables: tables.length,
        totalReservations: reservations.length,
        totalEmployes: employes.length,
        plats,
        commandes,
        tables,
        reservations,
        employes
    };
}

function renderCharts(stats) {
    // Vérifier que Chart.js est disponible
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }

    // Détruire les anciens graphiques
    Object.values(dashboardCharts).forEach(chart => {
        if (chart && chart.destroy) chart.destroy();
    });
    dashboardCharts = {};

    // Chart 1: Pie Chart - Répartition des plats par catégorie
    const categoriesCount = {};
    stats.plats.forEach(plat => {
        categoriesCount[plat.categorie] = (categoriesCount[plat.categorie] || 0) + 1;
    });

    const ctx1 = document.getElementById('chartPlatsCategorie');
    if (ctx1) {
        dashboardCharts.platsCategorie = new Chart(ctx1, {
            type: 'pie',
            data: {
                labels: Object.keys(categoriesCount),
                datasets: [{
                    data: Object.values(categoriesCount),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }

    // Chart 2: Doughnut Chart - Statut des commandes
    const statutCount = {};
    stats.commandes.forEach(commande => {
        statutCount[commande.statut] = (statutCount[commande.statut] || 0) + 1;
    });

    const ctx2 = document.getElementById('chartCommandesStatut');
    if (ctx2) {
        dashboardCharts.commandesStatut = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statutCount),
                datasets: [{
                    data: Object.values(statutCount),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }

    // Chart 3: Line Chart - Évolution des commandes
    const last7Days = [];
    const commandesCount = {};
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        last7Days.push(dateStr);
        commandesCount[dateStr] = 0;
    }

    stats.commandes.forEach(commande => {
        const dateStr = commande.date.split('T')[0];
        if (commandesCount.hasOwnProperty(dateStr)) {
            commandesCount[dateStr]++;
        }
    });

    const ctx3 = document.getElementById('chartCommandesEvolution');
    if (ctx3) {
        dashboardCharts.commandesEvolution = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: last7Days.map(d => new Date(d).toLocaleDateString('fr-FR')),
                datasets: [{
                    label: 'Nombre de commandes',
                    data: last7Days.map(d => commandesCount[d]),
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Chart 4: Bar Chart - Répartition des tables par type
    const typesCount = {};
    stats.tables.forEach(table => {
        typesCount[table.type] = (typesCount[table.type] || 0) + 1;
    });

    const ctx4 = document.getElementById('chartTablesType');
    if (ctx4) {
        dashboardCharts.tablesType = new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: Object.keys(typesCount),
                datasets: [{
                    label: 'Nombre de tables',
                    data: Object.values(typesCount),
                    backgroundColor: '#4BC0C0'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Chart 5: Scatter Plot - Revenus par jour
    const revenusParJour = {};
    stats.commandes.forEach(commande => {
        const dateStr = commande.date.split('T')[0];
        revenusParJour[dateStr] = (revenusParJour[dateStr] || 0) + commande.montantTotal;
    });

    const scatterData = Object.keys(revenusParJour).map((date, index) => ({
        x: index,
        y: revenusParJour[date]
    }));

    const ctx5 = document.getElementById('chartRevenus');
    if (ctx5) {
        dashboardCharts.revenus = new Chart(ctx5, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Revenus',
                    data: scatterData,
                    backgroundColor: '#FF6384'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Jour'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Revenus (€)'
                        }
                    }
                }
            }
        });
    }

    // Chart 6: Histogram - Distribution des salaires
    const salaires = stats.employes.map(e => e.salaire);
    const bins = [1500, 2000, 2500, 3000, 3500, 4000, 4500];
    const histogramData = new Array(bins.length).fill(0);
    
    salaires.forEach(salaire => {
        for (let i = 0; i < bins.length; i++) {
            if (salaire < bins[i]) {
                histogramData[i]++;
                break;
            }
            if (i === bins.length - 1) {
                histogramData[i]++;
            }
        }
    });

    const ctx6 = document.getElementById('chartSalaires');
    if (ctx6) {
        dashboardCharts.salaires = new Chart(ctx6, {
            type: 'bar',
            data: {
                labels: bins.map((b, i) => i === 0 ? `< ${b}` : (i === bins.length - 1 ? `> ${bins[i-1]}` : `${bins[i-1]}-${b}`)),
                datasets: [{
                    label: 'Nombre d\'employés',
                    data: histogramData,
                    backgroundColor: '#9966FF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// 1. Fonctions de génération (Plats: 20, Commandes: 30, Tables: 15)
function generatePlats() {
    const categories = ['Entrée', 'Plat principal', 'Dessert', 'Boisson', 'Salade'];
    const plats = [];
    const nomPlats = ['Couscous', 'Tajine', 'Harira', 'Pastilla', 'Salade César', 'Pizza', 'Burger', 'Pâtes', 'Saumon', 'Risotto', 'Tiramisu', 'Café', 'Salade niçoise', 'Steak frites', 'Ratatouille', 'Crème brûlée', 'Soupe', 'Poulet rôti', 'Lasagnes', 'Tarte'];
    
    for (let i = 1; i <= 20; i++) {
        plats.push({
            id: i,
            nom: nomPlats[i-1] || `Plat ${i}`,
            categorie: categories[Math.floor(Math.random() * categories.length)],
            prix: parseFloat((Math.random() * 20 + 5).toFixed(2)),
            disponible: true
        });
    }
    return plats;
}

function generateCommandes() {
    const commandes = [];
    for (let i = 1; i <= 30; i++) {
        commandes.push({
            id: i,
            numero: `CMD-${String(i).padStart(4, '0')}`,
            tableId: Math.floor(Math.random() * 15) + 1,
            statut: 'En attente',
            date: new Date().toISOString()
        });
    }
    return commandes;
}

function generateTables() {
    const tables = [];
    for (let i = 1; i <= 15; i++) {
        tables.push({ id: i, numero: i, capacite: 4, disponible: true });
    }
    return tables;
}
function generateReservations() {
    const statuts = ['Confirmée', 'En attente', 'Annulée', 'Terminée'];
    const reservations = [];
    
    for (let i = 1; i <= 20; i++) {
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 30));
        
        reservations.push({
            id: i,
            numero: `RES-${String(i).padStart(4, '0')}`,
            clientNom: `Client ${i}`,
            clientEmail: `client${i}@example.com`,
            clientTelephone: `0${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 10000000)}`,
            tableId: Math.floor(Math.random() * 20) + 1,
            nombrePersonnes: Math.floor(Math.random() * 6) + 1,
            date: date.toISOString(),
            heure: `${String(Math.floor(Math.random() * 12) + 11).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            statut: statuts[Math.floor(Math.random() * statuts.length)],
            notes: Math.random() > 0.6 ? 'Demande spéciale' : ''
        });
    }
    
    return reservations;
}



function generateEmployes() {
    const postes = ['Serveur', 'Chef', 'Sous-chef', 'Barman', 'Gestionnaire', 'Hôte'];
    //const employes = [];

    const prenoms = ['Karim', 'Yassine', 'Amine', 'Leila', 'Sofia', 'Omar', 'Hamza', 'Meriam', 'Anas', 'Zineb'];
    const noms = ['Bennani', 'Mansouri', 'Alami', 'Idrissi', 'Toumi'];
    
    // On définit la liste des choix possibles ici
    
    
    const employes = [];
    for (let i = 1; i <= 10; i++) {
        employes.push({
            id: i,
            nom: `${prenoms[Math.floor(Math.random() * prenoms.length)]} ${noms[Math.floor(Math.random() * noms.length)]}`,
            // On pioche un poste au hasard dans la liste ci-dessus
            email: `employe${i}@restaurant.com`,
            telephone: `0${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 10000000)}`,
            poste: postes[Math.floor(Math.random() * postes.length)],
            salaire: Math.floor(Math.random() * 3000 + 1500),
            dateEmbauche: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            statut: Math.random() > 0.2 ? 'Actif' : 'Inactif',
            horaire: ['Temps plein', 'Temps partiel', 'Temps plein'][Math.floor(Math.random() * 3)]

        });
    }
    return employes;
}

// 2. Définition de la Classe
class DataStore {
    constructor() {
        // On vérifie si les données existent déjà dans le navigateur
        this.plats = this.loadData('plats') || generatePlats();
        this.commandes = this.loadData('commandes') || generateCommandes();
        this.tables = this.loadData('tables') || generateTables();
         this.reservations = this.loadData('reservations') || generateReservations();
        this.employes = this.loadData('employes') || generateEmployes();
        this.saveAll();
    }

    loadData(key) {
        const data = localStorage.getItem(`restaurant_${key}`);
        return data ? JSON.parse(data) : null;
    }

    saveData(key, data) {
        localStorage.setItem(`restaurant_${key}`, JSON.stringify(data));
    }

    saveAll() {
        this.saveData('plats', this.plats);
        this.saveData('commandes', this.commandes);
        this.saveData('tables', this.tables);
        this.saveData('reservations', this.reservations);
        this.saveData('employes', this.employes);
    }
    
    // Méthodes Getters
    getPlats() { return this.plats; }
    getCommandes() { return this.commandes; }
    getTables() { return this.tables; }
     getReservations() {
        return this.reservations;
    }

    getEmployes() { return this.employes; }


addPlat(plat) {
        plat.id = Math.max(...this.plats.map(p => p.id), 0) + 1;
        this.plats.push(plat);
        this.saveData('plats', this.plats);
        return plat;
    }

    updatePlat(id, plat) {
        const index = this.plats.findIndex(p => p.id === id);
        if (index !== -1) {
            this.plats[index] = { ...plat, id };
            this.saveData('plats', this.plats);
            return this.plats[index];
        }
        return null;
    }

    deletePlat(id) {
        this.plats = this.plats.filter(p => p.id !== id);
        this.saveData('plats', this.plats);
    }

    addCommande(commande) {
        commande.id = Math.max(...this.commandes.map(c => c.id), 0) + 1;
        commande.numero = `CMD-${String(commande.id).padStart(4, '0')}`;
        this.commandes.push(commande);
        this.saveData('commandes', this.commandes);
        return commande;
    }

    updateCommande(id, commande) {
        const index = this.commandes.findIndex(c => c.id === id);
        if (index !== -1) {
            this.commandes[index] = { ...commande, id };
            this.saveData('commandes', this.commandes);
            return this.commandes[index];
        }
        return null;
    }

    deleteCommande(id) {
        this.commandes = this.commandes.filter(c => c.id !== id);
        this.saveData('commandes', this.commandes);
    }

    addTable(table) {
        table.id = Math.max(...this.tables.map(t => t.id), 0) + 1;
        this.tables.push(table);
        this.saveData('tables', this.tables);
        return table;
    }

    updateTable(id, table) {
        const index = this.tables.findIndex(t => t.id === id);
        if (index !== -1) {
            this.tables[index] = { ...table, id };
            this.saveData('tables', this.tables);
            return this.tables[index];
        }
        return null;
    }

    deleteTable(id) {
        this.tables = this.tables.filter(t => t.id !== id);
        this.saveData('tables', this.tables);
    }

    addReservation(reservation) {
        reservation.id = Math.max(...this.reservations.map(r => r.id), 0) + 1;
        reservation.numero = `RES-${String(reservation.id).padStart(4, '0')}`;
        this.reservations.push(reservation);
        this.saveData('reservations', this.reservations);
        return reservation;
    }

    updateReservation(id, reservation) {
        const index = this.reservations.findIndex(r => r.id === id);
        if (index !== -1) {
            this.reservations[index] = { ...reservation, id };
            this.saveData('reservations', this.reservations);
            return this.reservations[index];
        }
        return null;
    }

    deleteReservation(id) {
        this.reservations = this.reservations.filter(r => r.id !== id);
        this.saveData('reservations', this.reservations);
    }

    addEmploye(employe) {
        employe.id = Math.max(...this.employes.map(e => e.id), 0) + 1;
        this.employes.push(employe);
        this.saveData('employes', this.employes);
        return employe;
    }

    updateEmploye(id, employe) {
        const index = this.employes.findIndex(e => e.id === id);
        if (index !== -1) {
            this.employes[index] = { ...employe, id };
            this.saveData('employes', this.employes);
            return this.employes[index];
        }
        return null;
    }

    deleteEmploye(id) {
        this.employes = this.employes.filter(e => e.id !== id);
        this.saveData('employes', this.employes);
    }

}
// 3. IMPORTANT : CRÉATION DE L'INSTANCE (L'objet que votre interface va utiliser)
const dataStore = new DataStore();
// Internationalization
const translations = {
    fr: {
        'navbar.logo': 'Restaurant Manager',
        'navbar.logout': 'Déconnexion',
        'menu.dashboard': 'Tableau de bord',
        'menu.plats': 'Plats',
        'menu.commandes': 'Commandes',
        'menu.tables': 'Tables',
        'menu.reservations': 'Réservations',
        'menu.employes': 'Employés',
        'dashboard.title': 'Tableau de bord',
        'dashboard.stats.plats': 'Total Plats',
        'dashboard.stats.commandes': 'Commandes',
        'dashboard.stats.tables': 'Tables',
        'dashboard.stats.reservations': 'Réservations',
        'dashboard.stats.employes': 'Employés',
        'crud.add': 'Ajouter',
        'crud.edit': 'Modifier',
        'crud.delete': 'Supprimer',
        'crud.view': 'Voir',
        'crud.export': 'Exporter CSV',
        'crud.search': 'Rechercher...',
        'crud.filter': 'Filtrer',
        'crud.reset': 'Réinitialiser',
        'crud.actions': 'Actions',
        'crud.confirm': 'Confirmer',
        'crud.cancel': 'Annuler',
        'crud.save': 'Enregistrer',
        'crud.close': 'Fermer',
        'crud.deleteConfirm': 'Êtes-vous sûr de vouloir supprimer cet élément?',
        'plats.title': 'Gestion des Plats',
        'commandes.title': 'Gestion des Commandes',
        'tables.title': 'Gestion des Tables',
        'reservations.title': 'Gestion des Réservations',
        'employes.title': 'Gestion des Employés',
        'details.title': 'Détails',
        'details.exportPdf': 'Exporter PDF',
        'details.back': 'Retour'
    },
    en: {
        'navbar.logo': 'Restaurant Manager',
        'navbar.logout': 'Logout',
        'menu.dashboard': 'Dashboard',
        'menu.plats': 'Dishes',
        'menu.commandes': 'Orders',
        'menu.tables': 'Tables',
        'menu.reservations': 'Reservations',
        'menu.employes': 'Employees',
        'dashboard.title': 'Dashboard',
        'dashboard.stats.plats': 'Total Dishes',
        'dashboard.stats.commandes': 'Orders',
        'dashboard.stats.tables': 'Tables',
        'dashboard.stats.reservations': 'Reservations',
        'dashboard.stats.employes': 'Employees',
        'crud.add': 'Add',
        'crud.edit': 'Edit',
        'crud.delete': 'Delete',
        'crud.view': 'View',
        'crud.export': 'Export CSV',
        'crud.search': 'Search...',
        'crud.filter': 'Filter',
        'crud.reset': 'Reset',
        'crud.actions': 'Actions',
        'crud.confirm': 'Confirm',
        'crud.cancel': 'Cancel',
        'crud.save': 'Save',
        'crud.close': 'Close',
        'crud.deleteConfirm': 'Are you sure you want to delete this item?',
        'plats.title': 'Dishes Management',
        'commandes.title': 'Orders Management',
        'tables.title': 'Tables Management',
        'reservations.title': 'Reservations Management',
        'employes.title': 'Employees Management',
        'details.title': 'Details',
        'details.exportPdf': 'Export PDF',
        'details.back': 'Back'
    },
    ar: {
        'navbar.logo': 'مدير المطعم',
        'navbar.logout': 'تسجيل الخروج',
        'menu.dashboard': 'لوحة التحكم',
        'menu.plats': 'الأطباق',
        'menu.commandes': 'الطلبات',
        'menu.tables': 'الطاولات',
        'menu.reservations': 'الحجوزات',
        'menu.employes': 'الموظفون',
        'dashboard.title': 'لوحة التحكم',
        'dashboard.stats.plats': 'إجمالي الأطباق',
        'dashboard.stats.commandes': 'الطلبات',
        'dashboard.stats.tables': 'الطاولات',
        'dashboard.stats.reservations': 'الحجوزات',
        'dashboard.stats.employes': 'الموظفون',
        'crud.add': 'إضافة',
        'crud.edit': 'تعديل',
        'crud.delete': 'حذف',
        'crud.view': 'عرض',
        'crud.export': 'تصدير CSV',
        'crud.search': 'بحث...',
        'crud.filter': 'فلترة',
        'crud.reset': 'إعادة تعيين',
        'crud.actions': 'الإجراءات',
        'crud.confirm': 'تأكيد',
        'crud.cancel': 'إلغاء',
        'crud.save': 'حفظ',
        'crud.close': 'إغلاق',
        'crud.deleteConfirm': 'هل أنت متأكد من حذف هذا العنصر؟',
        'plats.title': 'إدارة الأطباق',
        'commandes.title': 'إدارة الطلبات',
        'tables.title': 'إدارة الطاولات',
        'reservations.title': 'إدارة الحجوزات',
        'employes.title': 'إدارة الموظفين',
        'details.title': 'التفاصيل',
        'details.exportPdf': 'تصدير PDF',
        'details.back': 'رجوع'
    }
};

let currentLang = localStorage.getItem('language') || 'fr';

function initI18n() {
    // Appliquer la langue actuelle
    applyLanguage(currentLang);

    // Gestion du dropdown de langue
    const langItems = document.querySelectorAll('[data-lang]');
    langItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            currentLang = lang;
            localStorage.setItem('language', lang);
            applyLanguage(lang);
        });
    });
}

function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    
    // Définir la direction pour l'arabe
    if (lang === 'ar') {
        document.documentElement.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
    }

    // Mettre à jour le texte du bouton de langue
    const langButton = document.getElementById('currentLang');
    if (langButton) {
        langButton.textContent = lang.toUpperCase();
    }

    // Appliquer les traductions
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

function t(key) {
    return translations[currentLang] && translations[currentLang][key] ? translations[currentLang][key] : key;
}


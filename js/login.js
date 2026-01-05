// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorDiv = document.getElementById('loginError');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Credentials statiques : admin/admin
        if (username === 'admin' && password === 'admin') {
            // Stocker l'état de connexion
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Rediriger vers le dashboard
            window.location.href = 'dashboard.html';
        } else {
            errorDiv.textContent = 'Nom d\'utilisateur ou mot de passe incorrect';
            errorDiv.classList.remove('d-none');
        }
    });
});


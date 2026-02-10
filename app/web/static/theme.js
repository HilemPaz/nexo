// theme.js

export function initTheme(themeToggleEl) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(themeToggleEl, savedTheme);
}

export function toggleTheme(themeToggleEl) {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(themeToggleEl, newTheme);
}

function updateThemeButton(themeToggleEl, theme) {
    themeToggleEl.innerHTML = theme === 'dark' 
        ? '<i class="fas fa-sun"></i><span>Modo Claro</span>'
        : '<i class="fas fa-moon"></i><span>Modo Escuro</span>';
}

// Theme handling
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set initial theme
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
} else if (systemPrefersDark) {
    document.body.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

async function searchWord() {
    const searchInput = document.getElementById('searchInput');
    const result = document.getElementById('result');
    const error = document.getElementById('error');
    const word = document.getElementById('word');
    const phonetic = document.getElementById('phonetic');
    const meanings = document.getElementById('meanings');

    const searchTerm = searchInput.value.trim();
    if (!searchTerm) return;

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error('Word not found');
        }

        error.classList.remove('active');
        result.classList.add('active');

        const wordData = data[0];
        word.textContent = wordData.word;
        phonetic.textContent = wordData.phonetic || '';
        meanings.innerHTML = '';

        wordData.meanings.forEach(meaning => {
            const meaningDiv = document.createElement('div');
            meaningDiv.className = 'meaning';
            meaningDiv.innerHTML = `
                <div class="part-of-speech">${meaning.partOfSpeech}</div>
                ${meaning.definitions.map(def => `
                    <div class="definition">• ${def.definition}</div>
                    ${def.example ? `<div class="example">Example: ${def.example}</div>` : ''}
                `).join('')}
            `;
            meanings.appendChild(meaningDiv);
        });
    } catch (err) {
        result.classList.remove('active');
        error.classList.add('active');
    }
}

// Allow searching on Enter key press
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWord();
    }
});
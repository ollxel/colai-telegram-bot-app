// =========================================================================
// === ЕДИНЫЙ ФАЙЛ APP.JS (ВЕРСИЯ БЕЗ МОДУЛЕЙ) ===
// =========================================================================

// --- Класс для управления темной темой (из darkModeManager.js) ---
class DarkModeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.sunIcon = this.themeToggle.querySelector('.sun-icon');
        this.moonIcon = this.themeToggle.querySelector('.moon-icon');
        
        // Применяем тему при загрузке
        if (this.isDarkMode()) {
            document.body.classList.add('dark-mode');
            this.updateIcons(true);
        }

        this.themeToggle.addEventListener('click', () => this.toggle());
    }

    isDarkMode() {
        return localStorage.getItem('darkMode') === 'true';
    }

    toggle() {
        const isDark = !this.isDarkMode();
        localStorage.setItem('darkMode', isDark);
        document.body.classList.toggle('dark-mode', isDark);
        this.updateIcons(isDark);
        return isDark;
    }
    
    updateIcons(isDark) {
        this.sunIcon.style.display = isDark ? 'none' : 'block';
        this.moonIcon.style.display = isDark ? 'block' : 'none';
    }
}

// --- Класс-заглушка для режима Мафии (из modules/mafiaMode.js) ---
class MafiaMode {
    initialize() {
        console.log("Mafia Mode Initialized (placeholder).");
        // Здесь должна быть ваша логика для интерфейса Мафии
    }
}

// --- Основной класс для режима коллаборации (из modules/framework.js) ---
class NeuralCollaborativeFramework {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.tg.expand();
        
        this.elements = {
            startBtn: document.getElementById('start-discussion'),
            projectDescription: document.getElementById('project-description'),
            iterationInput: document.getElementById('max-iterations-input'),
            iterationSlider: document.getElementById('max-iterations'),
            iterationValue: document.getElementById('iteration-value'),
            tempSlider: document.getElementById('temperature'),
            tempValue: document.getElementById('temperature-value'),
            tokensSlider: document.getElementById('max-tokens'),
            tokensValue: document.getElementById('tokens-value'),
            networkCheckboxes: document.querySelectorAll('input[id^="use-network"]'),
            toggleSettingsBtn: document.getElementById('toggle-settings'),
            advancedSettingsPanel: document.getElementById('advanced-settings')
        };
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Проверяем, что кнопка найдена, прежде чем вешать обработчик
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.startCollaboration());
        } else {
            console.error("Кнопка 'start-discussion' не найдена!");
        }

        this.elements.iterationInput.addEventListener('input', (e) => this.syncSliderValues(e.target));
        this.elements.iterationSlider.addEventListener('input', (e) => this.syncSliderValues(e.target));
        this.elements.tempSlider.addEventListener('input', (e) => this.syncSliderValues(e.target));
        this.elements.tokensSlider.addEventListener('input', (e) => this.syncSliderValues(e.target));
        this.elements.toggleSettingsBtn.addEventListener('click', () => this.toggleAdvancedSettings());
    }

    startCollaboration() {
        const projectDescription = this.elements.projectDescription.value;

        if (!projectDescription || projectDescription.trim().length < 10) {
            this.tg.showAlert('Пожалуйста, введите более подробное описание проекта (минимум 10 символов).');
            return;
        }

        const enabledNetworks = Array.from(this.elements.networkCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => `network${cb.id.replace('use-network', '')}`);

        if (enabledNetworks.length === 0) {
            this.tg.showAlert('Пожалуйста, включите хотя бы одну нейросеть для обсуждения.');
            return;
        }

        const settings = {
            topic: projectDescription.trim(),
            iterations: parseInt(this.elements.iterationInput.value, 10),
            enabled_networks: enabledNetworks,
            temperature: parseFloat(this.elements.tempValue.textContent),
            max_tokens: parseInt(this.elements.tokensValue.textContent, 10),
            model: "GPT-4o (новейшая)" // Модель по умолчанию, можно добавить выбор в UI
        };

        this.tg.sendData(JSON.stringify(settings));

        this.tg.showPopup({
            title: 'Принято!',
            message: 'Запускаю коллаборацию. Результаты будут появляться в чате с ботом.',
            buttons: [{ type: 'ok', text: 'Понятно' }]
        }, () => {
            this.tg.close();
        });
    }

    syncSliderValues(element) {
        if (element.id === 'max-iterations' || element.id === 'max-iterations-input') {
            const value = element.value;
            this.elements.iterationInput.value = value;
            this.elements.iterationSlider.value = value;
            this.elements.iterationValue.textContent = value;
        }
        if (element.id === 'temperature') {
            this.elements.tempValue.textContent = (element.value / 10).toFixed(1);
        }
        if (element.id === 'max-tokens') {
            this.elements.tokensValue.textContent = element.value;
        }
    }

    toggleAdvancedSettings() {
        const panel = this.elements.advancedSettingsPanel;
        const button = this.elements.toggleSettingsBtn;
        
        panel.classList.toggle('visible');
        button.textContent = panel.classList.contains('visible') ? 'Hide' : 'Show';
    }
}

// =========================================================================
// === ТОЧКА ВХОДА ПРИЛОЖЕНИЯ (из старого app.js) ===
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем все системы
    new DarkModeManager();
    const mafiaMode = new MafiaMode();
    mafiaMode.initialize();
    
    // Инициализируем главный фреймворк, только если мы на нужной странице
    if (window.location.hash !== '#mafia' && window.location.hash !== '#wiki') {
        const framework = new NeuralCollaborativeFramework();
    }
});

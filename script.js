// Глобальные переменные
let magicUser = null;
let currentTest = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let testData = {};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('✨ Единорожья Гавань загружается...');
    
    initMagicParticles();
    initUserData();
    initEventListeners();
    
    console.log('✨ Инициализация завершена');
});

// Инициализация волшебных частичек
function initMagicParticles() {
    const particlesContainer = document.getElementById('magicParticles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'magic-particle';
        
        // Случайные свойства
        const size = Math.random() * 15 + 5;
        const color = getRandomRainbowColor();
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 20;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            top: -50px;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Инициализация данных пользователя
function initUserData() {
    const savedUser = localStorage.getItem('magicUnicornUser');
    if (savedUser) {
        try {
            magicUser = JSON.parse(savedUser);
            console.log('👤 Найден сохраненный пользователь:', magicUser);
            showMagicTests();
            updateUnicornBadge();
            loadUserTests();
        } catch (e) {
            console.error('❌ Ошибка загрузки пользователя:', e);
            localStorage.removeItem('magicUnicornUser');
        }
    }
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Кнопка начала
    const startBtn = document.getElementById('startMagicBtn');
    if (startBtn) {
        startBtn.addEventListener('click', openMagicPortal);
    }
    
    // Форма регистрации
    const unicornForm = document.getElementById('unicornForm');
    if (unicornForm) {
        unicornForm.addEventListener('submit', registerMagicUser);
    }
    
    // Закрытие портала при клике вне формы
    const portal = document.getElementById('unicornPortal');
    if (portal) {
        portal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeMagicPortal();
            }
        });
    }
    
    // Валидация буквы класса
    const letterInput = document.getElementById('unicornLetter');
    if (letterInput) {
        letterInput.addEventListener('input', function(e) {
            this.value = this.value.toUpperCase();
            if (this.value && !/^[А-ЯЁ]?$/.test(this.value)) {
                this.value = '';
            }
        });
    }
}

// Открытие портала регистрации
function openMagicPortal() {
    const portal = document.getElementById('unicornPortal');
    if (portal) {
        portal.style.display = 'flex';
        resetFormErrors();
        console.log('🚪 Порта открыт');
    }
}

// Закрытие портала регистрации
function closeMagicPortal() {
    const portal = document.getElementById('unicornPortal');
    if (portal) {
        portal.style.display = 'none';
        console.log('🚪 Порта закрыт');
    }
}

// Регистрация пользователя
function registerMagicUser(e) {
    e.preventDefault();
    console.log('📝 Регистрация пользователя...');
    
    // Анимация кнопки
    const submitBtn = document.getElementById('unicornSubmitBtn');
    startButtonLoading(submitBtn, 'Открываем портал...');
    
    // Получение данных формы
    const formData = getFormData();
    
    // Валидация
    if (!validateForm(formData)) {
        stopButtonLoading(submitBtn, 'Открыть Портал к Тестам!');
        return;
    }
    
    // Создание пользователя
    magicUser = createMagicUser(formData);
    
    // Сохранение
    if (!saveUserData(magicUser)) {
        stopButtonLoading(submitBtn, 'Открыть Портал к Тестам!');
        return;
    }
    
    // Успешная регистрация
    showFormSuccess();
    
    setTimeout(() => {
        closeMagicPortal();
        stopButtonLoading(submitBtn, 'Открыть Портал к Тестам!');
        showMagicTests();
        updateUnicornBadge();
        showMagicConfetti();
        loadUserTests();
        
        // Добавление обработчиков тестов
        setTimeout(initTestButtons, 100);
        
        console.log('✅ Регистрация завершена');
        showToast('✨ Добро пожаловать в Единорожью Гавань!', 'success');
    }, 1500);
}

// Получение данных формы
function getFormData() {
    return {
        name: document.getElementById('unicornName').value.trim(),
        surname: document.getElementById('unicornSurname').value.trim(),
        grade: document.getElementById('unicornGrade').value,
        letter: document.getElementById('unicornLetter').value.trim().toUpperCase(),
        birth: document.getElementById('unicornBirth').value,
        unicornType: document.getElementById('unicornType').value
    };
}

// Валидация формы
function validateForm(data) {
    resetFormErrors();
    let isValid = true;
    
    // Имя
    if (!data.name) {
        showError('unicornName', 'Введите волшебное имя');
        isValid = false;
    } else if (!/^[а-яА-ЯёЁ\s-]{2,}$/.test(data.name)) {
        showError('unicornName', 'Имя должно содержать только русские буквы и быть не короче 2 символов');
        isValid = false;
    }
    
    // Фамилия
    if (!data.surname) {
        showError('unicornSurname', 'Введите фамилию чародея');
        isValid = false;
    } else if (!/^[а-яА-ЯёЁ\s-]{2,}$/.test(data.surname)) {
        showError('unicornSurname', 'Фамилия должна содержать только русские буквы и быть не короче 2 символов');
        isValid = false;
    }
    
    // Класс
    if (!data.grade) {
        showError('unicornGrade', 'Выберите магический класс');
        isValid = false;
    }
    
    // Буква класса
    if (data.letter && !/^[А-ЯЁ]$/.test(data.letter)) {
        showError('unicornLetter', 'Введите одну русскую букву (А-Я)');
        isValid = false;
    }
    
    return isValid;
}

// Создание пользователя
function createMagicUser(data) {
    return {
        id: Date.now(),
        magicName: data.name,
        magicSurname: data.surname,
        fullMagicName: `${data.name} "${getUnicornNickname(data.name)}" ${data.surname}`,
        magicGrade: data.letter ? `${data.grade}${data.letter}` : `${data.grade}`,
        unicornType: data.unicornType || 'rainbow',
        birthDate: data.birth,
        registrationDate: new Date().toLocaleDateString('ru-RU'),
        magicTests: [],
        unicornColor: getRandomRainbowColor(),
        completedTests: []
    };
}

// Сохранение данных пользователя
function saveUserData(user) {
    try {
        localStorage.setItem('magicUnicornUser', JSON.stringify(user));
        console.log('💾 Пользователь сохранен');
        return true;
    } catch (e) {
        console.error('❌ Ошибка сохранения:', e);
        showToast('⚠️ Не удалось сохранить данные. Проверьте настройки браузера.', 'error');
        return false;
    }
}

// Функции для работы с UI
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const group = field?.closest('.ios-form-group');
    
    if (field && group) {
        field.classList.add('error');
        field.classList.remove('success');
        
        // Удаление старых сообщений
        const oldError = group.querySelector('.error-message');
        if (oldError) oldError.remove();
        
        // Добавление нового сообщения
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        group.appendChild(errorDiv);
    }
}

function showFormSuccess() {
    ['unicornName', 'unicornSurname', 'unicornGrade', 'unicornLetter', 'unicornBirth', 'unicornType']
        .forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && field.value) {
                field.classList.add('success');
                field.classList.remove('error');
            }
        });
}

function resetFormErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.ios-form-input, .ios-form-select').forEach(field => {
        field.classList.remove('error', 'success');
    });
}

function startButtonLoading(button, text) {
    if (!button) return;
    button.classList.add('submitting');
    button.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        ${text}
    `;
}

function stopButtonLoading(button, text) {
    if (!button) return;
    button.classList.remove('submitting');
    button.innerHTML = `
        <i class="fas fa-portal-enter"></i>
        ${text}
        <i class="fas fa-unicorn"></i>
    `;
}

// Вспомогательные функции
function getUnicornNickname(name) {
    const nicknames = {
        'А': 'Радужный', 'Б': 'Сверкающий', 'В': 'Лунный', 'Г': 'Звездный', 'Д': 'Волшебный',
        'Е': 'Магический', 'Ё': 'Сияющий', 'Ж': 'Блестящий', 'З': 'Загадочный', 'И': 'Таинственный',
        'Й': 'Сказочный', 'К': 'Великолепный', 'Л': 'Блистательный', 'М': 'Очаровательный',
        'Н': 'Величественный', 'О': 'Бесподобный', 'П': 'Невероятный', 'Р': 'Фантастический',
        'С': 'Удивительный', 'Т': 'Потрясающий', 'У': 'Необыкновенный', 'Ф': 'Исключительный',
        'Х': 'Незабываемый', 'Ц': 'Неописуемый', 'Ч': 'Неповторимый', 'Ш': 'Несравненный',
        'Щ': 'Бесподобный', 'Ъ': 'Великий', 'Ы': 'Могущественный', 'Ь': 'Мудрый', 'Э': 'Храбрый',
        'Ю': 'Добрый', 'Я': 'Верный'
    };
    
    const firstLetter = name.charAt(0).toUpperCase();
    return nicknames[firstLetter] || nicknames['А'];
}

function getRandomRainbowColor() {
    const colors = [
        '#FF6BCB', '#FF8E53', '#FFD166', '#06D6A0', '#118AB2',
        '#073B4C', '#EF476F', '#FFD166', '#06D6A0', '#118AB2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Показать секцию с тестами
function showMagicTests() {
    const mainHero = document.getElementById('mainHero');
    const magicTests = document.getElementById('magicTests');
    
    if (mainHero && magicTests) {
        mainHero.style.display = 'none';
        magicTests.style.display = 'block';
        initTestButtons();
    }
}

// Обновление бейджа пользователя
function updateUnicornBadge() {
    const badge = document.getElementById('unicornBadge');
    if (!badge) return;
    
    if (magicUser) {
        badge.innerHTML = `
            <div class="badge-content">
                <span class="badge-icon">🦄</span>
                <div class="badge-info">
                    <div class="badge-name">${magicUser.fullMagicName}</div>
                    <div class="badge-class">${magicUser.magicGrade} класс • ${getUnicornTypeName(magicUser.unicornType)}</div>
                </div>
            </div>
        `;
    } else {
        badge.innerHTML = `
            <div class="badge-content">
                <span class="badge-icon">🦄</span>
                <div class="badge-info">
                    <div class="badge-name">Гость Волшебства</div>
                    <div class="badge-class">Нажми "Начать" для входа</div>
                </div>
            </div>
        `;
    }
}

function getUnicornTypeName(type) {
    const types = {
        'rainbow': '🌈 Радужный',
        'sparkle': '✨ Сверкающий',
        'moon': '🌙 Лунный',
        'starlight': '🌟 Звездный',
        'flower': '🌸 Цветочный'
    };
    return types[type] || '🌈 Радужный';
}

// Инициализация кнопок тестов
function initTestButtons() {
    document.querySelectorAll('.start-magic-test').forEach(btn => {
        btn.removeEventListener('click', handleTestStart);
        btn.addEventListener('click', handleTestStart);
    });
}

function handleTestStart(e) {
    if (!magicUser) {
        openMagicPortal();
        showToast('✨ Сначала войди в волшебный мир!', 'info');
        return;
    }
    
    const testId = this.dataset.test;
    console.log(`🧪 Начинаем тест: ${testId}`);
    startMagicTest(testId);
}

// Загрузка тестов пользователя
function loadUserTests() {
    const completedTestsContainer = document.getElementById('completedTests');
    if (!completedTestsContainer || !magicUser) return;
    
    if (magicUser.completedTests && magicUser.completedTests.length > 0) {
        completedTestsContainer.innerHTML = magicUser.completedTests.map(test => `
            <div class="test-result-card">
                <h4>${getTestName(test.testId)}</h4>
                <div class="date">${test.date}</div>
                <div class="score">Результат: ${test.score}/100</div>
            </div>
        `).join('');
    } else {
        completedTestsContainer.innerHTML = `
            <div class="empty-tests">
                <p><i class="fas fa-magic"></i> Здесь появятся результаты твоих тестов</p>
            </div>
        `;
    }
}

function getTestName(testId) {
    const tests = {
        'mood': 'Радуга Настроений',
        'unicorn': 'Поиск Внутреннего Единорога',
        'friendship': 'Магия Дружбы',
        'future': 'Карта Волшебного Пути'
    };
    return tests[testId] || 'Неизвестный тест';
}

// Запуск теста
function startMagicTest(testId) {
    currentTest = testId;
    currentQuestionIndex = 0;
    userAnswers = [];
    
    // Загрузка данных теста
    testData = getTestData(testId);
    
    // Скрытие секции с тестами
    const magicTests = document.getElementById('magicTests');
    if (magicTests) {
        magicTests.style.display = 'none';
    }
    
    // Отображение теста
    showTestQuestion();
}

// Получение данных теста
function getTestData(testId) {
    const tests = {
        'mood': {
            title: '🌈 Радуга Настроений',
            description: 'Узнай, какие эмоции живут в твоем волшебном сердце!',
            questions: [
                {
                    text: 'Как ты обычно чувствуешь себя утром?',
                    answers: [
                        { text: 'Полон энергии и готов к приключениям!', score: 10 },
                        { text: 'Спокойно и умиротворенно', score: 7 },
                        { text: 'Немного сонно, но в целом неплохо', score: 5 },
                        { text: 'Раздражительно, хочется поспать еще', score: 3 }
                    ]
                },
                {
                    text: 'Когда случается что-то неприятное, что ты делаешь?',
                    answers: [
                        { text: 'Ищу решение проблемы', score: 10 },
                        { text: 'Думаю о хорошем', score: 8 },
                        { text: 'Рассказываю друзьям', score: 6 },
                        { text: 'Расстраиваюсь и переживаю', score: 4 }
                    ]
                },
                {
                    text: 'Как ты относишься к новым знакомствам?',
                    answers: [
                        { text: 'Обожаю знакомиться с новыми людьми!', score: 10 },
                        { text: 'С интересом, но осторожно', score: 8 },
                        { text: 'Нейтрально', score: 5 },
                        { text: 'Предпочитаю старых друзей', score: 3 }
                    ]
                }
            ]
        },
        'unicorn': {
            title: '🦄 Поиск Внутреннего Единорога',
            description: 'Определи свои суперспособности!',
            questions: [
                {
                    text: 'Какая суперсила тебе больше нравится?',
                    answers: [
                        { text: 'Летать в облаках', score: 10 },
                        { text: 'Исцелять сердца', score: 9 },
                        { text: 'Видеть будущее', score: 8 },
                        { text: 'Говорить с животными', score: 7 }
                    ]
                },
                {
                    text: 'Что бы ты сделал с магическим рогом?',
                    answers: [
                        { text: 'Использовал бы для добрых дел', score: 10 },
                        { text: 'Изучал бы его возможности', score: 8 },
                        { text: 'Скрывал бы от всех', score: 6 },
                        { text: 'Показывал бы друзьям', score: 7 }
                    ]
                },
                {
                    text: 'Какой цвет тебе больше подходит?',
                    answers: [
                        { text: 'Радужный', score: 10 },
                        { text: 'Серебристый', score: 8 },
                        { text: 'Золотой', score: 7 },
                        { text: 'Бирюзовый', score: 6 }
                    ]
                }
            ]
        },
        'friendship': {
            title: '✨ Магия Дружбы',
            description: 'Проверь свои навыки общения!',
            questions: [
                {
                    text: 'Друг рассказал тебе секрет. Что сделаешь?',
                    answers: [
                        { text: 'Никому не расскажу', score: 10 },
                        { text: 'Расскажу только самому близкому другу', score: 6 },
                        { text: 'Посоветуюсь с родителями', score: 8 },
                        { text: 'Использую, чтобы помочь другу', score: 9 }
                    ]
                },
                {
                    text: 'Твой друг расстроен. Как поможешь?',
                    answers: [
                        { text: 'Выслушаю и поддержу', score: 10 },
                        { text: 'Предложу развлечения', score: 7 },
                        { text: 'Да совет', score: 6 },
                        { text: 'Просто буду рядом', score: 8 }
                    ]
                },
                {
                    text: 'Как ты решаешь конфликты?',
                    answers: [
                        { text: 'Стараюсь понять другую сторону', score: 10 },
                        { text: 'Предлагаю компромисс', score: 9 },
                        { text: 'Ухожу от конфликта', score: 5 },
                        { text: 'Настаиваю на своем', score: 3 }
                    ]
                }
            ]
        },
        'future': {
            title: '🌟 Карта Волшебного Пути',
            description: 'Определи свой путь к мечте!',
            questions: [
                {
                    text: 'Что для тебя важно в будущей профессии?',
                    answers: [
                        { text: 'Возможность помогать другим', score: 10 },
                        { text: 'Интересные задачи', score: 9 },
                        { text: 'Хороший доход', score: 7 },
                        { text: 'Свобода творчества', score: 8 }
                    ]
                },
                {
                    text: 'Как ты учишься новому?',
                    answers: [
                        { text: 'С большим интересом', score: 10 },
                        { text: 'Старательно, но без фанатизма', score: 8 },
                        { text: 'Когда это необходимо', score: 6 },
                        { text: 'С трудом', score: 4 }
                    ]
                },
                {
                    text: 'Какая сфера тебя привлекает?',
                    answers: [
                        { text: 'Наука и технологии', score: 10 },
                        { text: 'Искусство и творчество', score: 9 },
                        { text: 'Общение и помощь людям', score: 8 },
                        { text: 'Бизнес и управление', score: 7 }
                    ]
                }
            ]
        }
    };
    
    return tests[testId] || tests.mood;
}

// Показать вопрос теста
function showTestQuestion() {
    const testCastle = document.getElementById('testCastle');
    if (!testCastle) return;
    
    const question = testData.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / testData.questions.length) * 100;
    
    testCastle.innerHTML = `
        <div class="test-container">
            <div class="test-header">
                <h2><i class="fas fa-crystal-ball"></i> ${testData.title}</h2>
                <p>${testData.description}</p>
            </div>
            
            <div class="test-progress">
                <div class="test-progress-bar" style="width: ${progress}%"></div>
            </div>
            
            <div class="question-container">
                <div class="question-number">Вопрос ${currentQuestionIndex + 1} из ${testData.questions.length}</div>
                <div class="question-text">${question.text}</div>
                
                <div class="answers-container">
                    ${question.answers.map((answer, index) => `
                        <div class="answer-option ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}" 
                             data-index="${index}">
                            <div class="checkmark"></div>
                            <div class="answer-text">${answer.text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="test-navigation">
                <button class="test-button prev" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left"></i> Назад
                </button>
                
                <button class="test-button next" ${!userAnswers[currentQuestionIndex] ? 'disabled' : ''}>
                    ${currentQuestionIndex === testData.questions.length - 1 ? 'Завершить тест' : 'Далее'}
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
    
    // Обработчики ответов
    document.querySelectorAll('.answer-option').forEach(option => {
        option.addEventListener('click', function() {
            selectAnswer(parseInt(this.dataset.index));
        });
    });
    
    // Обработчики навигации
    document.querySelector('.test-button.prev').addEventListener('click', goToPreviousQuestion);
    document.querySelector('.test-button.next').addEventListener('click', goToNextQuestion);
}

// Выбор ответа
function selectAnswer(answerIndex) {
    userAnswers[currentQuestionIndex] = answerIndex;
    
    // Сброс выделения
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Выделение выбранного
    document.querySelector(`.answer-option[data-index="${answerIndex}"]`).classList.add('selected');
    
    // Активация кнопки "Далее"
    document.querySelector('.test-button.next').disabled = false;
}

// Переход к предыдущему вопросу
function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showTestQuestion();
    }
}

// Переход к следующему вопросу
function goToNextQuestion() {
    if (userAnswers[currentQuestionIndex] === undefined) {
        showToast('📝 Выбери ответ, чтобы продолжить!', 'warning');
        return;
    }
    
    if (currentQuestionIndex < testData.questions.length - 1) {
        currentQuestionIndex++;
        showTestQuestion();
    } else {
        finishTest();
    }
}

// Завершение теста
function finishTest() {
    // Расчет результатов
    let totalScore = 0;
    testData.questions.forEach((question, index) => {
        const answerIndex = userAnswers[index];
        if (answerIndex !== undefined) {
            totalScore += question.answers[answerIndex].score;
        }
    });
    
    const maxScore = testData.questions.length * 10;
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    // Определение результата
    let result = '';
    let description = '';
    let icon = '';
    
    if (percentage >= 90) {
        result = 'Великий Волшебник!';
        description = 'Ты обладаешь невероятными способностями! Твоя магия сияет ярче всех звезд на небе. Продолжай развивать свой дар!';
        icon = '🌟';
    } else if (percentage >= 70) {
        result = 'Опытный Чародей';
        description = 'Твои навыки впечатляют! Ты на верном пути к великим свершениям. Не останавливайся на достигнутом!';
        icon = '✨';
    } else if (percentage >= 50) {
        result = 'Юный Волшебник';
        description = 'У тебя хороший потенциал! Продолжай учиться и практиковаться, и ты станешь великим магом!';
        icon = '🦄';
    } else {
        result = 'Начинающий Чародей';
        description = 'Каждый великий волшебник начинал с малого! У тебя все впереди - учись, практикуйся и верь в себя!';
        icon = '🌈';
    }
    
    // Сохранение результата
    saveTestResult(percentage);
    
    // Показ результатов
    showTestResult(percentage, result, description, icon);
}

// Сохранение результата теста
function saveTestResult(score) {
    if (!magicUser) return;
    
    if (!magicUser.completedTests) {
        magicUser.completedTests = [];
    }
    
    magicUser.completedTests.push({
        testId: currentTest,
        score: score,
        date: new Date().toLocaleDateString('ru-RU')
    });
    
    saveUserData(magicUser);
}

// Показать результат теста
function showTestResult(score, result, description, icon) {
    const testCastle = document.getElementById('testCastle');
    if (!testCastle) return;
    
    testCastle.innerHTML = `
        <div class="test-container">
            <div class="result-container">
                <div class="result-icon">${icon}</div>
                <h2 class="result-title">${result}</h2>
                <div class="result-score">${score}%</div>
                <p class="result-description">${description}</p>
                
                <div class="result-details">
                    <div class="result-detail">
                        <h4>Твой тип</h4>
                        <p>${getTestName(currentTest)}</p>
                    </div>
                    <div class="result-detail">
                        <h4>Уровень магии</h4>
                        <p>${score >= 70 ? 'Высокий' : score >= 50 ? 'Средний' : 'Начинающий'}</p>
                    </div>
                    <div class="result-detail">
                        <h4>Дата прохождения</h4>
                        <p>${new Date().toLocaleDateString('ru-RU')}</p>
                    </div>
                </div>
                
                <div class="result-actions">
                    <button class="magic-btn" id="backToTests">
                        <i class="fas fa-home"></i>
                        К списку тестов
                    </button>
                    <button class="magic-btn" id="shareResult">
                        <i class="fas fa-share-alt"></i>
                        Поделиться
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Обработчики кнопок
    document.getElementById('backToTests').addEventListener('click', showTestList);
    document.getElementById('shareResult').addEventListener('click', shareTestResult);
    
    // Конфетти
    showMagicConfetti();
}

// Вернуться к списку тестов
function showTestList() {
    const testCastle = document.getElementById('testCastle');
    const magicTests = document.getElementById('magicTests');
    
    if (testCastle) testCastle.innerHTML = '';
    if (magicTests) {
        magicTests.style.display = 'block';
        loadUserTests();
    }
}

// Поделиться результатом
function shareTestResult() {
    if (navigator.share) {
        navigator.share({
            title: 'Мой результат в Единорожьей Гавани!',
            text: `Я прошел тест "${getTestName(currentTest)}" и получил результат! Присоединяйся к волшебству!`,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('🔗 Ссылка скопирована!', 'success');
    }
}

// Волшебное конфетти
function showMagicConfetti() {
    const colors = [
        '#FF6BCB', '#FF8E53', '#FFD166', '#06D6A0', '#118AB2',
        '#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C'
    ];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfettiParticle(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 20);
    }
}

function createConfettiParticle(color) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 15px;
        height: 15px;
        background: ${color};
        border-radius: 50%;
        top: -20px;
        left: ${Math.random() * 100}%;
        z-index: 9999;
        pointer-events: none;
        animation: confettiFall ${1 + Math.random() * 2}s linear forwards;
        box-shadow: 0 0 10px ${color};
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 2000);
}

// Добавление стилей для анимации конфетти
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(${Math.random() * 360}deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Уведомления
function showToast(message, type = 'info') {
    const colors = {
        success: 'linear-gradient(135deg, #06D6A0, #118AB2)',
        error: 'linear-gradient(135deg, #EF476F, #FF8E53)',
        warning: 'linear-gradient(135deg, #FFD166, #FF8E53)',
        info: 'linear-gradient(135deg, #9370DB, #FF6BCB)'
    };
    
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: colors[type] || colors.info,
        stopOnFocus: true,
        className: "unicorn-toast",
        style: {
            borderRadius: "15px",
            padding: "15px 25px",
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
        }
    }).showToast();
}
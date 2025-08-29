// Questions du diagnostic
const questions = [
    {
        id: 'emails',
        title: 'Emails & Communication',
        source: 'Source: McKinsey Institute - "Email productivity in Swiss SME", 2024',
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
               </svg>`,
        question: 'Combien de temps passez-vous par jour sur les emails et communications ?',
        options: [
            { label: '15-30 min (PME efficaces)', value: 22.5, gain: 25 },
            { label: '30-60 min (moyenne CH)', value: 45, gain: 25 },
            { label: '1-2 heures (fréquent)', value: 90, gain: 25 },
            { label: '2-3 heures (sur-communication)', value: 150, gain: 25 },
            { label: '3+ heures (critique)', value: 210, gain: 30 }
        ]
    },
    {
        id: 'prospection',
        title: 'Prospection & Suivi Commercial',
        source: 'Source: HubSpot "Swiss Sales Productivity Report", 2024',
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="m22 21-3-3m0 0a2 2 0 1 0-2.83-2.83A2 2 0 0 0 19 18Z"></path>
               </svg>`,
        question: 'Temps consacré à la prospection et suivi commercial par jour ?',
        options: [
            { label: '30 min (B2B simple)', value: 30, gain: 40 },
            { label: '1 heure (standard CH)', value: 60, gain: 45 },
            { label: '2 heures (vente active)', value: 120, gain: 50 },
            { label: '3 heures (commercial intensif)', value: 180, gain: 55 },
            { label: '4+ heures (full sales)', value: 240, gain: 60 }
        ]
    },
    {
        id: 'facturation',
        title: 'Facturation & Suivi des Paiements',
        source: 'Source: Teamleader "Swiss SME Administrative Tasks", 2024',
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
               </svg>`,
        question: 'Temps hebdomadaire sur facturation et suivi paiements ?',
        options: [
            { label: '30 min/sem (micro-entreprise)', value: 30, gain: 25, weekly: true },
            { label: '1h/sem (petite PME)', value: 60, gain: 25, weekly: true },
            { label: '2h/sem (PME standard)', value: 120, gain: 30, weekly: true },
            { label: '3h/sem (multi-clients)', value: 180, gain: 30, weekly: true },
            { label: '4h+/sem (complexe)', value: 240, gain: 35, weekly: true }
        ]
    },
    {
        id: 'reporting',
        title: 'Reporting & Tableaux de Bord',
        source: 'Source: McKinsey "Data Management in Swiss Companies", 2024',
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
               </svg>`,
        question: 'Temps hebdomadaire pour reporting et analyses ?',
        options: [
            { label: '30 min/sem (basique)', value: 30, gain: 35, weekly: true },
            { label: '1h/sem (suivi régulier)', value: 60, gain: 40, weekly: true },
            { label: '2h/sem (reporting détaillé)', value: 120, gain: 45, weekly: true },
            { label: '3h/sem (analyses poussées)', value: 180, gain: 45, weekly: true },
            { label: '3h+/sem (reporting complexe)', value: 210, gain: 50, weekly: true }
        ]
    },
    {
        id: 'planification',
        title: 'Planification & Organisation',
        source: 'Source: AXA "Swiss Workplace Efficiency Study", 2024',
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
               </svg>`,
        question: 'Temps hebdomadaire pour planification RDV et ressources ?',
        options: [
            { label: '30 min/sem (agenda simple)', value: 30, gain: 25, weekly: true },
            { label: '45 min/sem (coordination équipe)', value: 45, gain: 25, weekly: true },
            { label: '1h/sem (planification standard)', value: 60, gain: 25, weekly: true },
            { label: '1h30/sem (multi-projets)', value: 90, gain: 30, weekly: true },
            { label: '2h+/sem (coordination complexe)', value: 120, gain: 30, weekly: true }
        ]
    }
];

// Variables globales
let currentStep = 0;
let answers = {};

// Formate les montants en CHF
function formatCHF(amount) {
    return new Intl.NumberFormat('fr-CH', {
        style: 'currency',
        currency: 'CHF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Affiche une question
function displayQuestion() {
    const question = questions[currentStep];

    // Met à jour la progression
    document.getElementById('progressText').textContent = `Question ${currentStep + 1} sur ${questions.length}`;
    document.getElementById('progressPercent').textContent = `${Math.round(((currentStep + 1) / questions.length) * 100)}%`;
    document.getElementById('progressBar').style.width = `${((currentStep + 1) / questions.length) * 100}%`;

    // Met à jour le contenu de la question
    document.getElementById('questionIcon').innerHTML = question.icon;
    document.getElementById('questionTitleText').textContent = question.title;
    document.getElementById('questionSource').setAttribute('data-tooltip', question.source);
    document.getElementById('questionText').textContent = question.question;

    // Met à jour les options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'w-full p-4 text-left bg-gray-700/30 hover:bg-gray-700/60 rounded-lg border border-gray-600 hover:border-yellow-400/50 transition-all group';
        button.onclick = () => handleAnswer(question.id, option);
        button.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="font-medium">${option.label}</span>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
            </div>
        `;
        optionsContainer.appendChild(button);
    });

    // Affiche/masque le message d'introduction
    document.getElementById('introMessage').style.display = currentStep === 0 ? 'block' : 'none';
}

// Met à jour la bannière de progression
function updateProgressBanner() {
    if (Object.keys(answers).length === 0) return;
    const results = calculateResults();

    // Affiche la bannière après la première réponse
    const banner = document.getElementById('progressBanner');
    banner.classList.remove('hidden');

    // Met à jour la jauge
    const gaugeCircle = document.getElementById('bannerGauge');
    const circumference = 2 * Math.PI * 45; // rayon = 45
    const progress = (results.automationScore / 100) * circumference;
    gaugeCircle.style.strokeDasharray = `${progress} ${circumference}`;

    // Met à jour les valeurs
    document.getElementById('bannerScore').textContent = results.automationScore;
    document.getElementById('bannerTime').textContent = `${results.weeklyHoursSaved}h/sem`;
    document.getElementById('bannerValue').textContent = formatCHF(results.yearlyValueCHF);
}

// Gère la réponse à une question
function handleAnswer(questionId, option) {
    answers[questionId] = option;

    // Met à jour la bannière de progression
    updateProgressBanner();

    if (currentStep < questions.length - 1) {
        currentStep++;
        displayQuestion();
    } else {
        showResults();
    }
}

// Calcule les résultats
function calculateResults() {
    let totalWeeklyMinutes = 0;
    let totalWeeklySaved = 0;
    let details = {};

    Object.entries(answers).forEach(([questionId, option]) => {
        const question = questions.find(q => q.id === questionId);
        const weeklyMinutes = option.weekly ? option.value : option.value * 5;
        const savedMinutes = Math.round(weeklyMinutes * (option.gain / 100));

        totalWeeklyMinutes += weeklyMinutes;
        totalWeeklySaved += savedMinutes;

        details[questionId] = {
            title: question.title,
            current: weeklyMinutes,
            saved: savedMinutes,
            gain: option.gain
        };
    });

    const yearlyHoursSaved = Math.round((totalWeeklySaved * 50) / 60);
    const yearlyValueCHF = yearlyHoursSaved * 60;

    // Score réaliste basé sur le potentiel réel d'automatisation
    const baseScore = Math.round((totalWeeklySaved / Math.max(totalWeeklyMinutes, 1)) * 100);
    const automationScore = Math.min(75, Math.max(15, baseScore)); // Entre 15% et 75% max

    return {
        weeklyMinutesSaved: totalWeeklySaved,
        weeklyHoursSaved: Math.round(totalWeeklySaved / 60 * 10) / 10,
        yearlyHoursSaved,
        yearlyValueCHF,
        automationScore,
        details
    };
}

// Affiche les résultats
function showResults() {
    const results = calculateResults();

    // Cache la vue des questions et la bannière
    document.getElementById('questionView').style.display = 'none';
    document.getElementById('questionFooter').style.display = 'none';
    document.getElementById('progressBanner').classList.add('hidden');

    // Affiche la vue des résultats
    document.getElementById('resultsView').classList.remove('hidden');
    document.getElementById('resetBtn').classList.remove('hidden');

    // Met à jour la jauge principale
    const mainGauge = document.getElementById('mainGauge');
    const circumference = 2 * Math.PI * 45;
    const progress = (results.automationScore / 100) * circumference;
    mainGauge.style.setProperty('--gauge-value', progress);

    // Met à jour le contenu des résultats
    document.getElementById('automationScore').textContent = results.automationScore;
    document.getElementById('weeklyHours').textContent = `${results.weeklyHoursSaved}h/semaine`;
    document.getElementById('weeklyHoursDetail').textContent = `${results.weeklyHoursSaved} heures`;
    document.getElementById('yearlyHours').textContent = `${results.yearlyHoursSaved} heures`;
    document.getElementById('yearlyValue').textContent = formatCHF(results.yearlyValueCHF);

    // Crée le graphique
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.innerHTML = '';

    const maxHours = Math.max(...Object.values(results.details).map(d => d.saved / 60));

    Object.entries(results.details).forEach(([key, detail], index) => {
        const barWidth = maxHours > 0 ? (detail.saved / 60) / maxHours * 100 : 0;

        const chartItem = document.createElement('div');
        chartItem.className = 'relative';
        chartItem.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-sm">${detail.title}</h4>
                <span class="text-yellow-400 font-semibold">
                    -${Math.round(detail.saved / 60 * 10) / 10}h/sem
                </span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-6 relative overflow-hidden">
                <div class="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3 animate-slide-bar"
                     style="width: ${barWidth}%; animation-delay: ${index * 0.2}s;">
                    <span class="text-black text-xs font-bold">${detail.gain}%</span>
                </div>
            </div>
        `;
        chartContainer.appendChild(chartItem);
    });
}

// Calcule le plan personnalisé
function calculatePlan() {
    // Action pour "Calculer mon plan personnalisé"
    alert("Cette fonctionnalité ouvrirait une page dédiée pour un plan personnalisé.");
}

// Action du bouton CTA de la bannière
document.getElementById('bannerCTA').onclick = function() {
    if (Object.keys(answers).length === questions.length) {
        showResults();
        document.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Continue vers la question suivante ou affiche les résultats
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Réinitialise le diagnostic
function resetDiagnostic() {
    currentStep = 0;
    answers = {};

    // Cache la bannière
    document.getElementById('progressBanner').classList.add('hidden');

    // Affiche la vue des questions
    document.getElementById('questionView').style.display = 'block';
    document.getElementById('questionFooter').style.display = 'block';

    // Cache la vue des résultats
    document.getElementById('resultsView').classList.add('hidden');
    document.getElementById('resetBtn').classList.add('hidden');

    // Réinitialise à la première question
    displayQuestion();
}

// Initialisation
displayQuestion();

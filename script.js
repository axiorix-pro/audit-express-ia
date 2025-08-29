// Variables globales pour le suivi des emails traités
let processedEmails = 847;
let isProcessing = false;

// Réponses prédéfinies pour chaque catégorie d'email
const responses = {
    devis: [
        "Bonjour Sarah, merci pour votre demande de devis. Notre équipe d'experts va étudier votre projet de rénovation cuisine et vous proposer plusieurs options personnalisées. Vous recevrez notre devis détaillé sous 48h maximum. Un de nos conseillers vous contactera également pour planifier une visite technique gratuite. Cordialement, l'équipe commerciale.",
        "Bonjour, nous avons bien reçu votre demande concernant la rénovation de votre cuisine. Un de nos spécialistes va vous contacter dans les prochaines heures pour planifier une visite technique gratuite. En attendant, voici un lien vers notre catalogue de réalisations récentes. Bien à vous.",
    ],
    livraison: [
        "Bonjour Thomas, votre commande #CMD-2024-1158 est actuellement en préparation dans nos entrepôts. L'expédition est prévue demain et vous devriez recevoir votre colis d'ici 2-3 jours ouvrés. Un email de suivi avec le numéro de tracking vous sera envoyé automatiquement. Cordialement, le service logistique.",
        "Merci pour votre patience ! Votre commande est en cours d'acheminement. Vous pouvez suivre son avancement en temps réel sur notre portail client avec vos identifiants. Livraison estimée : vendredi avant 18h. Notre service client reste à votre disposition pour toute question.",
    ],
    facturation: [
        "Bonjour Marie, nous vous renvoyons immédiatement votre facture de juin 2024 en pièce jointe. Pour éviter tout problème futur, nous vous recommandons de créer un espace client sécurisé où toutes vos factures seront automatiquement archivées et accessibles 24h/24. Cordialement, le service comptabilité.",
        "Pas de problème ! Votre facture du mois de juin est en pièce jointe de ce message. Vous pouvez également la retrouver dans votre espace personnel sur notre site web. Nous en profitons pour vous informer de nos nouvelles options de facturation électronique.",
    ],
    support: [
        "Bonjour Jean, nous sommes désolés pour ce désagrément. Votre produit est effectivement encore sous garantie. Merci de nous communiquer votre numéro de commande et quelques photos du défaut constaté via notre portail SAV. Nous organiserons immédiatement un échange ou une réparation gratuite. Cordialement, le service après-vente.",
        "Nous prenons votre problème très au sérieux. Un technicien spécialisé va examiner votre dossier et vous contacter dans les 24h pour organiser la prise en charge sous garantie. En attendant, cessez d'utiliser le produit par précaution. Un bon de retour prépayé vous sera envoyé si nécessaire.",
    ]
};

// Étapes du traitement affichées dans le panneau de traitement
const processingSteps = [
    {
        title: "📧 Réception Email",
        content: "Email entrant détecté et capturé par le trigger n8n"
    },
    {
        title: "🔍 Analyse du Contenu",
        content: "Extraction du contenu, de l'expéditeur et du sujet"
    },
    {
        title: "🧠 Classification IA",
        content: "Analyse sémantique par IA pour déterminer la catégorie"
    },
    {
        title: "📝 Génération de Réponse",
        content: "Création d'une réponse personnalisée basée sur la catégorie"
    },
    {
        title: "✅ Validation",
        content: "Vérification de la cohérence et de la pertinence"
    },
    {
        title: "📤 Envoi Automatique",
        content: "Envoi de la réponse via SMTP sécurisé"
    }
];

// Réinitialise l'état du workflow
function resetWorkflow() {
    for (let i = 1; i <= 4; i++) {
        const node = document.getElementById(`node-${i}`);
        const status = node.querySelector('.node-status');
        node.className = 'node';
        status.textContent = '⏸️';
    }

    for (let i = 1; i <= 3; i++) {
        document.getElementById(`connection-${i}`).classList.remove('active');
    }

    document.getElementById('processingPanel').classList.remove('active');
}

// Active un nœud avec un statut spécifique
function activateNode(nodeNumber, status = 'active') {
    const node = document.getElementById(`node-${nodeNumber}`);
    const statusEl = node.querySelector('.node-status');

    node.className = `node ${status}`;

    if (status === 'active') {
        statusEl.textContent = '⚡';
    } else if (status === 'processing') {
        statusEl.textContent = '🔄';
    } else if (status === 'completed') {
        statusEl.textContent = '✅';
    }
}

// Active une connexion entre les nœuds
function activateConnection(connectionNumber) {
    document.getElementById(`connection-${connectionNumber}`).classList.add('active');
}

// Met à jour le panneau de traitement avec l'étape actuelle
function updateProcessingPanel(step) {
    const panel = document.getElementById('processingPanel');
    const title = document.getElementById('processingTitle');
    const content = document.getElementById('processingContent');

    if (step < processingSteps.length) {
        title.textContent = processingSteps[step].title;
        content.textContent = processingSteps[step].content;
        panel.classList.add('active');
    } else {
        panel.classList.remove('active');
    }
}

// Traite un email en simulant le workflow
async function processEmail(category, sender, subject, message) {
    if (isProcessing) return;
    isProcessing = true;

    resetWorkflow();

    const steps = [
        { node: 1, connection: null, duration: 1000, stepIndex: 0 },
        { node: 1, connection: 1, duration: 800, stepIndex: 1 },
        { node: 2, connection: null, duration: 1500, stepIndex: 2 },
        { node: 2, connection: 2, duration: 800, stepIndex: 3 },
        { node: 3, connection: null, duration: 2000, stepIndex: 4 },
        { node: 3, connection: 3, duration: 800, stepIndex: 5 },
        { node: 4, connection: null, duration: 1000, stepIndex: null }
    ];

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];

        if (step.stepIndex !== null) {
            updateProcessingPanel(step.stepIndex);
        }

        if (i === steps.length - 1) {
            activateNode(step.node, 'completed');
        } else {
            activateNode(step.node, i === 0 ? 'active' : 'processing');
        }

        await new Promise(resolve => setTimeout(resolve, step.duration));

        if (step.connection && i < steps.length - 1) {
            activateNode(step.node, 'completed');
            activateConnection(step.connection);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    activateNode(4, 'completed');
    updateProcessingPanel(processingSteps.length);

    processedEmails++;
    document.getElementById('processedCount').textContent = processedEmails;

    const responseTime = (1.5 + Math.random() * 1.5).toFixed(1);
    document.getElementById('responseTime').textContent = responseTime + 's';

    setTimeout(() => {
        const response = responses[category][Math.floor(Math.random() * responses[category].length)];
        showCompletionModal(sender, subject, response);
    }, 1000);

    setTimeout(() => {
        resetWorkflow();
        isProcessing = false;
    }, 5000);
}

// Affiche une fenêtre modale avec la réponse générée
function showCompletionModal(sender, subject, response) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a2e, #2a2a3e);
            border: 1px solid #4ecdc4;
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            color: white;
            box-shadow: 0 20px 60px rgba(78, 205, 196, 0.3);
        ">
            <div style="text-align: center; margin-bottom: 25px;">
                <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
                <h2 style="color: #4ecdc4; margin: 0;">Email Traité avec Succès!</h2>
            </div>
            <div style="margin-bottom: 20px;">
                <div style="background: #2a2a3e; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <strong>À:</strong> ${sender}<br>
                    <strong>Sujet:</strong> Re: ${subject}
                </div>
                <div style="background: #2a2a3e; padding: 15px; border-radius: 10px; max-height: 200px; overflow-y: auto;">
                    <strong>Réponse générée:</strong><br><br>
                    ${response}
                </div>
            </div>
            <div style="text-align: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                    background: linear-gradient(135deg, #4ecdc4, #00d2d3);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    Fermer
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        if (document.body.contains(modal)) {
            modal.remove();
        }
    }, 10000);
}

// Animation pour le compteur des emails traités
function animateCounter(id, start, end, duration) {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Ajoute des infobulles aux nœuds
function addTooltips() {
    const nodes = document.querySelectorAll('.node');
    nodes.forEach((node, index) => {
        const tooltips = [
            'Déclenche automatiquement le workflow lors de la réception d\'un email',
            'Utilise l\'IA GPT pour analyser et classifier le contenu de l\'email',
            'Génère une réponse personnalisée basée sur la catégorie détectée',
            'Envoie automatiquement la réponse via SMTP sécurisé'
        ];

        node.setAttribute('title', tooltips[index]);
    });
}

// Démarre une démonstration automatique
function startAutoDemo() {
    const emails = [
        { category: 'devis', sender: 'Sarah Martin', subject: 'Demande de devis cuisine complète', message: 'Bonjour, nous aimerions rénover notre cuisine de 25m².' },
        { category: 'livraison', sender: 'Thomas Dubois', subject: 'Suivi commande #CMD-2024-1158', message: 'Bonjour, je voudrais connaître le statut de ma commande.' },
        { category: 'facturation', sender: 'Marie Leroy', subject: 'Facture juin 2024 introuvable', message: 'Je ne retrouve pas ma facture du mois de juin.' },
        { category: 'support', sender: 'Jean Moreau', subject: 'Question garantie produit', message: 'J\'ai un produit qui présente un défaut.' }
    ];

    let currentIndex = 0;

    const processNext = () => {
        if (!isProcessing) {
            const email = emails[currentIndex];
            processEmail(email.category, email.sender, email.subject, email.message);
            currentIndex = (currentIndex + 1) % emails.length;
        }
    };

    setTimeout(() => {
        processNext();
        setInterval(processNext, 15000);
    }, 3000);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    animateCounter('processedCount', 800, 847, 2000);
    addTooltips();
});

// Raccourcis clavier pour contrôler la démonstration
document.addEventListener('keydown', (e) => {
    if (e.key === 'd' && e.ctrlKey) {
        e.preventDefault();
        startAutoDemo();
    }
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        resetWorkflow();
        isProcessing = false;
    }
});

// Mise à jour périodique des statistiques
setInterval(() => {
    if (!isProcessing) {
        const currentCount = parseInt(document.getElementById('processedCount').textContent);
        if (Math.random() > 0.7) {
            document.getElementById('processedCount').textContent = currentCount + 1;
        }

        const baseTime = 1.8;
        const variation = (Math.random() - 0.5) * 0.6;
        const newTime = Math.max(0.8, Math.min(3.2, baseTime + variation));
        document.getElementById('responseTime').textContent = newTime.toFixed(1) + 's';
    }
}, 5000);

// Effets visuels pour les connexions
document.querySelectorAll('.connection').forEach(connection => {
    connection.addEventListener('mouseenter', () => {
        if (!connection.classList.contains('active')) {
            connection.style.background = 'linear-gradient(90deg, #333, #666, #333)';
        }
    });

    connection.addEventListener('mouseleave', () => {
        if (!connection.classList.contains('active')) {
            connection.style.background = 'linear-gradient(90deg, #333, #4ecdc4, #333)';
        }
    });
});

// Effets de clic sur les nœuds pour le débogage
document.querySelectorAll('.node').forEach((node, index) => {
    node.addEventListener('click', () => {
        if (!isProcessing) {
            console.log(`🔧 Debug: Node ${index + 1} clicked`);
            const nodeTypes = ['Email Trigger', 'AI Classifier', 'Response Generator', 'Email Sender'];
            console.log(`Node Type: ${nodeTypes[index]}`);
            console.log(`Status: ${node.classList.contains('active') ? 'Active' : node.classList.contains('completed') ? 'Completed' : 'Idle'}`);
        }
    });
});

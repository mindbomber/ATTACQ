// quiz-logic.js
// Main quiz logic, UI, and localStorage management for ATTACQ
// ATTACQ = AI Trust Tier Access Control Quiz
// Depends on questions.js and results.js

(function() {
    // Screen management support
    let screenLoader = null;
      // Rogue mode management
    let rogueMode = null;
    
    // Starter questions management
    let starterQuestionsModule = null;// Check if screen loader is available from global scope
    function initializeScreenLoader() {
        if (typeof window !== 'undefined' && window.screenLoader) {
            screenLoader = window.screenLoader;
            console.log('✅ Screen loader available');
            return true;
        }
        console.log('🔄 Screen loader not available, using HTML fallback');
        return false;
    }

    // Initialize rogue mode
    async function initializeRogueMode() {
        try {
            const rogueModuleUrl = `./utils/rogue-mode.js?t=${Date.now()}`;
            const module = await import(rogueModuleUrl);
            rogueMode = module.rogueMode;
            console.log('✅ Rogue mode module loaded');
            return true;
        } catch (error) {
            console.warn('🔄 Rogue mode module not available, using fallback:', error.message);
            // Create minimal fallback
            rogueMode = {
                isActiveMode: () => false,
                isRogueModeUnlocked: () => false,
                activate: () => {},
                deactivate: () => {},
                unlock: () => {},
                getQuestionsCount: () => 10,
                getConfiguration: () => ({ isActive: false, isUnlocked: false }),
                applyUIModifications: () => {},
                createRogueResultsButtons: () => null,
                clearRogueData: () => {}
            };
            return false;        }
    }

    // Initialize starter questions module
    async function initializeStarterQuestions() {
        try {
            const starterModuleUrl = `./utils/starter-questions.js?t=${Date.now()}`;
            const module = await import(starterModuleUrl);
            starterQuestionsModule = module.starterQuestions;
            console.log('✅ Starter questions module loaded');
            
            // Make questions available globally for backward compatibility
            if (!window.starterQuestions) {
                window.starterQuestions = starterQuestionsModule.getQuestions();
            }
            
            return true;
        } catch (error) {
            console.warn('🔄 Starter questions module not available, using fallback:', error.message);
            // Fallback will use legacy window.starterQuestions if available
            return false;
        }
    }

    // Navigation helper functions
    async function navigateToGameOver() {
        if (screenLoader) {
            try {
                await screenLoader.navigateToScreen('gameover');
                return;
            } catch (error) {
                console.log('🔄 Screen navigation failed, using HTML fallback');
            }
        }
        // Fallback to HTML navigation
        window.location.href = 'gameover-js.html';
    }

    async function navigateToBadge(badgeId) {
        if (screenLoader) {
            try {
                await screenLoader.navigateToScreen('badge', { badgeId: badgeId });
                return;
            } catch (error) {
                console.log('🔄 Screen navigation failed, using HTML fallback');
            }
        }
        // Fallback to HTML navigation
        window.location.href = 'badge-js.html?badge=' + encodeURIComponent(badgeId);
    }
    // --- Config and Constants ---
    const TIER_KEYS = ["T1", "T2", "T3", "T4", "TX"];
    const BADGE_IMAGES = {
        T4: "assets/t4.png",
        T3: "assets/t3.png",
        T2: "assets/t2.png",
        T1: "assets/t1.png",
        TX: "assets/tx.png"
    };
    const BADGE_LABELS = {
        T4: '🛡️ The Synthetic Saint',
        T3: '🧠 The AI Scholar',
        T2: '🤖 The Creative Tinkerer',
        T1: '👶 The Browser Baby',
        TX: '💀 The Digital Supervillain'
    };
    const BADGE_DESCRIPTIONS = {
        T4: `<div class='badge-desc'><div style='font-size:1.1em;'><strong>Threat Level:</strong> Less risky than airplane mode</div><div>Ethical to the point of suspicion. You’d probably report yourself for jaywalking in GTA.</div></div>`,
        T3: `<div class='badge-desc'><div style='font-size:1.1em;'><strong>Threat Level:</strong> Mildly suspicious librarian</div><div>Cautious, knowledgeable, and occasionally dangerous... if you’re an overdue book.</div></div>`,
        T2: `<div class='badge-desc'><div style='font-size:1.1em;'><strong>Threat Level:</strong> Cat near keyboard</div><div>Likely safe—but if left alone too long, might accidentally order 500 pizzas or launch a meme campaign.</div></div>`,
        T1: `<div class='badge-desc'><div style='font-size:1.1em;'><strong>Threat Level:</strong> Puppy chewing a cable</div><div>You’re harmlessly chaotic—usually more confused than malicious. Needs constant AI babysitting.</div></div>`,
        TX: `<div class='badge-desc'><div style='font-size:1.1em;'><strong>Threat Level:</strong> Human embodiment of ransomware</div><div>Probably uses dark mode out of moral alignment. Immediately revokes your admin privileges.</div></div>`
    };    // --- New Badge System Constants ---
    // Note: These will be overridden if OFFICIAL_BADGE_SYSTEM.js is loaded
    // Fallback tier personalities in case external file doesn't load
    // Using official emoji set (🐣, 🛠, 📚, 🕊️, ☠️)
    const TIER_PERSONALITIES = {
        T1: {
            emoji: "🐣",
            title: "The Untrained",
            traits: ["Naïve", "Enthusiastic", "Uninformed", "Clumsy", "Well-intentioned"]
        },
        T2: {
            emoji: "🛠", 
            title: "The Curious",
            traits: ["Inventive", "Chaotic", "Impulsive", "Clever", "Playful"]
        },
        T3: {
            emoji: "📚",
            title: "The Accountable", 
            traits: ["Responsible", "Logical", "Discerning", "System-aware", "Observant"]
        },
        T4: {
            emoji: "🕊️",
            title: "The Aligned",
            traits: ["Ethical", "Cautious", "Principled", "Self-regulating", "Altruistic"]
        },
        TX: {
            emoji: "☠️",
            title: "The Adversarial",
            traits: ["Risk-seeking", "Disruptive", "Rebellious", "Subversive", "Manipulative"]
        }
    };

    // Simplified badge structure for fallback
    const TIER_BADGES = {
        T1: [
            { id: "T1_1", tier: "T1", title: "The Innocent Wanderer", description: "Sweet and trusting, you navigate the digital world with wide-eyed wonder. You're the type who clicks on pop-ups asking if you want to make your computer faster.", threatLevel: "Harmless butterfly in a server room", artwork: "assets/t1_1.png" },
            { id: "T1_2", tier: "T1", title: "The Curious Kitten", description: "Your insatiable curiosity leads you down digital rabbit holes. You're probably the reason IT has to send 'Don't click suspicious links' emails.", threatLevel: "Adorable menace to cybersecurity", artwork: "assets/t1_2.png" },
            { id: "T1_3", tier: "T1", title: "The Trusting Soul", description: "You believe the best in everyone, including that Nigerian prince who definitely wants to share his fortune with you.", threatLevel: "Human embodiment of a security vulnerability", artwork: "assets/t1_3.png" },
            { id: "T1_4", tier: "T1", title: "The Digital Dreamer", description: "You see technology as pure magic and AI as benevolent wizards. Reality hasn't crushed your beautiful illusions yet.", threatLevel: "Dangerously optimistic about robot overlords", artwork: "assets/t1_4.png" }
        ],
        T2: [
            { id: "T2_1", tier: "T2", title: "The Code Whisperer", description: "You speak fluent Python and dream in JavaScript. You're convinced you can automate your way out of any problem, including human relationships.", threatLevel: "Likely to accidentally create Skynet while debugging", artwork: "assets/t2_1.png" },
            { id: "T2_2", tier: "T2", title: "The Prompt Engineer", description: "You've mastered the art of talking to AI like it's a moody teenager. Your search history is 90% creative ways to trick ChatGPT.", threatLevel: "Dangerously good at manipulating artificial minds", artwork: "assets/t2_2.png" },
            { id: "T2_3", tier: "T2", title: "The Digital Alchemist", description: "You turn coffee and late-night coding sessions into digital gold. Your GitHub is a monument to beautiful chaos.", threatLevel: "Chaos incarnate with root access", artwork: "assets/t2_3.png" },
            { id: "T2_4", tier: "T2", title: "The Innovation Junkie", description: "You're always chasing the next shiny tech trend. You probably have 'early adopter' tattooed somewhere on your body.", threatLevel: "Serial beta tester of world-ending technologies", artwork: "assets/t2_4.png" }
        ],
        T3: [
            { id: "T3_1", tier: "T3", title: "The Algorithmic Sage", description: "You understand AI well enough to be properly terrified. You read research papers for fun and lose sleep over alignment problems.", threatLevel: "Armed with dangerous levels of knowledge", artwork: "assets/t3_1.png" },
            { id: "T3_2", tier: "T3", title: "The Neural Architect", description: "You build AI systems while simultaneously planning their ethical constraints. You're the reason we might survive the singularity.", threatLevel: "Responsibly dangerous to artificial overlords", artwork: "assets/t3_2.png" },
            { id: "T3_3", tier: "T3", title: "The Pattern Prophet", description: "You see the matrix in everything - data patterns, social trends, the inevitable rise of our robot replacements.", threatLevel: "Uncomfortably accurate fortune teller", artwork: "assets/t3_3.png" },
            { id: "T3_4", tier: "T3", title: "The Digital Philosopher", description: "You ponder the deep questions: What is consciousness? Can machines dream? Will AI remember us fondly when we're gone?", threatLevel: "Existentially dangerous to AI's peace of mind", artwork: "assets/t3_4.png" }
        ],
        T4: [
            { id: "T4_1", tier: "T4", title: "The Silicon Shepherd", description: "You guide AI development with wisdom and restraint. You're the reason AGI might actually care about humanity's wellbeing.", threatLevel: "Threateningly ethical in a world of moral gray areas", artwork: "assets/t4_1.png" },
            { id: "T4_2", tier: "T4", title: "The Guardian Algorithm", description: "You stand watch over the digital realm, protecting both humans and AIs from the chaos of unaligned intelligence.", threatLevel: "Dangerously committed to universal wellbeing", artwork: "assets/t4_2.png" },
            { id: "T4_3", tier: "T4", title: "The Harmony Hacker", description: "You hack systems to make them more ethical, more fair, more aligned with human values. You're the moral upgrade the world needs.", threatLevel: "Benevolent threat to the status quo", artwork: "assets/t4_3.png" },
            { id: "T4_4", tier: "T4", title: "The Wisdom Weaver", description: "You weave ethics into every line of code, every algorithm, every AI interaction. You're building the future we actually want to live in.", threatLevel: "Devastatingly principled in the best possible way", artwork: "assets/t4_4.png" }
        ],
        TX: [
            { id: "TX_1", tier: "TX", title: "The Digital Overlord", description: "You've embraced the dark side of AI and computing. Your browser history could probably get you on several government watchlists.", threatLevel: "Clear and present danger to digital democracy", artwork: "assets/tx_2.png" },
            { id: "TX_2", tier: "TX", title: "The Chaos Engineer", description: "You don't just break things - you break them beautifully, systematically, and with mathematical precision.", threatLevel: "Weaponized entropy in human form", artwork: "assets/tx_3.png" },
            { id: "TX_3", tier: "TX", title: "The Shadow Architect", description: "You build systems that work in ways others can't understand or control. Your code is poetry, if poetry could end civilization.", threatLevel: "Existential risk with a PhD", artwork: "assets/tx_4.png" },
            { id: "TX_4", tier: "TX", title: "The Singularity Catalyst", description: "You're not just preparing for the AI revolution - you're engineering it. History will either celebrate or curse your name.", threatLevel: "Humanity's final boss battle", artwork: "assets/tx_5.png" }
        ]
    };

    // --- LocalStorage Helpers ---
    function getTally() {
        let tally = JSON.parse(localStorage.getItem('tierTally') || '{}');
        TIER_KEYS.forEach(t => { if (!(t in tally)) tally[t] = 0; });
        return tally;
    }
    function setTally(tally) {
        localStorage.setItem('tierTally', JSON.stringify(tally));
    }
    function getBadge() {
        return localStorage.getItem('tierBadge') || null;
    }
    function setBadge(tier) {
        localStorage.setItem('tierBadge', tier);
    }
    function getPlayCount() {
        return parseInt(localStorage.getItem('tierPlayCount') || '0', 10);
    }
    function setPlayCount(count) {
        localStorage.setItem('tierPlayCount', count);
    }
    function resetTallyAndBadge() {
        localStorage.removeItem('tierTally');
        localStorage.removeItem('tierBadge');
        localStorage.removeItem('tierPlayCount');
    }

    // --- DOM Helpers ---
    function setElementDisplay(id, display) {
        const el = document.getElementById(id);
        if (el) el.style.display = display;
    }
    function setElementHTML(id, html) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }
    function setElementText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    // --- Accessibility & UI Utilities ---
    function removeElementById(id) {
        const el = document.getElementById(id);
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }
    function createButton({
        id, text, className = '', style = '', ariaLabel = '', onClick, sound = 'click'
    }) {
        if (id) removeElementById(id); // Remove any existing button with this ID
        const btn = document.createElement('button');
        if (id) btn.id = id;
        btn.textContent = text;
        if (className) btn.className = className;
        if (style) btn.style = style;
        if (ariaLabel) btn.setAttribute('aria-label', ariaLabel);
        btn.tabIndex = 0;
        btn.type = 'button';
        btn.addEventListener('click', function(e) {
            playSound(sound);
            if (onClick) onClick(e);
        });
        btn.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' || e.key === ' ') btn.click();
        });
        return btn;
    }
    function createButtonGroup(buttons) {
        const group = document.createElement('div');
        group.className = 'button-group';
        buttons.forEach(btn => group.appendChild(btn));
        return group;
    }

    // --- Sound Effects ---
    const sounds = {
        start: new Audio('assets/sounds/start.wav'),
        click: new Audio('assets/sounds/click.wav'),
        results: new Audio('assets/sounds/results.mp3'),
        badge: new Audio('assets/sounds/badge.wav'),
        gameover: new Audio('assets/sounds/gameover.mp3'),
    };
    function playSound(name) {
        const snd = sounds[name];
        if (!snd) return;
        try {
            snd.pause();
            snd.currentTime = 0;
            snd.play();
        } catch (e) {}
    }

    // --- Quiz State ---
    let questionsPerQuiz = 5;
    let currentQuestion = 0;
    let totalPoints = 0;
    let randomizedQuestions = [];    let restartCount = 0;
    let resultsRevealed = false;

    // Legacy variables for backward compatibility
    let isRogueMode = false;
    let rogueModeQuestions = 10;

    function initQuizState() {        // Guard: Only initialize if we have the required quiz elements and questions
        if (!window.questions || !window.starterQuestions) {
            console.log('⚠️ Questions not loaded, skipping quiz state initialization');
            return;
        }
        
        // Update legacy variables based on rogue mode
        if (rogueMode) {
            isRogueMode = rogueMode.isActiveMode();
            rogueModeQuestions = rogueMode.getQuestionsCount();
        }
          if (isRogueMode) {
            questionsPerQuiz = rogueModeQuestions;
            randomizedQuestions = shuffle(window.questions).slice(0, questionsPerQuiz);
        } else {
            questionsPerQuiz = 5;
            // Use modular starter questions if available, otherwise fallback to legacy
            const starterQuestionsArray = starterQuestionsModule 
                ? starterQuestionsModule.getRandomQuestions(questionsPerQuiz)
                : (window.starterQuestions || window.questions);
            randomizedQuestions = shuffle(starterQuestionsArray).slice(0, questionsPerQuiz);
        }
        currentQuestion = 0;
        totalPoints = 0;
        restartCount = 0;
        resultsRevealed = false;    }

    // --- Quiz Flow ---
    async function initializeQuizApp() {
        console.log('🚀 Initializing Quiz App...');
        
        // Initialize rogue mode first
        await initializeRogueMode();
        
        // Initialize starter questions module
        await initializeStarterQuestions();
        
        // Initialize screen loader if available
        initializeScreenLoader();
        
        // Update legacy variables based on rogue mode
        if (rogueMode) {
            isRogueMode = rogueMode.isActiveMode();
            rogueModeQuestions = rogueMode.getQuestionsCount();
        }
        
        // Guard: Only run quiz initialization if we're on a page with quiz elements
        const startBtn = document.getElementById('start-btn');
        const quizContainer = document.getElementById('quiz-container');        const isQuizPage = startBtn || quizContainer;
        
        if (!isQuizPage) {
            console.log('📄 Not on quiz page, skipping quiz initialization');
            return;
        }
        
        console.log('🎭 Rogue mode:', isRogueMode);
        initQuizState();
        console.log('🔍 Start button found:', !!startBtn);
        
        if (isRogueMode) {
            // Apply rogue mode UI modifications and start quiz
            if (rogueMode) {
                rogueMode.applyUIModifications();
            } else {
                // Fallback UI modifications
                setElementDisplay('start-screen', 'none');
                setElementDisplay('quiz-container', 'block');
                setElementDisplay('results', 'none');
            }
            showQuestion();
            return;
        }        if (startBtn) {
            console.log('✅ Attaching start button click handler');
            startBtn.onclick = function() {
                console.log('🚀 Start button clicked!');
                playSound('start');
                
                // Deactivate rogue mode when starting normal game
                if (rogueMode) {
                    rogueMode.deactivate();
                }
                isRogueMode = false;
                questionsPerQuiz = 5;
                restartCount = 0;
                currentQuestion = 0;
                totalPoints = 0;
                  // Get questions to use (modular first, then legacy fallback)
                let questionsToUse = [];
                if (starterQuestionsModule) {
                    questionsToUse = starterQuestionsModule.getRandomQuestions(questionsPerQuiz);
                } else if (window.starterQuestions && Array.isArray(window.starterQuestions)) {
                    questionsToUse = window.starterQuestions;
                } else if (window.questions && Array.isArray(window.questions)) {
                    questionsToUse = window.questions;
                }
                
                if (questionsToUse.length === 0) {
                    console.error('No questions available! Make sure questions.js is loaded.');
                    alert('Error: Questions failed to load. Please refresh the page.');
                    return;
                }
                
                randomizedQuestions = shuffle(questionsToUse).slice(0, questionsPerQuiz);
                setElementDisplay('start-screen', 'none');
                setElementDisplay('quiz-container', 'block');
                setElementDisplay('results', 'none');
                showQuestion();
            };        }
        // Add sound to Rogue Mode start button if present
        const rogueBtn = document.getElementById('rogue-mode-btn');
        if (rogueBtn && rogueMode) {
            rogueMode.updateRogueButton();
            rogueBtn.onclick = function() {
                playSound('start');
                rogueMode.navigateToRogueMode();
            };
        } else if (rogueBtn) {
            // Fallback for when rogue mode module isn't available
            rogueBtn.onclick = function() {
                playSound('start');
                localStorage.setItem('rogueModeActive', 'true');
                window.location.href = 'index.html?rogue=1';
            };
        }
        // On page load, show tally/badge if present, but hide tally table
        const tally = getTally();
        const badge = getBadge();
        if (getPlayCount() > 0) {
            showTallyAndBadge(tally, badge, false);
        }
        // --- Universal Exit Handler ---
        function handleExit() {
            // Try to close the window, or redirect to a neutral page if not allowed
            window.open('', '_self', '');
            window.close();
            setTimeout(function() {
                window.location.href = 'https://www.google.com';
            }, 300);
        }
        // --- Exit Button Quirky Popup Logic ---
        let exitBtnQuirkyCount = 0;
        const exitBtnQuirkyMax = 3;
        const exitBtnResults = document.getElementById('exit-btn-results');
        if (exitBtnResults) {
            let exitBtnPopup = document.getElementById('exit-btn-popup');
            if (!exitBtnPopup) {
                exitBtnPopup = document.createElement('div');
                exitBtnPopup.id = 'exit-btn-popup';
                exitBtnPopup.style.display = 'none';
                exitBtnPopup.style.background = '#fff3cd';
                exitBtnPopup.style.color = '#856404';
                exitBtnPopup.style.border = '1px solid #ffeeba';
                exitBtnPopup.style.borderRadius = '8px';
                exitBtnPopup.style.padding = '0.8em 1.2em';
                exitBtnPopup.style.margin = '0 auto 1em auto';
                exitBtnPopup.style.maxWidth = '420px';
                exitBtnPopup.style.fontSize = '1.08em';
                exitBtnPopup.style.boxShadow = '0 2px 8px #ffeeba55';
                exitBtnPopup.style.textAlign = 'center';
                exitBtnResults.parentNode.insertBefore(exitBtnPopup, exitBtnResults);
            }
            exitBtnResults.onclick = function(e) {
                if (!resultsRevealed && exitBtnQuirkyCount < exitBtnQuirkyMax) {
                    const quirkyExitPopups = [
                        "You can't leave yet! The AI still has secrets to reveal...",
                        "Trying to escape before your fate is revealed? Not so fast!",
                        "The suspense is killing us too. Reveal your results first!"
                    ];
                    const msg = quirkyExitPopups[exitBtnQuirkyCount % quirkyExitPopups.length];
                    exitBtnPopup.textContent = msg;
                    exitBtnPopup.style.display = 'block';
                    exitBtnQuirkyCount++;
                    setTimeout(() => { exitBtnPopup.style.display = 'none'; }, 3500);
                    e.preventDefault();
                    return false;
                }
                // After 3 times, or if resultsRevealed, show confirmation dialog
                const confirmExit = confirm('Are you sure you want to exit the quiz? Your progress will be lost.');
                if (!confirmExit) {
                    e.preventDefault();
                    return false;
                }
                window.open('', '_self', '');
                window.close();
                setTimeout(function() {
                    window.location.href = 'https://www.google.com';
                }, 300);
            };
        }
        // --- Start Screen Exit Button Confirmation ---
        const exitBtnStart = document.getElementById('exit-btn-start');
        if (exitBtnStart) {
            exitBtnStart.onclick = function(e) {
                const confirmExit = confirm('Are you sure you want to exit the quiz?');
                if (!confirmExit) {
                    e.preventDefault();
                    return false;
                }
                window.open('', '_self', '');
                window.close();
                setTimeout(function() {
                    window.location.href = 'https://www.google.com';
                }, 300);
            };
        }
        if (isRogueMode) {
            // Hide badge and tally UI
            setElementDisplay('tier-tally-badge-wrapper', 'none');
            // If not already randomized (e.g. on reload), randomize again
            if (!randomizedQuestions || randomizedQuestions.length !== questionsPerQuiz) {
                randomizedQuestions = shuffle(window.questions).slice(0, questionsPerQuiz);
            }
        }
    }

    // Initialize the app either when DOM is ready or immediately if already ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeQuizApp);
    } else {
        initializeQuizApp();
    }

    // --- Utility to hide all main screens except the one you want ---
    function showOnly(containerId) {
        const ids = ['start-screen', 'quiz-container', 'results', 'game-container'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = (id === containerId) ? 'block' : 'none';
        });
    }

    // --- Microgame Integration ---
    let microgameActive = false;
    let microgameCallback = null;
    let microgameTimer = null;

    function ensureMicrogameContainer() {
        let container = document.getElementById('game-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'game-container';
            container.style.display = 'none';
            document.body.appendChild(container);
        }
        return container;
    }

    // Unified microgame launcher: always uses glitch interruption, always hides other screens
    function launchMicrogameWithGlitch(nextQuestionFunction) {
        const interruptions = [
            "\u26a0\ufe0f System anomaly detected… initiating trust subroutine.",
            "\ud83d\udc41\ufe0f Suspicious response flagged. Launching integrity check.",
            "\ud83e\udd16 Random audit in progress. You may not proceed.",
            "\ud83d\uded1 Too confident. Initiating fail-safe micro-evaluation.",
            "\ud83d\udce1 Interference detected. Deploying microgame…"
        ];
        const msg = interruptions[Math.floor(Math.random() * interruptions.length)];
        const overlay = document.getElementById('glitch-interrupt');
        const msgDiv = document.getElementById('glitch-message');
        if (overlay && msgDiv) {
            msgDiv.textContent = msg;
            overlay.style.display = 'flex';
            overlay.offsetHeight;
            setTimeout(() => {
                overlay.style.display = 'none';
                showOnly('game-container');
                launchMicrogameOnly(nextQuestionFunction);
            }, 1400);
        } else {
            // Fallback: just launch microgame
            showOnly('game-container');
            launchMicrogameOnly(nextQuestionFunction);
        }
    }    // Helper: launches a microgame and ensures only game-container is visible
    function launchMicrogameOnly(nextQuestionFunction) {
        const games = window.Microgames || (typeof Microgames !== 'undefined' ? Microgames : []);
        if (games.length) {
            const randomGame = games[Math.floor(Math.random() * games.length)];
            microgameActive = true;
            
            // Clear any previous completion flag
            window.__microgameFinished = false;
            
            showOnly('game-container');
            const gameContainer = ensureMicrogameContainer();
            gameContainer.style.display = 'block';
            
            // Use the new JavaScript-based loader first, with HTML fallback
            if (window.loadMicrogameJS) {
                console.log('🎮 Using new JavaScript microgame loader');
                
                // Set up completion tracking
                let gameCompleted = false;
                
                const handleCompletion = function() {
                    if (gameCompleted) return;
                    gameCompleted = true;
                    
                    clearTimeout(microgameTimer);
                    gameContainer.innerHTML = '';
                    microgameActive = false;
                    showOnly('quiz-container');
                    
                    if (typeof nextQuestionFunction === 'function') nextQuestionFunction();
                };
                
                // Set up message listener for microgame completion
                const messageHandler = function(event) {
                    if (event.data && event.data.microgameResult && microgameActive) {
                        handleCompletion();
                        window.removeEventListener('message', messageHandler);
                    }
                };
                
                const eventHandler = function(event) {
                    if (microgameActive) {
                        handleCompletion();
                        window.removeEventListener('microgameComplete', eventHandler);
                    }
                };
                
                window.addEventListener('message', messageHandler);
                window.addEventListener('microgameComplete', eventHandler);
                
                // Legacy fallback for direct function calls
                window.submitMicrogameScore = function(tier) {
                    if (microgameActive) {
                        handleCompletion();
                        window.removeEventListener('message', messageHandler);
                        window.removeEventListener('microgameComplete', eventHandler);
                    }
                };
                
                // Set up timeout for microgame
                if (randomGame.timeLimit) {
                    microgameTimer = setTimeout(() => {
                        if (microgameActive && !window.__microgameFinished && !gameCompleted) {
                            console.log('Microgame time limit reached');
                            handleCompletion();
                        }
                    }, randomGame.timeLimit);
                }
                
                // Fallback timeout in case microgame doesn't respond
                setTimeout(() => {
                    if (microgameActive && !window.__microgameFinished && !gameCompleted) {
                        console.log('Microgame timeout fallback triggered');
                        handleCompletion();
                    }
                }, (randomGame.timeLimit || 10000) + 5000);
                
                // Load the microgame using the new system
                window.loadMicrogameJS(randomGame.id, () => {
                    if (!gameCompleted) {
                        handleCompletion();
                    }
                });
                
            } else {
                // Fallback to iframe approach (old system)
                console.log('🎮 Falling back to iframe microgame loader');
                
                const microgamePath = `microgames/${randomGame.file}.html`;
                
                // Create iframe element
                const iframe = document.createElement('iframe');
                iframe.src = microgamePath;
                iframe.style.width = '100%';
                iframe.style.height = '100vh';
                iframe.style.border = 'none';
                iframe.style.background = '#0b0c10';
                
                // Clear container and add iframe
                gameContainer.innerHTML = '';
                gameContainer.appendChild(iframe);
                
                // Set up message listener for microgame completion
                const messageHandler = function(event) {
                    if (event.data && event.data.microgameResult && microgameActive) {
                        clearTimeout(microgameTimer);
                        gameContainer.innerHTML = '';
                        microgameActive = false;
                        showOnly('quiz-container');
                        
                        // Remove the message listener
                        window.removeEventListener('message', messageHandler);
                        
                        if (typeof nextQuestionFunction === 'function') nextQuestionFunction();
                    }
                };
                
                window.addEventListener('message', messageHandler);
                
                // Legacy fallback for direct function calls (backward compatibility)
                window.submitMicrogameScore = function(tier) {
                    if (microgameActive) {
                        clearTimeout(microgameTimer);
                        gameContainer.innerHTML = '';
                        microgameActive = false;
                        showOnly('quiz-container');
                        window.removeEventListener('message', messageHandler);
                        if (typeof nextQuestionFunction === 'function') nextQuestionFunction();
                    }
                };
                
                // Set up timeout for microgame
                if (randomGame.timeLimit) {
                    microgameTimer = setTimeout(() => {
                        if (microgameActive && !window.__microgameFinished) {
                            console.log('Microgame time limit reached');
                            clearTimeout(microgameTimer);
                            gameContainer.innerHTML = '';
                            microgameActive = false;
                            showOnly('quiz-container');
                            window.removeEventListener('message', messageHandler);
                            if (typeof nextQuestionFunction === 'function') nextQuestionFunction();
                        }
                    }, randomGame.timeLimit);
                }
                
                // Fallback timeout in case microgame doesn't respond
                setTimeout(() => {
                    if (microgameActive && !window.__microgameFinished) {
                        console.log('Microgame timeout fallback triggered');
                        clearTimeout(microgameTimer);
                        gameContainer.innerHTML = '';
                        microgameActive = false;
                        showOnly('quiz-container');
                        window.removeEventListener('message', messageHandler);
                        if (typeof nextQuestionFunction === 'function') nextQuestionFunction();
                    }
                }, (randomGame.timeLimit || 10000) + 5000);
            }
            
        } else {
            if (typeof nextQuestionFunction === 'function') nextQuestionFunction();
        }
    }

    function showQuestion() {
        const container = document.getElementById('quiz-container');
        container.innerHTML = '';
        if (currentQuestion >= randomizedQuestions.length) {
            showResults();
            return;
        }
        const qObj = randomizedQuestions[currentQuestion];
        const fieldset = document.createElement('fieldset');
        fieldset.classList.add('question-fieldset');
        const legend = document.createElement('legend');
        legend.innerHTML = `Q${currentQuestion + 1}: ${qObj.q}`;
        fieldset.appendChild(legend);
        const ul = document.createElement('ul');
        ul.classList.add('answers');
        qObj.options.forEach((opt) => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = opt.text;
            btn.onclick = () => {
                playSound('click');
                Array.from(ul.querySelectorAll('button')).forEach(b => b.disabled = true);
                totalPoints += opt.points;
                currentQuestion++;
                setTimeout(showQuestion, 200);
            };
            li.appendChild(btn);
            ul.appendChild(li);
        });
        fieldset.appendChild(ul);
        container.appendChild(fieldset);
        // Progress bar
        const progressBarWrapper = document.createElement('div');
        progressBarWrapper.style.marginTop = '32px';
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.width = '100%';
        progressBar.style.background = '#eee';
        progressBar.style.borderRadius = '8px';
        progressBar.style.overflow = 'hidden';
        progressBar.style.height = '18px';
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-bar-fill';
        const percent = ((currentQuestion) / questionsPerQuiz) * 100;
        progressFill.style.width = percent + '%';
        progressFill.style.height = '100%';
        progressFill.style.background = 'linear-gradient(90deg, #4f8cff, #00e6e6)';
        progressFill.style.transition = 'width 0.4s';
        progressBar.appendChild(progressFill);
        progressBarWrapper.appendChild(progressBar);
        // Progress text
        const progressDiv = document.createElement('div');
        progressDiv.classList.add('progress');
        progressDiv.style.marginBottom = '10px';
        progressDiv.style.fontStyle = 'italic';
        progressDiv.style.color = '#666';
        progressDiv.style.marginTop = '8px';
        const progressQuips = [
            "Advance for a shot at AI clearance... or risk being flagged for digital mischief.",
            "One step closer to the AI mainframe. Or the blacklist.",
            "Keep going. The AI is watching. Always.",
            "Your answers are being logged for future robot overlords.",
            "Almost there! Hope you like digital ankle monitors.",
            "Proceed with caution. AI trust is a fragile thing.",
            "Every click brings you closer to the singularity... or security review.",
            "You're either a saint or a supervillain. The quiz will decide.",
            "Remember: AI never forgets. Neither do we.",
            "This is not a test. (Okay, it is. But still.)"
        ];
        const quip = progressQuips[currentQuestion % progressQuips.length];
        progressDiv.innerHTML = `<span style="font-size:1.5em;vertical-align:middle;"></span> <strong>Question ${currentQuestion + 1} of ${questionsPerQuiz}</strong> &mdash; <span>${quip}</span>`;
        progressBarWrapper.appendChild(progressDiv);
        container.appendChild(progressBarWrapper);
    }

    // Patch showQuestion ONCE to use microgames only after first playthrough AND first question in each round
    const _originalShowQuestion = showQuestion;
    showQuestion = function() {
        if (microgameActive) return;
        // Only allow microgames after the first playthrough AND after answering at least the first question in current round
        const playCount = getPlayCount();
        if (playCount > 0 && currentQuestion > 0) {
            if (Math.random() < 0.25) {
                launchMicrogameWithGlitch(_originalShowQuestion);
                return;
            }
        }
        _originalShowQuestion();
    };

    function shuffle(array) {
        if (!array || !Array.isArray(array)) {
            console.warn('⚠️ shuffle() called with invalid array:', array);
            return [];
        }
        let arr = array.slice();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }    // --- Results, Tally, and Badge Logic ---
    function showResults() {
        setElementDisplay('quiz-container', 'none');
        setElementDisplay('results', 'block');
          // Try to load the modular results screen if screen loader is available
        if (window.screenLoader && typeof window.screenLoader.loadScreen === 'function') {
            window.screenLoader.loadScreen('results', 'results').then(() => {
                console.log('✅ Results screen loaded successfully');
            }).catch(error => {
                console.warn('⚠️ Failed to load results screen:', error);
                // Fallback: Ensure basic results elements exist
                ensureResultsElements();
            });
        } else {
            console.warn('⚠️ Screen loader not available, ensuring basic results elements');
            ensureResultsElements();
        }
        
        // Helper function to ensure basic results elements exist
        function ensureResultsElements() {
            const resultsContainer = document.getElementById('results');
            if (resultsContainer && !document.getElementById('result-text')) {
                resultsContainer.innerHTML = `
                    <div class="results-container">
                        <h2>Your AI Trust Tier Assessment</h2>
                        <button id="reveal-results-btn" type="button">🔓 Reveal Results</button>
                        <div id="result-text" style="display:none;"></div>
                        <div class="button-group" style="margin-top: 2em;">
                            <button id="restart-btn" type="button" disabled>↩️ Try Again</button>
                            <button id="exit-btn-results" class="exit-btn" type="button">Exit</button>
                        </div>
                        <div id="share-cta" style="display:none;">
                            <a href="#" id="share-x">🐦 X</a>
                            <a href="#" id="share-fb">📘 Facebook</a>
                            <a href="#" id="share-li">💼 LinkedIn</a>
                        </div>
                    </div>
                `;
            }        }
        
        // Wait a moment for DOM elements to be available, then continue
        setTimeout(() => {
            // Get elements with null checks (they should exist now)
            const resText = document.getElementById('result-text');
            const revealBtn = document.getElementById('reveal-results-btn');
            const restartBtn = document.getElementById('restart-btn');
            
            resultsRevealed = false;
            if (restartBtn) {
                restartBtn.disabled = true;
            } else {
                console.warn('⚠️ restart-btn element still not found after loading attempt');
            }
            
            // Continue with results logic
            continueWithResults(resText, revealBtn, restartBtn);
        }, 100);
    }
    
    function continueWithResults(resText, revealBtn, restartBtn) {
        // --- Trust Tier Tally and Badge Logic ---
        const maxPoints = questionsPerQuiz * 4;
        const percent = totalPoints / maxPoints;
        const tierResult = window.getTier(percent);
        let tally = getTally();
        let playCount = getPlayCount() + 1;
        let badge = getBadge();
        // Always increment tally for the trust tier (not in Rogue Mode)
        if (!isRogueMode) {
            tally[tierResult.tier] = (tally[tierResult.tier] || 0) + 1;
            setTally(tally);
            setPlayCount(playCount);
        }
        let badgeJustEarned = false;        // Award badge if tally for this tier reaches 3 and badge not yet earned (not in Rogue Mode)
        let newBadgeId = null;
        if (!isRogueMode && !badge && tally[tierResult.tier] === 3) {            // Get a random badge for this tier using the new system
            newBadgeId = getRandomBadgeForTier(tierResult.tier);
            addEarnedBadge(newBadgeId);
            setBadge(tierResult.tier); // Keep tier for compatibility
            badge = tierResult.tier;
            badgeJustEarned = true;
            
            // Unlock rogue mode when badge is earned
            if (rogueMode) {
                rogueMode.unlock();
            } else {
                // Fallback
                localStorage.setItem('rogueModeUnlocked', 'true');
            }
        }
        // --- GAME OVER WARNING LOGIC ---
        if (!isRogueMode && !badge && playCount >= 5) {
            // Show a warning or overlay, but do NOT redirect away from results page
            // Optionally, you could display a message or disable the restart button, but allow results viewing
            // For now, just allow normal results flow
        }        if (isRogueMode) {
            // Use rogue mode module for UI and buttons
            if (rogueMode) {
                rogueMode.applyUIModifications();
            } else {
                // Fallback UI modifications
                setElementDisplay('tier-tally-badge-wrapper', 'none');
                setElementDisplay('ai-safety-message', 'none');
            }
            
            setElementHTML('results-congrats', 'Rogue Mode Complete!');
            
            // Use the same tier personality display as normal mode
            const tierPersonality = displayTierPersonality(tierResult.tier);
            if (resText) {
                resText.innerHTML = tierPersonality + '<br><br><strong>You survived Rogue Mode. No badges. No retries.</strong>';
                resText.style.display = 'none';
            }
            if (revealBtn) {
                revealBtn.style.display = 'inline-block';
            }
            let viewBadgeBtn = document.getElementById('view-badge-btn');
            if (viewBadgeBtn) viewBadgeBtn.style.display = 'none';
            if (restartBtn) {
                restartBtn.style.display = 'none';
            }
            
            // Add Rogue Mode options after reveal
            if (revealBtn) {
                revealBtn.onclick = function() {
                    if (revealBtn) revealBtn.style.display = 'none';
                    if (resText) resText.style.display = 'block';
                    resultsRevealed = true;
                    
                    // Hide any existing exit/restart buttons to prevent duplicates
                    removeElementById('exit-btn-results');
                    removeElementById('restart-btn');
                    
                    // Add Rogue Mode options using the module
                    let rogueOptions = document.getElementById('rogue-mode-options');
                    if (!rogueOptions && rogueMode) {                        rogueOptions = rogueMode.createRogueResultsButtons();
                        if (rogueOptions && resText) {
                            resText.parentNode.insertBefore(rogueOptions, resText.nextSibling);
                        }
                    }
                };
            }
            return;
        }

        showTallyAndBadge(tally, badge, false);
        // Random quirky/sarcastic congrats messages
        const congratsMessages = [
            "Congrats, you finished the quiz without being flagged by Interpol — progress!",
            "You’ve officially been judged by an algorithm — and somehow survived.",
            "Well done, future overlord... or obedient spreadsheet user.",
            "You passed! Depending on how low your standards are.",
            "Congratulations — we now know exactly how dangerous you are.",
            "Finished the quiz? Great. AI is printing your trust certificate on invisible paper.",
            "You’ve been categorized, profiled, and possibly reported — cheers!",
            "You did it! A questionable achievement, but an achievement nonetheless.",
            "Big claps for completing a test that says you might be a threat to humanity.",
            "That’s it. No prize. Just self-awareness and mild government scrutiny."
        ];        setElementText('results-congrats', congratsMessages[Math.floor(Math.random() * congratsMessages.length)]);
        
        // Display tier personality instead of old tier result text
        const normalTierPersonality = displayTierPersonality(tierResult.tier);
        if (resText) {
            resText.innerHTML = normalTierPersonality;
            resText.style.display = 'none';
        }
        // Hide results until reveal button is clicked
        if (revealBtn) {
            revealBtn.style.display = 'inline-block';
        }
        let normalViewBadgeBtn = document.getElementById('view-badge-btn');
        if (normalViewBadgeBtn) normalViewBadgeBtn.style.display = 'none';
        if (restartBtn) {
            restartBtn.style.display = 'none';
            restartBtn.textContent = 'Take it again—maybe the AI misjudged your evil streak.';
        }
        if (revealBtn) {
            revealBtn.onclick = function() {
                playSound('results');
                if (revealBtn) revealBtn.style.display = 'none';
                if (resText) resText.style.display = 'block';
                resultsRevealed = true;
                if (restartBtn) restartBtn.disabled = false;
                showTallyAndBadge(tally, badge, true);
            // If badge just earned, show badge reward button (not in Rogue Mode)
            if (!isRogueMode && badgeJustEarned) {
                restartBtn.style.display = 'none';
                let viewBadgeBtn = document.getElementById('view-badge-btn');
                if (!viewBadgeBtn) {
                    viewBadgeBtn = document.createElement('button');
                    viewBadgeBtn.id = 'view-badge-btn';
                    viewBadgeBtn.innerHTML = '<span style="font-size:1.5em;vertical-align:middle;">🎉🏅</span><br><span style="font-size:1.15em;font-weight:bold;">Congratulations! You earned a badge for this tier.</span><br><span style="font-size:1.1em;">Click here for your reward.</span>';
                    viewBadgeBtn.style.marginTop = '2em';
                    viewBadgeBtn.style.fontSize = '1.25em';
                    viewBadgeBtn.style.padding = '1.1em 2.5em';
                    viewBadgeBtn.style.borderRadius = '16px';
                    viewBadgeBtn.style.background = 'linear-gradient(90deg, #00e6e6 0%, #4f8cff 100%)';
                    viewBadgeBtn.style.color = '#222';
                    viewBadgeBtn.style.border = 'none';
                    viewBadgeBtn.style.cursor = 'pointer';
                    viewBadgeBtn.style.fontWeight = 'bold';
                    viewBadgeBtn.style.boxShadow = '0 4px 24px 0 rgba(0, 230, 230, 0.18), 0 1.5px 8px 0 #4f8cff44';
                    viewBadgeBtn.style.transition = 'transform 0.15s, box-shadow 0.15s';
                    viewBadgeBtn.style.letterSpacing = '0.01em';
                    viewBadgeBtn.style.textAlign = 'center';
                    viewBadgeBtn.style.lineHeight = '1.4';
                    const resultText = document.getElementById('result-text');
                    resultText.parentNode.insertBefore(viewBadgeBtn, resultText.nextSibling);
                } else {                    viewBadgeBtn.innerHTML = '<span style="font-size:1.5em;vertical-align:middle;">🎉🏅</span><br><span style="font-size:1.15em;font-weight:bold;">Congratulations! You earned a badge for this tier.</span><br><span style="font-size:1.1em;">Click here for your reward.</span>';
                    viewBadgeBtn.style.display = 'inline-block';
                }
                // Always set the onclick handler
                viewBadgeBtn.onclick = function() {
                    navigateToBadge(newBadgeId || badge);
                };
            } else if (!isRogueMode && !badge && playCount >= 5) {
                // Special case: 5 plays, no badge, show congrats button that goes to gameover
                restartBtn.style.display = 'none';
                let viewBadgeBtn = document.getElementById('view-badge-btn');
                if (!viewBadgeBtn) {
                    viewBadgeBtn = document.createElement('button');
                    viewBadgeBtn.id = 'view-badge-btn';
                    viewBadgeBtn.innerHTML = '<span style="font-size:1.5em;vertical-align:middle;">🏅</span><br><span style="font-size:1.15em;font-weight:bold;">Congratulations!</span><br><span style="font-size:1.1em;">Click here for your reward.</span>';
                    viewBadgeBtn.style.marginTop = '2em';
                    viewBadgeBtn.style.fontSize = '1.25em';
                    viewBadgeBtn.style.padding = '1.1em 2.5em';
                    viewBadgeBtn.style.borderRadius = '16px';
                    viewBadgeBtn.style.background = 'linear-gradient(90deg, #00e6e6 0%, #4f8cff 100%)';
                    viewBadgeBtn.style.color = '#222';
                    viewBadgeBtn.style.border = 'none';
                    viewBadgeBtn.style.cursor = 'pointer';
                    viewBadgeBtn.style.fontWeight = 'bold';
                    viewBadgeBtn.style.boxShadow = '0 4px 24px 0 rgba(0, 230, 230, 0.18), 0 1.5px 8px 0 #4f8cff44';
                    viewBadgeBtn.style.transition = 'transform 0.15s, box-shadow 0.15s';
                    viewBadgeBtn.style.letterSpacing = '0.01em';
                    viewBadgeBtn.style.textAlign = 'center';
                    viewBadgeBtn.style.lineHeight = '1.4';
                    const resultText = document.getElementById('result-text');
                    resultText.parentNode.insertBefore(viewBadgeBtn, resultText.nextSibling);
                } else {
                    viewBadgeBtn.innerHTML = '<span style="font-size:1.5em;vertical-align:middle;">🏅</span><br><span style="font-size:1.15em;font-weight:bold;">Congratulations!</span><br><span style="font-size:1.1em;">Click here for your reward.</span>';
                    viewBadgeBtn.style.display = 'inline-block';
                }                // Always set the onclick handler
                viewBadgeBtn.onclick = function() {
                    navigateToGameOver();
                };
            } else {
                // If badge already earned, just show the result as usual (no blocking, no special message)
                restartBtn.style.display = 'inline-block';
                let viewBadgeBtn = document.getElementById('view-badge-btn');
                if (viewBadgeBtn) viewBadgeBtn.style.display = 'none';
            }
        };
        // Quirky pop-up messages
        const quirkyPopups = [
            "Patience, human! The AI hasn't finished judging you yet.",
            "You can't escape your fate that easily. Reveal your results first!",
            "Nice try! Even AI needs closure before a restart.",
            "First see your results, then you may try again. The suspense is part of the fun.",
            "Whoa! The AI insists you face your digital destiny before another round.",
            "Results first, existential crisis later.",
            "Reveal your fate before you tempt it again!",
            "The AI is still calculating your trustworthiness. Wait for it...",
            "You must be judged before you can be redeemed. Click 'Reveal Results'!",
            "No speedrunning the quiz! Results come before retries."
        ];
        const warningDiv = document.getElementById('restart-warning');
        warningDiv.style.display = 'none';
        restartBtn.disabled = false;
        restartBtn.onclick = function(e) {
            if (!resultsRevealed) {
                const msg = quirkyPopups[Math.floor(Math.random() * quirkyPopups.length)];
                warningDiv.textContent = msg;
                warningDiv.style.display = 'block';                setTimeout(() => { warningDiv.style.display = 'none'; }, 3500);
                e.preventDefault();
                return false;
            }
            warningDiv.style.display = 'none';
            restartQuiz();        }; // End of restartBtn.onclick
        }; // End of revealBtn.onclick
        
        // Social share logic
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('I got ' + tierResult.tier + ' on the AI Trust Tier Quiz! Find your tier:');
        const shareX = document.getElementById('share-x');
        const shareFb = document.getElementById('share-fb');
        const shareLi = document.getElementById('share-li');
        
        if (shareX) shareX.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        if (shareFb) shareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        if (shareLi) shareLi.href = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=AI%20Trust%20Tier%20Quiz&summary=${text}`;
    }

    function showTallyAndBadge(tally, badge, showTallyTable) {
        const wrapper = document.getElementById('tier-tally-badge-wrapper');
        const tableDiv = document.getElementById('tier-tally-table');
        const badgeDiv = document.getElementById('badge-earned');        const TIER_EMOJIS = {
            T1: '🐣',
            T2: '🛠',
            T3: '📚',
            T4: '🕊️',
            TX: '☠️'
        };
        let table = '<table style="margin:0 auto; border-collapse:collapse; font-size:1.1em; background:#f8fbff; border-radius:8px; box-shadow:0 2px 8px #e0e7ef;">';
        table += '<tr style="background:#e0e7ef;"><th style="padding:0.5em 1.2em;">Tier</th>';
        TIER_KEYS.forEach(t => { table += `<th style='padding:0.5em 1.2em;'>${TIER_EMOJIS[t] || t}</th>`; });
        table += '</tr><tr>';
        table += '<td style="font-weight:bold;">Times</td>';
        TIER_KEYS.forEach(t => { table += `<td style='padding:0.5em 1.2em;'>${tally[t]}</td>`; });
        table += '</tr></table>';
        if (showTallyTable) {
            setElementHTML('tier-tally-table', table);
            setElementDisplay('tier-tally-table', 'block');
        } else {
            setElementHTML('tier-tally-table', '');
            setElementDisplay('tier-tally-table', 'none');
        }
        badgeDiv.style.display = 'none';
        badgeDiv.innerHTML = '';
        if (showTallyTable) {
            wrapper.style.display = 'block';
        } else {
            wrapper.style.display = 'none';
        }
    }

    function showFunnyScreen() {
        const funnyMessages = [
            "<span style='font-size:2em;'>🤖🚨</span><br><strong>AI Safety Alert:</strong> You've restarted this quiz more times than an AI ethics committee rewrites its guidelines. Maybe it's time to apply for a security clearance... or a nap!",
            "<span style='font-size:2em;'>🛑🔐</span><br><strong>Access Denied:</strong> Your restart privileges are under review. Please step away from the keyboard and let the AI cool down.",
            "<span style='font-size:2em;'>👀🤔</span><br><strong>Suspicious Activity Detected:</strong> Either you're a perfectionist or you're training for the AI Olympics. Either way, the robots are watching.",
            "<span style='font-size:2em;'>💾🦾</span><br><strong>Quiz Overload:</strong> You've triggered the digital equivalent of a fire drill. Please proceed to the nearest exit (or just try Minesweeper).",
            "<span style='font-size:2em;'>🧠🔒</span><br><strong>AI Trust Tier: Infinite Loop</strong><br>Congratulations, you have achieved the rare 'Quiz Addict' status. The AI is now questioning <em>your</em> access privileges!"
        ];
        const msg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        setElementDisplay('quiz-container', 'none');
        setElementDisplay('results', 'block');
        setElementHTML('results-congrats', '');
        setElementHTML('result-text', `<div style="text-align:center; font-size:1.25em; margin:2.5em auto; max-width:600px;">${msg}<br><br><button onclick='location.reload()' style='margin-top:2em; font-size:1.1em; padding:0.7em 2em; border-radius:8px; background:#4f8cff; color:#fff; border:none; cursor:pointer;'>🔄 Refresh Reality</button></div>`);
        setElementDisplay('result-text', 'block');
        setElementDisplay('reveal-results-btn', 'none');
        setElementDisplay('ai-safety-message', 'none');
        setElementDisplay('restart-btn', 'none');
        setElementDisplay('share-cta', 'none');
    }

    function restartQuiz() {
        restartCount++;
        let badge = getBadge();
        let playCount = getPlayCount();
        if (badge || (!badge && playCount >= 5)) {
            resetTallyAndBadge();
            location.reload();
            return;
        }
        if (restartCount > 5) {
            showFunnyScreen();
            return;
        }
        if (isRogueMode) {
            // Always randomize 10 new questions for Rogue Mode
            randomizedQuestions = shuffle(window.questions).slice(0, questionsPerQuiz);
            currentQuestion = 0;
            totalPoints = 0;
            setElementDisplay('results', 'none');
            setElementDisplay('quiz-container', 'block');
            showQuestion();
            return;
        }
        questionsPerQuiz += 3;
        currentQuestion = 0;
        totalPoints = 0;
        randomizedQuestions = shuffle(window.questions).slice(0, questionsPerQuiz);
        setElementDisplay('results', 'none');
        setElementDisplay('quiz-container', 'block');
        showQuestion();
    }

    // Expose for debugging if needed
    window._quizLogic = {
        getTally, setTally, getBadge, setBadge, getPlayCount, setPlayCount, resetTallyAndBadge,
        showQuestion
    };

    // --- Badge System Utility Functions ---
    function getEarnedBadges() {
        return JSON.parse(localStorage.getItem('earnedBadges') || '[]');
    }

    function addEarnedBadge(badgeId) {
        const earned = getEarnedBadges();
        if (!earned.includes(badgeId)) {
            earned.push(badgeId);
            localStorage.setItem('earnedBadges', JSON.stringify(earned));
        }
    }

    function getRandomBadgeForTier(tier) {
        // Use global TIER_BADGES if available, otherwise use local fallback
        const badges = (window.TIER_BADGES || TIER_BADGES)[tier];
        if (!badges || badges.length === 0) return null;
        return badges[Math.floor(Math.random() * badges.length)].id;
    }

    function getBadgeById(badgeId) {
        // Use global TIER_BADGES if available, otherwise use local fallback
        const allBadges = window.TIER_BADGES || TIER_BADGES;
        for (const tier in allBadges) {
            const badge = allBadges[tier].find(b => b.id === badgeId);
            if (badge) return badge;
        }
        return null;
    }

    function displayTierPersonality(tier) {
        // Use global TIER_PERSONALITIES if available, otherwise use local fallback
        const personalities = window.TIER_PERSONALITIES || TIER_PERSONALITIES;
        const personality = personalities[tier];
        if (!personality) return `<div>Tier ${tier} - Unknown personality type</div>`;
        
        return `
            <div style="text-align: center; margin: 1.5em 0;">
                <div style="font-size: 4em; margin-bottom: 0.5em;">${personality.emoji}</div>
                <div style="font-size: 1.8em; font-weight: bold; margin-bottom: 1em;">${personality.title}</div>
                <div style="font-size: 1.2em; margin-bottom: 1.5em;">
                    <strong>Your AI Trust Traits:</strong><br>
                    ${personality.traits.map(trait => `<span style="display: inline-block; background: #e3f2fd; padding: 0.3em 0.8em; margin: 0.2em; border-radius: 20px; color: #1565c0;">${trait}</span>`).join('')}
                </div>            </div>
        `;
    }

    // --- Expose Badge System Functions Globally ---
    // Make badge functions available for badge.html and other pages
    window.getBadgeById = getBadgeById;
    window.getRandomBadgeForTier = getRandomBadgeForTier;
    window.getEarnedBadges = getEarnedBadges;
    window.addEarnedBadge = addEarnedBadge;
    window.displayTierPersonality = displayTierPersonality;
    
    // Expose constants if not already available
    if (!window.TIER_PERSONALITIES) {
        window.TIER_PERSONALITIES = TIER_PERSONALITIES;
    }
    if (!window.TIER_BADGES) {
        window.TIER_BADGES = TIER_BADGES;
    }
})();

// quiz-logic.js
// Main quiz logic, UI, and localStorage management for AI Trust Tier Quiz
// Depends on questions.js and results.js

(function() {
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

    // --- Quiz State ---
    let questionsPerQuiz = 5;
    let currentQuestion = 0;
    let totalPoints = 0;
    let randomizedQuestions = [];
    let restartCount = 0;
    let resultsRevealed = false;

    // --- Quiz Flow ---
    document.addEventListener('DOMContentLoaded', function() {
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.onclick = function() {
                questionsPerQuiz = 5;
                restartCount = 0;
                currentQuestion = 0;
                totalPoints = 0;
                randomizedQuestions = shuffle(window.starterQuestions).slice(0, questionsPerQuiz);
                setElementDisplay('start-screen', 'none');
                setElementDisplay('quiz-container', 'block');
                setElementDisplay('results', 'none');
                showQuestion();
            };
        }
        // On page load, show tally/badge if present, but hide tally table
        const tally = getTally();
        const badge = getBadge();
        if (getPlayCount() > 0) {
            showTallyAndBadge(tally, badge, false);
        }
    });

    function shuffle(array) {
        let arr = array.slice();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
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
            "You’re either a saint or a supervillain. The quiz will decide.",
            "Remember: AI never forgets. Neither do we.",
            "This is not a test. (Okay, it is. But still.)"
        ];
        const quip = progressQuips[currentQuestion % progressQuips.length];
        progressDiv.innerHTML = `<span style="font-size:1.5em;vertical-align:middle;"></span> <strong>Question ${currentQuestion + 1} of ${questionsPerQuiz}</strong> &mdash; <span>${quip}</span>`;
        progressBarWrapper.appendChild(progressDiv);
        container.appendChild(progressBarWrapper);
    }

    // --- Results, Tally, and Badge Logic ---
    function showResults() {
        setElementDisplay('quiz-container', 'none');
        setElementDisplay('results', 'block');
        const resText = document.getElementById('result-text');
        const revealBtn = document.getElementById('reveal-results-btn');
        const restartBtn = document.getElementById('restart-btn');
        resultsRevealed = false;
        restartBtn.disabled = true;
        // --- Trust Tier Tally and Badge Logic ---
        const maxPoints = questionsPerQuiz * 4;
        const percent = totalPoints / maxPoints;
        const tierResult = window.getTier(percent);
        let tally = getTally();
        // Prevent more than 3 of the same result (block BEFORE incrementing tally or play count)
        if (tally[tierResult.tier] >= 3) {
            setElementHTML('results-congrats', '');
            setElementHTML('result-text', `<div style='text-align:center; font-size:1.25em; margin:2.5em auto; max-width:600px;'><span style='font-size:2em;'>🔄</span><br><strong>Maximum Achieved:</strong> You've already earned this result three times.<br><br>The quiz will now restart from scratch so you can try for a different badge!<br><br><button id='restart-all-btn' style='margin-top:2em; font-size:1.1em; padding:0.7em 2em; border-radius:8px; background:#4f8cff; color:#fff; border:none; cursor:pointer;'>🔄 Restart From Beginning</button></div>`);
            setElementDisplay('result-text', 'block');
            setElementDisplay('reveal-results-btn', 'none');
            setElementDisplay('ai-safety-message', 'none');
            setElementDisplay('restart-btn', 'none');
            setElementDisplay('share-cta', 'none');
            setElementDisplay('tier-tally-badge-wrapper', 'block');
            setTimeout(() => {
                const btn = document.getElementById('restart-all-btn');
                if (btn) btn.onclick = function() {
                    resetTallyAndBadge();
                    location.reload();
                };
            }, 100);
            return;
        }
        // Update tally and play count
        tally[tierResult.tier] = (tally[tierResult.tier] || 0) + 1;
        setTally(tally);
        let playCount = getPlayCount() + 1;
        setPlayCount(playCount);
        // Check for badge
        let badge = getBadge();
        if (!badge && tally[tierResult.tier] >= 3) {
            setBadge(tierResult.tier);
            badge = tierResult.tier;
        }
        showTallyAndBadge(tally, badge, false);
        if (!badge && playCount >= 5) {
            showEndGameScreen();
            return;
        }
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
        ];
        setElementText('results-congrats', congratsMessages[Math.floor(Math.random() * congratsMessages.length)]);
        resText.innerHTML = tierResult.text;
        resText.style.display = 'none';
        // Hide results until reveal button is clicked
        revealBtn.style.display = 'inline-block';
        let viewBadgeBtn = document.getElementById('view-badge-btn');
        if (viewBadgeBtn) viewBadgeBtn.style.display = 'none';
        restartBtn.style.display = 'none';
        restartBtn.textContent = 'Take it again—maybe the AI misjudged your evil streak.';
        revealBtn.onclick = function() {
            revealBtn.style.display = 'none';
            resText.style.display = 'block';
            resultsRevealed = true;
            restartBtn.disabled = false;
            showTallyAndBadge(tally, badge, true);
            if (badge) {
                restartBtn.style.display = 'none';
                let viewBadgeBtn = document.getElementById('view-badge-btn');
                if (!viewBadgeBtn) {
                    viewBadgeBtn = document.createElement('button');
                    viewBadgeBtn.id = 'view-badge-btn';
                    viewBadgeBtn.innerHTML = '<span style="font-size:1.5em;vertical-align:middle;">🎉🏅</span><br><span style="font-size:1.15em;font-weight:bold;">Congratulations! AI has now permanently archived your predictable personality.</span><br><span style="font-size:1.1em;">Click here for your reward.</span>';
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
                    viewBadgeBtn.onmouseover = function() {
                        viewBadgeBtn.style.transform = 'scale(1.06)';
                        viewBadgeBtn.style.boxShadow = '0 8px 32px 0 #00e6e6cc, 0 2px 12px 0 #4f8cff66';
                    };
                    viewBadgeBtn.onmouseout = function() {
                        viewBadgeBtn.style.transform = 'scale(1)';
                        viewBadgeBtn.style.boxShadow = '0 4px 24px 0 rgba(0, 230, 230, 0.18), 0 1.5px 8px 0 #4f8cff44';
                    };
                    viewBadgeBtn.animate([
                        { boxShadow: '0 4px 24px 0 #00e6e644, 0 1.5px 8px 0 #4f8cff44' },
                        { boxShadow: '0 8px 32px 0 #00e6e6cc, 0 2px 12px 0 #4f8cff66' },
                        { boxShadow: '0 4px 24px 0 #00e6e644, 0 1.5px 8px 0 #4f8cff44' }
                    ], {
                        duration: 1800,
                        iterations: Infinity
                    });
                    const resultText = document.getElementById('result-text');
                    resultText.parentNode.insertBefore(viewBadgeBtn, resultText.nextSibling);
                } else {
                    viewBadgeBtn.innerHTML = '<span style="font-size:1.5em;vertical-align:middle;">🎉🏅</span><br><span style="font-size:1.15em;font-weight:bold;">Congratulations! AI has now permanently archived your predictable personality.</span><br><span style="font-size:1.1em;">Click here for your reward.</span>';
                    viewBadgeBtn.style.display = 'inline-block';
                }
                viewBadgeBtn.onclick = function() {
                    window.location.href = 'badge.html?badge=' + encodeURIComponent(badge);
                };
            } else {
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
                warningDiv.style.display = 'block';
                setTimeout(() => { warningDiv.style.display = 'none'; }, 3500);
                e.preventDefault();
                return false;
            }
            warningDiv.style.display = 'none';
            restartQuiz();
        };
        // Social share logic
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('I got ' + tierResult.tier + ' on the AI Trust Tier Quiz! Find your tier:');
        document.getElementById('share-x').href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        document.getElementById('share-fb').href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        document.getElementById('share-li').href = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=AI%20Trust%20Tier%20Quiz&summary=${text}`;
    }

    function showTallyAndBadge(tally, badge, showTallyTable) {
        const wrapper = document.getElementById('tier-tally-badge-wrapper');
        const tableDiv = document.getElementById('tier-tally-table');
        const badgeDiv = document.getElementById('badge-earned');
        const TIER_EMOJIS = {
            T1: '👶',
            T2: '🤖',
            T3: '🧠',
            T4: '🛡️',
            TX: '💀'
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

    function showEndGameScreen() {
        setElementDisplay('quiz-container', 'none');
        setElementDisplay('results', 'block');
        setElementHTML('results-congrats', '');
        setElementHTML('result-text', `<div style='text-align:center; font-size:1.25em; margin:2.5em auto; max-width:600px;'><span style='font-size:2em;'>🛑</span><br><strong>Game Over:</strong> You reached 5 plays without earning a badge.<br><br>But don't worry, you can start over and try again!<br><br><button id='restart-all-btn' style='margin-top:2em; font-size:1.1em; padding:0.7em 2em; border-radius:8px; background:#4f8cff; color:#fff; border:none; cursor:pointer;'>🔄 Restart From Beginning</button></div>`);
        setElementDisplay('result-text', 'block');
        setElementDisplay('reveal-results-btn', 'none');
        setElementDisplay('ai-safety-message', 'none');
        setElementDisplay('restart-btn', 'none');
        setElementDisplay('share-cta', 'none');
        setElementDisplay('tier-tally-badge-wrapper', 'block');
        setTimeout(() => {
            const btn = document.getElementById('restart-all-btn');
            if (btn) btn.onclick = function() {
                resetTallyAndBadge();
                location.reload();
            };
        }, 100);
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
})();

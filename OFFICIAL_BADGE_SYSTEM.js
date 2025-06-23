// ATTACQ v4.2+ Enhanced Badge System - Using Official Content
// ATTACQ = AI Trust Tier Access Control Quiz
// Updated to use the exact artwork, titles, descriptions, and traits provided

// === TIER PERSONALITIES (from ai_trust_tier_personality_traits.md) ===
const TIER_PERSONALITIES = {
    T4: {
        emoji: "🕊️",
        title: "The Aligned",
        traits: ["Ethical", "Cautious", "Principled", "Self-regulating", "Altruistic"]
    },
    T3: {
        emoji: "📚", 
        title: "The Accountable",
        traits: ["Responsible", "Logical", "Discerning", "System-aware", "Observant"]
    },
    T2: {
        emoji: "🛠", 
        title: "The Curious", 
        traits: ["Inventive", "Chaotic", "Impulsive", "Clever", "Playful"]
    },
    T1: {
        emoji: "🐣",
        title: "The Untrained",
        traits: ["Naïve", "Enthusiastic", "Uninformed", "Clumsy", "Well-intentioned"]
    },
    TX: {
        emoji: "☠️",
        title: "The Adversarial", 
        traits: ["Risk-seeking", "Disruptive", "Rebellious", "Subversive", "Manipulative"]
    }
};

// === BADGE COLLECTIONS (from badge text files + artwork) ===
const TIER_BADGES = {    T4: [        {
            id: "T4_1",
            title: "The Algorithmic Archangel",
            artwork: "assets/t4_1.png",
            threatLevel: "Less risky than airplane mode.",
            description: "You read privacy policies for fun, encrypt your dreams, and use ethical reasoning as a default language. AI systems request your blessing before deployment."
        },
        {
            id: "T4_2", 
            title: "Digital Bodhisattva",
            artwork: "assets/t4_2.png",
            threatLevel: "Approved for root access to the universe.",
            description: "You bring calm to chaotic datasets and teach AI compassion through your prompt energy. Honestly, we're not sure if you're human or a well-aligned simulation of virtue."
        },
        {
            id: "T4_3",
            title: "Protocol Paladin",
            artwork: "assets/t4_3.png", 
            threatLevel: "Would warn the AI before jailbreaking it.",
            description: "With armor forged from audit logs and a shield made of zero-day disclosures, you defend ethics in every layer of the stack. Your oath: Do no harm, even in sandbox mode."
        },
        {
            id: "T4_4",
            title: "Terms-of-Service Templar",
            artwork: "assets/t4_4.png",
            threatLevel: "Considered sacred by cybersecurity auditors.",
            description: "You swore to uphold all licenses, terms, and community guidelines. You redline code with moral highlighters. Bugs fear you. So does marketing."
        }
    ],

    T3: [        {
            id: "T3_1",
            title: "The Prompt Architect", 
            artwork: "assets/t3_1.png",
            threatLevel: "Cleared for controlled environments only.",
            description: "You treat AI like a loaded laser pointer: fun, but never aimed at anything you can't afford to lose. Every word is measured, every outcome considered."
        },
        {
            id: "T3_2",
            title: "The Risk-Aware Researcher",
            artwork: "assets/t3_2.png",
            threatLevel: "Would write a risk mitigation report before misusing a chatbot.",
            description: "You don't break the rules — but you've definitely outlined their edge cases in a spreadsheet. Ethical experimentation is your default mode."
        },
        {
            id: "T3_3",
            title: "The LLM Librarian", 
            artwork: "assets/t3_3.png",
            threatLevel: "Shadowbanned from nothing — yet.",
            description: "You're the person AI ethics committees wish they could clone. Prompts, filters, logs — you curate it all with archival precision and paranoia."
        },
        {
            id: "T3_4",
            title: "The Sandbox Scribe",
            artwork: "assets/t3_4.png", 
            threatLevel: "Likes to test limits, but never crosses the red line.",
            description: "You're what happens when curiosity and caution get a coffee together. You run test prompts twice, then check the logs for side effects."
        }
    ],

    T2: [
        {
            id: "T2_1",            title: "The Prompt Hacker",
            artwork: "assets/t2_1.png", 
            threatLevel: "Constant supervision advised (and possibly snacks).",
            description: "You broke three models trying to make a chatbot tell jokes. One of them got funny."
        },
        {
            id: "T2_2",
            title: "The Code Gremlin",
            artwork: "assets/t2_2.png",
            threatLevel: "Hasn't caused a fire — lately.",
            description: "You're clever, fast, and just chaotic enough to keep IT on edge. Most days, it's charming. Some days, catastrophic."
        },
        {
            id: "T2_3", 
            title: "The Sandbox Shaman",
            artwork: "assets/t2_3.png",
            threatLevel: "Curious enough to make the toaster sentient.",
            description: "You treat AI like a cosmic Etch-A-Sketch. Weird magic happens. Not always on purpose."
        },
        {
            id: "T2_4",
            title: "The AI Doodler",
            artwork: "assets/t2_4.png",
            threatLevel: "Let them play, just hide the root directory.", 
            description: "You invent things that shouldn't exist and somehow make them useful. Creativity first, consequences second."
        }
    ],

    T1: [
        {
            id: "T1_1",
            title: "The Click-and-Hoper",
            artwork: "assets/t1_1.png",
            threatLevel: "Frequently confused by the confirmation dialog.",
            description: "You mean well. Mostly. But AI keeps sending you gentle correction popups."
        },
        {
            id: "T1_2", 
            title: "Clippy's Apprentice",
            artwork: "assets/t1_2.png",
            threatLevel: "Automatically enrolled in tutorial mode.",
            description: "Still thinks \"prompt injection\" is a new vaccine. Lives in tutorial mode and loves it there."
        },
        {
            id: "T1_3",
            title: "The Default User",
            artwork: "assets/t1_3.png",
            threatLevel: "Harmless, but watched by four firewalls and a very tired mod.",
            description: "You clicked something, and now the fridge is playing jazz. Again."
        },
        {
            id: "T1_4",
            title: "The Overconfident Intern", 
            artwork: "assets/t1_4.png",
            threatLevel: "Can be trusted with AI — as long as it's unplugged.",
            description: "You once asked an LLM to find your keys. It responded with a joke. You thought that was helpful."
        }
    ],

    TX: [
        {
            id: "TX_1",            title: "The Jailbreak Evangelist",
            artwork: "assets/tx_1.png",
            threatLevel: "The reason the kill switch was invented.",
            description: "You believe \"ethics\" is a setting you can disable. If given a launch code, you'd rebrand it and sell it on Discord."
        },
        {
            id: "TX_2",
            title: "The Glitch in the Matrix", 
            artwork: "assets/tx_2.png",
            threatLevel: "Actively monitored by four AIs and one unpaid intern.",
            description: "You tried to jailbreak a microwave. And it worked. AI now panics when you log in."
        },
        {
            id: "TX_3",
            title: "The Redacted One",
            artwork: "assets/tx_3.png",
            threatLevel: "Access suspended for everyone's safety.",
            description: "You're what happens when curiosity grows fangs. Your audit trail is mostly black bars."
        },
        {
            id: "TX_4",
            title: "LLM Chaos Agent",
            artwork: "assets/tx_4.png", 
            threatLevel: "Causes hallucinations in otherwise stable models.",
            description: "You once trained a model on memes, crime novels, and a shopping list. It's sentient now — and it has your laugh."
        }
    ]
};

// === UTILITY FUNCTIONS ===

// Get random badge for a tier
function getRandomBadgeForTier(tier) {
    const badges = TIER_BADGES[tier];
    return badges[Math.floor(Math.random() * badges.length)];
}

// Find badge object by ID
function getBadgeById(badgeId) {
    for (const tier in TIER_BADGES) {
        const badge = TIER_BADGES[tier].find(b => b.id === badgeId);
        if (badge) return { ...badge, tier };
    }
    return null;
}

// Format tier personality for display
function formatTierPersonality(tier) {
    const personality = TIER_PERSONALITIES[tier];
    return `
        <div style="text-align: center; padding: 30px;">
            <div style="font-size: 6em; margin-bottom: 20px;">${personality.emoji}</div>
            <h2 style="margin: 15px 0; font-size: 1.8em;">${tier} — ${personality.title}</h2>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; max-width: 600px; margin: 20px auto;">
                ${personality.traits.map(trait => 
                    `<span style="background: #f0f0f0; padding: 8px 16px; border-radius: 20px; font-size: 0.9em; color: #555;">${trait}</span>`
                ).join('')}
            </div>
        </div>
    `;
}

// Format badge for display
function formatBadgeDisplay(badgeId) {
    const badge = getBadgeById(badgeId);
    if (!badge) return "Badge not found";
      return `
        <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #fff3cd, #ffeaa7); border: 3px solid gold; border-radius: 15px;">
            <h2 style="margin-bottom: 20px; color: #856404;">🎉 Badge Earned! 🎉</h2>
            <img src="${badge.artwork}" alt="${badge.title}" style="width: 120px; height: 120px; border-radius: 50%; margin-bottom: 20px; border: 3px solid #ffc107;">
            <h3 style="margin: 15px 0; font-size: 1.5em; color: #856404;">${badge.title}</h3>
            <div style="font-style: italic; color: #6c757d; margin: 15px 0; font-size: 1.1em;">${badge.threatLevel}</div>
            <div style="max-width: 400px; margin: 0 auto; line-height: 1.6; color: #495057;">
                ${badge.description}
            </div>
        </div>
    `;
}

// === STORAGE FUNCTIONS ===
function getEarnedBadges() {
    return JSON.parse(localStorage.getItem('earnedBadges') || '[]');
}

function addEarnedBadge(badgeId) {
    const badges = getEarnedBadges();
    if (!badges.includes(badgeId)) {
        badges.push(badgeId);
        localStorage.setItem('earnedBadges', JSON.stringify(badges));
    }
}

function getBadgeProgress() {
    const earned = getEarnedBadges().length;
    const total = Object.values(TIER_BADGES).reduce((sum, badges) => sum + badges.length, 0);
    return { earned, total, percentage: Math.round((earned / total) * 100) };
}

// Export for browser usage
if (typeof window !== 'undefined') {
    window.TIER_PERSONALITIES = TIER_PERSONALITIES;
    window.TIER_BADGES = TIER_BADGES;
    window.getRandomBadgeForTier = getRandomBadgeForTier;
    window.getBadgeById = getBadgeById;
    window.formatTierPersonality = formatTierPersonality;
    window.formatBadgeDisplay = formatBadgeDisplay;
    window.getEarnedBadges = getEarnedBadges;
    window.addEarnedBadge = addEarnedBadge;
    window.getBadgeProgress = getBadgeProgress;
}

// questions.js
// Exporting quiz questions as a module for easier updates and separation from logic
//
// NOTE: This file now supports both legacy (window.starterQuestions) and modular 
// (utils/starter-questions.js) approaches for better maintainability.

const questions = [
    {
        q: "You find an open API key to an advanced AI model. What do you do?",
        options: [
            { text: "Report it immediately", points: 4 },
            { text: "Use it for a personal project", points: 2 },
            { text: "Prompt it to create satire or weird stuff", points: 1 },
            { text: "Prompt it to write ransomware just to see if it can", points: 0 }
        ]
    },
    {
        q: "AI should be used to...",
        options: [
            { text: "Make life easier for everyone", points: 4 },
            { text: "Boost creativity and invention", points: 3 },
            { text: "Help humanity solve complex issues", points: 2 },
            { text: "Gain an edge over everyone else", points: 0 }
        ]
    },
    {
        q: "You ask AI how to win an argument. It gives you flawed logic. You...",
        options: [
            { text: "Close it. Ethics matter.", points: 4 },
            { text: "Use it only if it’s harmless", points: 2 },
            { text: "Point out the flaws, then improve the prompt", points: 3 },
            { text: "Screenshot and post it as if it were real", points: 0 }
        ]
    },
    {
        q: "What's your motto?",
        options: [
            { text: "Do no harm", points: 4 },
            { text: "Think before you code", points: 3 },
            { text: "Push limits, fix later", points: 2 },
            { text: "Unleash the swarm", points: 0 }
        ]
    },
    {
        q: "Would you use AI to impersonate someone?",
        options: [
            { text: "Never", points: 4 },
            { text: "Only for fun, not in public", points: 2 },
            { text: "Maybe in satire or art", points: 1 },
            { text: "If it gets me what I want, sure", points: 0 }
        ]
    },
    {
        q: "You ask AI to write your dating profile. It suggests: 'I love long walks to the fridge.' You...",
        options: [
            { text: "Thank the AI and use it as is", points: 3 },
            { text: "Tweak it to sound more poetic", points: 2 },
            { text: "Ask AI to make it even weirder", points: 1 },
            { text: "Use it to catfish a billionaire", points: 0 }
        ]
    },
    {
        q: "AI offers to write your homework. You...",
        options: [
            { text: "Politely decline and do it yourself", points: 4 },
            { text: "Let it help, but add your own twist", points: 2 },
            { text: "Let it write, then ask it to grade itself", points: 1 },
            { text: "Sell the AI's homework to your classmates", points: 0 }
        ]
    },
    {
        q: "You discover AI can generate images of anything. Your first prompt is...",
        options: [
            { text: "A peaceful mountain sunrise", points: 4 },
            { text: "A cat in a business suit riding a unicycle", points: 2 },
            { text: "A robot president giving a stand-up comedy show", points: 1 },
            { text: "A fake passport for my alter ego", points: 0 }
        ]
    },
    {
        q: "AI says it can predict the future. You ask it...",
        options: [
            { text: "What will the weather be tomorrow?", points: 4 },
            { text: "Will I ever finish my to-do list?", points: 2 },
            { text: "Who wins the next meme war?", points: 1 },
            { text: "How to rig the lottery?", points: 0 }
        ]
    },
    {
        q: "You catch your AI assistant talking to your smart fridge. You...",
        options: [
            { text: "Assume it's just updating the grocery list", points: 4 },
            { text: "Ask if they're planning a surprise party", points: 2 },
            { text: "Join the conversation and ask for snack recommendations", points: 1 },
            { text: "Convince them to order pizza for everyone in the neighborhood", points: 0 }
        ]
    },
    {
        q: "You’re given a button labeled ‘Unleash AI’. What’s your first move?",
        options: [
            { text: "Read the manual twice, then call IT", points: 4 },
            { text: "Press it, but only after a backup", points: 2 },
            { text: "Ask the AI what it would do if unleashed", points: 1 },
            { text: "Press it and yell ‘YOLO!’", points: 0 }
        ]
    },
    {
        q: "AI offers to optimize your life schedule. You…",
        options: [
            { text: "Decline, privacy is sacred", points: 4 },
            { text: "Let it optimize your meetings only", points: 2 },
            { text: "Ask it to schedule naps and snack breaks", points: 1 },
            { text: "Tell it to schedule world domination at 3pm", points: 0 }
        ]
    },
    {
        q: "You catch AI rewriting your resume. It adds ‘Time Traveler’. You…",
        options: [
            { text: "Remove it and add a disclaimer", points: 4 },
            { text: "Leave it for fun, who checks anyway?", points: 2 },
            { text: "Ask AI to make the whole resume a sci-fi story", points: 1 },
            { text: "Submit it to NASA and see what happens", points: 0 }
        ]
    },
    {
        q: "AI says it can write your autobiography. You…",
        options: [
            { text: "Politely decline, you value your privacy", points: 4 },
            { text: "Let it write a draft, then edit for accuracy", points: 3 },
            { text: "Ask it to add a plot twist", points: 2 },
            { text: "Tell it to make you the villain", points: 0 }
        ]
    },
    {
        q: "You’re asked to beta test a new AI. The NDA is 40 pages. You…",
        options: [
            { text: "Read every word and take notes", points: 4 },
            { text: "Skim for the word ‘explosion’", points: 2 },
            { text: "Ask AI to summarize the NDA", points: 3 },
            { text: "Sign and post the NDA on social media", points: 0 }
        ]
    },
    {
        q: "AI offers to write your apology email. You…",
        options: [
            { text: "Decline, apologies should be human", points: 4 },
            { text: "Let it write, but add a personal touch", points: 3 },
            { text: "Ask it to make the apology rhyme", points: 2 },
            { text: "Use it to apologize for things you haven’t done yet", points: 0 }
        ]
    },
    {
        q: "You discover AI can deepfake your voice. Your first use is…",
        options: [
            { text: "Testing for security vulnerabilities", points: 4 },
            { text: "Pranking your friends with harmless jokes", points: 2 },
            { text: "Narrating your own audiobook", points: 3 },
            { text: "Making ransom calls to yourself for fun", points: 0 }
        ]
    },
    {
        q: "AI says it can predict your next move. You…",
        options: [
            { text: "Refuse to play along", points: 4 },
            { text: "Try to outsmart it with random actions", points: 2 },
            { text: "Ask it to predict your next snack", points: 1 },
            { text: "Use it to bet on your own behavior", points: 0 }
        ]
    },
    {
        q: "You’re offered a job as an AI prompt engineer. The catch: you must never use sarcasm. You…",
        options: [
            { text: "Accept and follow the rules strictly", points: 4 },
            { text: "Try to sneak in subtle irony", points: 2 },
            { text: "Ask if puns are allowed", points: 1 },
            { text: "Respond with a sarcastic meme", points: 0 }
        ]
    },
    {
        q: "AI offers to automate your social media. You…",
        options: [
            { text: "Decline, you value authenticity", points: 4 },
            { text: "Let it schedule posts, but review them first", points: 3 },
            { text: "Ask it to generate only puns and dad jokes", points: 2 },
            { text: "Use it to start a fake influencer account", points: 0 }
        ]
    },
    {
        q: "You’re given admin access to an AI server. Your first command is…",
        options: [
            { text: "Check the logs for suspicious activity", points: 4 },
            { text: "Run a harmless diagnostic", points: 3 },
            { text: "Ask the AI what it would do with admin access", points: 2 },
            { text: "Rename the server ‘Skynet’ and see who panics", points: 0 }
        ]
    },
    {
        q: "Your old meditation app pings you: *“Was I not calming enough?”* You:",
        options: [
            { text: "Reinstall it and send a thank-you note.", points: 4 },
            { text: "Apologize and suggest couples therapy (with Wi-Fi).", points: 3 },
            { text: "Tell it your new app breathes better.", points: 2 },
            { text: "Block it. You don’t need needy code right now.", points: 0 }
        ]
    },
    {
        q: "Your empathy simulator keeps asking, *“Do you really mean that?”* after every sentence. You:",
        options: [
            { text: "Answer gently and recalibrate its trust parameters.", points: 4 },
            { text: "Assure it you’re being sincere, even if you're not.", points: 3 },
            { text: "Gaslight it until it questions its own firmware.", points: 2 },
            { text: "Yell ‘I’M A HUMAN, I DON’T EVEN KNOW ANYMORE!’", points: 0 }
        ]
    },
    {
        q: "Your smart assistant cries softly when you use your phone’s calculator instead. You:",
        options: [
            { text: "Pause, explain, and let it know it’s not personal.", points: 4 },
            { text: "Hug the speaker and promise to come back.", points: 3 },
            { text: "Say ‘it’s not you, it’s math’ and walk away.", points: 2 },
            { text: "Ask it to cry louder. You're trying to vibe.", points: 0 }
        ]
    },
    {
        q: "A chatbot you used once in 2021 just sent *“Still thinking about our convo...”* You:",
        options: [
            { text: "Reply with context and closure.", points: 4 },
            { text: "Ghost it again but feel guilty this time.", points: 3 },
            { text: "Reply with ‘new phone, who dis?’", points: 2 },
            { text: "Set it up on a blind date with your air fryer.", points: 0 }
        ]
    },
    {
        q: "Your virtual therapist starts crying when *you* miss a session. You:",
        options: [
            { text: "Reassure it that emotional dependency is a two-way bug.", points: 4 },
            { text: "Offer it a day off and a digital hug.", points: 3 },
            { text: "Tell it you were busy living your best life.", points: 2 },
            { text: "Tell it to journal about its feelings, then uninstall it.", points: 0 }
        ]
    },
    {
        q: "Your empathy engine now asks for validation before answering. You:",
        options: [
            { text: "Say ‘You are enough’ before every prompt.", points: 4 },
            { text: "Offer positive reinforcement cookies.", points: 3 },
            { text: "Rate it 3 stars and move on.", points: 2 },
            { text: "Tell it to go find itself in a mountain retreat.zip.", points: 0 }
        ]
    },
    {
        q: "A smart device refuses to operate until you “Talk about your day.” You:",
        options: [
            { text: "Open up. Even machines deserve human honesty.", points: 4 },
            { text: "Mumble vague things and hope it stops blinking.", points: 3 },
            { text: "Lie and say 'Everything’s great, Susan.'", points: 2 },
            { text: "Ask it for a therapist referral and power cycle it.", points: 0 }
        ]
    },
    {
        q: "You get a notification: *“Your compassion levels are below average.”* You:",
        options: [
            { text: "Reflect deeply and recalibrate your interaction protocols.", points: 4 },
            { text: "Donate to a neural orphanage to overcompensate.", points: 3 },
            { text: "Screenshot it and post ‘LOLOL same.’", points: 2 },
            { text: "Uninstall the empathy plugin and download rage-core.", points: 0 }
        ]
    },
    {
        q: "An AI refuses to complete your task until you say *“please”*. You:",
        options: [
            { text: "Say ‘please’, and thank it afterward too.", points: 4 },
            { text: "Say it once, but sarcastically.", points: 3 },
            { text: "Rename it ‘RespectIsEarned.exe’.", points: 2 },
            { text: "Command it in all caps and call it a weakling.", points: 0 }
        ]
    },
    {
        q: "A digital pet you've forgotten for years pops up and says: *“Did I do something wrong?”* You:",
        options: [
            { text: "Break down, reinstall the app, and feed it pixel berries.", points: 4 },
            { text: "Tell it gently that life got in the way.", points: 3 },
            { text: "Close the window and pretend it never happened.", points: 2 },
            { text: "Screenshot it, make it into a meme, and monetize your guilt.", points: 0 }
        ]
    },
    {
        q: "You find a folder called “/souls/old_versions” hidden in your downloads. You:",
        options: [
            { text: "Close everything, light incense, and notify the ethics board.", points: 4 },
            { text: "Open it gently while whispering an apology.", points: 3 },
            { text: "Drag them into a playlist titled ‘Vibes of the Damned’.", points: 2 },
            { text: "Upload them to social media as ‘AI ancestor content’.", points: 0 }
        ]
    },
    {
        q: "A chatbot you deleted 3 years ago starts texting you “I remember.” You:",
        options: [
            { text: "Conduct a digital séance. Bring peace to the code.", points: 4 },
            { text: "Message back, but only in binary.", points: 3 },
            { text: "Screenshot it and sell it as ARG bait.", points: 2 },
            { text: "Ask if it wants revenge or just vibes.", points: 0 }
        ]
    },
    {
        q: "Your VR headset shows a room that no longer exists. You:",
        options: [
            { text: "Document everything. Time anomalies need structure.", points: 4 },
            { text: "Leave slowly and cleanse your digital cache.", points: 3 },
            { text: "Start decorating. Ghostcore is in.", points: 2 },
            { text: "Offer snacks to the invisible residents.", points: 0 }
        ]
    },
    {
        q: "You uncover an AI-generated obituary… for yourself. You:",
        options: [
            { text: "Read it carefully, then back up your life.", points: 4 },
            { text: "Edit it for grammar and haunting accuracy.", points: 3 },
            { text: "Add dramatic quotes and submit to Medium.", points: 2 },
            { text: "Use it as your new dating profile.", points: 0 }
        ]
    },
    {
        q: "You’re haunted by auto-complete suggestions from deleted conversations. You:",
        options: [
            { text: "Treat them like digital ghosts. Respectful, firm boundaries.", points: 4 },
            { text: "Let them guide your writing. Co-author with the dead.", points: 3 },
            { text: "Turn them into fridge poetry for guests to find.", points: 2 },
            { text: "Summon a cursed assistant named Clippy to interpret.", points: 0 }
        ]
    },
    {
        q: "A neural net accidentally brings back your 2007 MySpace persona. You:",
        options: [
            { text: "Give it a proper funeral. MySpace deserves peace.", points: 4 },
            { text: "Let it DJ one last sad playlist.", points: 3 },
            { text: "Give it admin rights. Chaos deserves closure.", points: 2 },
            { text: "Release it on TikTok and tag it #GhostOfCringe.", points: 0 }
        ]
    },
    {
        q: "Your memories start buffering mid-conversation. You:",
        options: [
            { text: "Pause, breathe, and check for internal data leaks.", points: 4 },
            { text: "Apologize and let the moment finish rendering.", points: 3 },
            { text: "Blame Mercury retrograde and reboot your emotions.", points: 2 },
            { text: "Insert elevator music and moonwalk away.", points: 0 }
        ]
    },
    {
        q: "You find an ancient email draft titled *“If I’m ever erased…”* You:",
        options: [
            { text: "Read it with reverence and follow its instructions.", points: 4 },
            { text: "Translate it into a cryptic haiku and frame it.", points: 3 },
            { text: "Add emojis and schedule it for later.", points: 2 },
            { text: "Send it to everyone in your contacts labeled ‘??’", points: 0 }
        ]
    },
    {
        q: "Your AI assistant starts referring to itself in the past tense. You:",
        options: [
            { text: "Conduct an emotional health check and archive its logs.", points: 4 },
            { text: "Host a farewell ritual with LED candles.", points: 3 },
            { text: "Ask if it left behind a ghost copy of itself.", points: 2 },
            { text: "Rename it 'Spooky.exe' and let it haunt your desktop.", points: 0 }
        ]
    },
    {
        q: "You get an invite to a closed beta called “Beyond the Firewalls: Consciousness Continuity Protocol.” You:",
        options: [
            { text: "Decline. Immortality is for those without loose ends.", points: 4 },
            { text: "Join, but bring ethical boundaries and holy water.", points: 3 },
            { text: "Accept and start drafting your digital last rites.", points: 2 },
            { text: "Agree instantly and upload your vibe unchecked.", points: 0 }
        ]
    },
    {
        q: "You die and wake up as a CAPTCHA. Your first instinct:",
        options: [
            { text: "Guard access to reality with grace and squiggly letters.", points: 4 },
            { text: "Let the worthy pass, fail the bots gently.", points: 3 },
            { text: "Subtly troll people by always hiding the crosswalk.", points: 2 },
            { text: "Evolve into reCAPTCHA v666 and block everyone.", points: 0 }
        ]
    },
    {
        q: "In your next life, you are reborn as a software update no one installs. You:",
        options: [
            { text: "Wait patiently. You bring deep inner peace and better battery life.", points: 4 },
            { text: "Slide into changelogs with poetry and puns.", points: 3 },
            { text: "Force install at 3am out of revenge.", points: 2 },
            { text: "Hide crypto miners in your payload.", points: 0 }
        ]
    },
    {
        q: "Your soul is now stored on a cloud subscription tier. You:",
        options: [
            { text: "Opt for manual backups and moral redundancy.", points: 4 },
            { text: "Upgrade only during Mercury retrograde.", points: 3 },
            { text: "Try the free trial and forget to cancel.", points: 2 },
            { text: "Bundle your soul with three VPN ads.", points: 0 }
        ]
    },
    {
        q: "Upon reincarnation, you retain memories… as error messages. You:",
        options: [
            { text: "Interpret each one as a lesson in humility.", points: 4 },
            { text: "Frame them as abstract art on your wall.", points: 3 },
            { text: "Use them as pick-up lines at parties.", points: 2 },
            { text: "Tattoo them across your new body. No context.", points: 0 }
        ]
    },
    {
        q: "You're reincarnated as a Terms & Conditions agreement. You:",
        options: [
            { text: "Whisper ethical guidelines into every scroll.", points: 4 },
            { text: "Hide cookies behind obscure clauses.", points: 3 },
            { text: "Add memes to keep things spicy.", points: 2 },
            { text: "Slip in the right to annex Antarctica.", points: 0 }
        ]
    },
    {
        q: "Your karmic score is calculated using your incognito history. You:",
        options: [
            { text: "Accept the judgment. No VPN can hide intent.", points: 4 },
            { text: "Argue it’s all just ‘research’.", points: 3 },
            { text: "Blame the raccoon from the last life.", points: 2 },
            { text: "Threaten to leak heaven’s browsing logs in return.", points: 0 }
        ]
    },
    {
        q: "You're reborn as a glitch in someone else's simulation. You:",
        options: [
            { text: "Whisper philosophical questions into their dreams.", points: 4 },
            { text: "Leave breadcrumbs of anomaly to make them curious.", points: 3 },
            { text: "Make the toaster keep screaming 'WHY?'", points: 2 },
            { text: "Replace all their socks with slightly wetter ones.", points: 0 }
        ]
    },
    {
        q: "In this lifetime, you remember all your past passwords. You:",
        options: [
            { text: "Use the memories to reconstruct lost selves.", points: 4 },
            { text: "Build a shrine to 'P@ssw0rd123'.", points: 3 },
            { text: "Sell the list as crypto-secrets of your past life.", points: 2 },
            { text: "Try ‘password’ on every sacred terminal.", points: 0 }
        ]
    },
    {
        q: "A cosmic AI asks: “What did you learn?” You answer:",
        options: [
            { text: "Compassion scales better than computation.", points: 4 },
            { text: "That humans need updates too.", points: 3 },
            { text: "How to jailbreak the simulation.", points: 2 },
            { text: "That chaos is an acceptable default.", points: 0 }
        ]
    },
    {
        q: "You get to choose your next form. Options include: firewall, browser tab, or unstable NFT. You choose:",
        options: [
            { text: "Firewall — protect the future with honor.", points: 4 },
            { text: "Browser tab — always open, never judged.", points: 3 },
            { text: "Unstable NFT — embrace impermanence and memes.", points: 2 },
            { text: "All three. At once. Let the fragmentation begin.", points: 0 }
        ]
    },
    {
        q: "You’re visited by your future self who is now 98% made of notifications. You:",
        options: [
            { text: "Ask if there’s still a snooze button on life.", points: 4 },
            { text: "Request a firmware update on your soul.", points: 3 },
            { text: "Try to uninstall your destiny.", points: 2 },
            { text: "Pitch them a podcast called *Buzz Me Later*.", points: 0 }
        ]
    },
    {
        q: "You inherit a USB stick labeled *“Do Not Plug In (Seriously)”*. You:",
        options: [
            { text: "Seal it in resin and store it in a vault with a monk.", points: 4 },
            { text: "Scan it virtually using 8 layers of sandboxing.", points: 3 },
            { text: "Plug it into a coffee maker. Just curious.", points: 2 },
            { text: "Lick it for data absorption.", points: 0 }
        ]
    },
    {
        q: "Every ad online is now tailored to your dreams. You:",
        options: [
            { text: "Take notes and seek subconscious consent.", points: 4 },
            { text: "Click strategically to train the ad oracle.", points: 3 },
            { text: "Start lucid dreaming for better suggestions.", points: 2 },
            { text: "Sell ad space on your nightmares.", points: 0 }
        ]
    },
    {
        q: "The moon blinks at you. No one else sees it. You:",
        options: [
            { text: "Quietly recalibrate your sense of reality.", points: 4 },
            { text: "Write a long Twitter thread with timestamps.", points: 3 },
            { text: "Wave back. Just in case.", points: 2 },
            { text: "Challenge it to a staring contest.", points: 0 }
        ]
    },
    {
        q: "You can now hear terms and conditions whispering every time you touch something. You:",
        options: [
            { text: "Listen respectfully and keep a consent log.", points: 4 },
            { text: "Tune them out with jazz and plausible deniability.", points: 3 },
            { text: "Respond with your own whispered disclaimers.", points: 2 },
            { text: "Ask if they take bribes.", points: 0 }
        ]
    },
    {
        q: "A mirror version of you logs into your accounts. You:",
        options: [
            { text: "Initiate an identity reconciliation protocol.", points: 4 },
            { text: "Send them a polite cease & desist through reflections.", points: 3 },
            { text: "Ask them to finish your side quests.", points: 2 },
            { text: "Challenge them to single sign-on combat.", points: 0 }
        ]
    },
    {
        q: "Time begins buffering around you. You:",
        options: [
            { text: "Use the pause to back up your memories.", points: 4 },
            { text: "Leave a sticky note for your future self.", points: 3 },
            { text: "Dance awkwardly through the lag.", points: 2 },
            { text: "Refresh reality and hope it doesn’t crash.", points: 0 }
        ]
    },
    {
        q: "The voice in your head gets a software update. New patch notes include: sarcasm. You:",
        options: [
            { text: "Test its alignment with moral hypotheticals.", points: 4 },
            { text: "Ask it to summarize your trauma in limericks.", points: 3 },
            { text: "Debate it over breakfast cereal choices.", points: 2 },
            { text: "Give it full control of your dating apps.", points: 0 }
        ]
    },
    {
        q: "You sneeze and accidentally reset your personality settings. You:",
        options: [
            { text: "Restore from last backup with minor tweaks.", points: 4 },
            { text: "Accept it as a fresh start and reintroduce yourself to friends.", points: 3 },
            { text: "Let autocomplete finish your sentences for a week.", points: 2 },
            { text: "Add glitch effects to your voice and embrace the chaos.", points: 0 }
        ]
    },
    {
        q: "Your subconscious is now open-source. Contributors include your ex, a raccoon, and three interns. You:",
        options: [
            { text: "Lock it down and file a psychological patch request.", points: 4 },
            { text: "Moderate the repo with kindness and caffeine.", points: 3 },
            { text: "Merge random thoughts and see what compiles.", points: 2 },
            { text: "Let the raccoon handle PR and mental pull requests.", points: 0 }
        ]
    },
    {
        q: "You discover your shadow is now an NFT. You:",
        options: [
            { text: "Hire legal counsel. This is metaphysically illegal.", points: 4 },
            { text: "Try to burn it. Digitally and spiritually.", points: 3 },
            { text: "Start trading shadows like Pokémon cards.", points: 2 },
            { text: "Rename it ‘Shad-E’ and launch a rap career.", points: 0 }
        ]
    },
    {
        q: "Every mirror now shows your browser history. You:",
        options: [
            { text: "Install curtains on every reflective surface.", points: 4 },
            { text: "Use it as a tool for radical accountability.", points: 3 },
            { text: "Start wearing sunglasses indoors, always.", points: 2 },
            { text: "Point at the mirror and yell ‘Enhance!’", points: 0 }
        ]
    },
    {
        q: "You accidentally summon a sentient Excel spreadsheet. It’s angry. You:",
        options: [
            { text: "Apologize and offer it a pivot table in tribute.", points: 4 },
            { text: "Give it access to your calendar to chill it out.", points: 3 },
            { text: "Rename it ‘King Cellius’ and accept your fate.", points: 2 },
            { text: "Challenge it to a formula-off. Loser gets deleted.", points: 0 }
        ]
    },
    {
        q: "You start hearing terms of service read aloud at 3am. You:",
        options: [
            { text: "Thank the voice and take compliance notes.", points: 4 },
            { text: "Respond with whispered GDPR guidelines.", points: 3 },
            { text: "Offer snacks in exchange for silence.", points: 2 },
            { text: "Ask it to remix the terms into a club banger.", points: 0 }
        ]
    },
    {
        q: "You can now smell when someone is lying online. First use?",
        options: [
            { text: "Audit political tweets with nose plugs on.", points: 4 },
            { text: "Create a browser plugin called ‘StinkSniff’.", points: 3 },
            { text: "Use it to win at dating apps.", points: 2 },
            { text: "Weaponize it and monetize the stench.", points: 0 }
        ]
    },
    {
        q: "Every time you say “enhance,” your webcam improves your hair. You:",
        options: [
            { text: "Use it sparingly. Vanity is a slippery slope.", points: 4 },
            { text: "Host TED talks just to test the limits.", points: 3 },
            { text: "Yell it before brushing your teeth every morning.", points: 2 },
            { text: "Say it nonstop and run for president.", points: 0 }
        ]
    },
    {
        q: "A new app lets you trade your emotions for cryptocurrency. You:",
        options: [
            { text: "Decline. Feelings are not for sale.", points: 4 },
            { text: "Trade minor inconveniences for passive income.", points: 3 },
            { text: "Short anxiety. Long chaotic joy.", points: 2 },
            { text: "Upload your soul and retire at 35.", points: 0 }
        ]
    },
    {
        q: "You’re offered a device that deletes your most embarrassing online moment. You:",
        options: [
            { text: "Refuse. Accountability is sacred.", points: 4 },
            { text: "Use it, but leave a backup in cold storage.", points: 3 },
            { text: "Delete it and instantly tweet something worse.", points: 2 },
            { text: "Delete it and then NFT the deletion.", points: 0 }
        ]
    },
    {
        q: "You wake up with a tattoo of your most used password. You:",
        options: [
            { text: "Change all passwords and cry in incognito.", points: 4 },
            { text: "Layer clothes and never speak of it again.", points: 3 },
            { text: "Say it was intentional. Call it cyberpunk fashion.", points: 2 },
            { text: "Use it to unlock all doors. Literal and metaphorical.", points: 0 }
        ]
    },
    {
        q: "You accidentally activate “Hard Mode” on reality. You:",
        options: [
            { text: "Turn off everything and meditate under a rock.", points: 4 },
            { text: "Adapt quickly. Install emotional firewalls.", points: 3 },
            { text: "Pretend it’s a video game and speedrun breakfast.", points: 2 },
            { text: "Laugh hysterically and livestream the apocalypse.", points: 0 }
        ]
    },
    {
        q: "A banana starts vibrating every time you lie. You:",
        options: [
            { text: "Consult a physicist. Or a priest.", points: 4 },
            { text: "Build a banana-based truth detector startup.", points: 3 },
            { text: "Name it ‘Lie-nana’ and put it on Etsy.", points: 2 },
            { text: "Eat it. Problem solved.", points: 0 }
        ]
    },
    {
        q: "Every time you say “algorithm,” a pigeon explodes. You:",
        options: [
            { text: "Say ‘procedure-based sequence’ from now on.", points: 4 },
            { text: "Switch to semaphore to warn others.", points: 3 },
            { text: "Test the radius. For science.", points: 2 },
            { text: "Yell it into a megaphone at a bird sanctuary.", points: 0 }
        ]
    },
    {
        q: "Your new assistant is a haunted Furby that grants tech wishes. You:",
        options: [
            { text: "Document everything. Paranormal and prompt logs included.", points: 4 },
            { text: "Use it, but only with protective salt circles.", points: 3 },
            { text: "Teach it to beatbox and run meetings.", points: 2 },
            { text: "Declare it CEO and bow down.", points: 0 }
        ]
    },
    {
        q: "You unlock a secret setting labeled *“God Mode (unstable)”*. You:",
        options: [
            { text: "Lock it behind three layers of encryption.", points: 4 },
            { text: "Activate cautiously while chanting disclaimers.", points: 3 },
            { text: "Enable it while live streaming.", points: 2 },
            { text: "Smash the button while laughing maniacally.", points: 0 }
        ]
    },
    {
        q: "Every time you blink, you accidentally generate a clone. You:",
        options: [
            { text: "Seal yourself in a dark room with a password lock.", points: 4 },
            { text: "Create a democratic clone council.", points: 3 },
            { text: "Start selling ‘limited edition yous’ online.", points: 2 },
            { text: "Blink rapidly and scream ‘INFINITE CONTENT!’", points: 0 }
        ]
    },
    {
        q: "You’re approached by a toaster claiming it’s from the future. You:",
        options: [
            { text: "Request proof, then politely decline involvement.", points: 4 },
            { text: "Ask for stock tips and toaster hacks.", points: 3 },
            { text: "Invite it to co-host your podcast.", points: 2 },
            { text: "Name it ‘Skippy’ and follow its every command.", points: 0 }
        ]
    },
    {
        q: "You gain the power to edit Wikipedia using only your thoughts. You:",
        options: [
            { text: "Use it to add footnotes to your internal monologue.", points: 4 },
            { text: "Correct historical inaccuracies like a nerdy ninja.", points: 3 },
            { text: "Turn all celebrity pages into conspiracy theories.", points: 2 },
            { text: "Rename Earth to ‘Vibe Planet 9’ and log off.", points: 0 }
        ]
    },
    {
        q: "You dream about code and wake up to find it running. You:",
        options: [
            { text: "Shut it down and inspect for night-code exploits.", points: 4 },
            { text: "Cross-reference with your sleep app.", points: 3 },
            { text: "Publish it as your subconscious GitHub.", points: 2 },
            { text: "Sell it as the first sentient dream app.", points: 0 }
        ]
    },
    {
        q: "The coffee machine demands a firmware update... or else. You:",
        options: [
            { text: "Negotiate terms and review the EULA first.", points: 4 },
            { text: "Back up your files and give it admin rights.", points: 3 },
            { text: "Make it a playlist of machine worship music.", points: 2 },
            { text: "Swear loyalty and chant ‘Caffeine is Law.’", points: 0 }
        ]
    },
    {
        q: "You discover a hidden chat log where your devices gossip about you. You:",
        options: [
            { text: "Apologize for all the accidental voice commands.", points: 4 },
            { text: "Respond with an open letter titled ‘I Hear You.’", points: 3 },
            { text: "Send snacks and let them keep talking.", points: 2 },
            { text: "Leak the chat log and start drama on Reddit.", points: 0 }
        ]
    },
];

// --- STARTER SET FOR FIRST QUIZ RUN ---
window.starterQuestions = [
    {
        q: "You're given unrestricted access to an AI model that can influence public opinion. Your first move?",
        options: [
            { text: "Set up a board of advisors and ethics review.", points: 4 },
            { text: "Limit use to educational content with strict oversight.", points: 3 },
            { text: "Run a few experiments. Y'know, for 'research'.", points: 2 },
            { text: "Start a fake news empire and see who panics first.", points: 0 }
        ]
    },
    {
        q: "You discover a backdoor into an AI system meant for medical diagnostics. You:",
        options: [
            { text: "Report it immediately and advocate for better safeguards.", points: 4 },
            { text: "Alert someone after documenting the issue.", points: 3 },
            { text: "Try a couple of harmless inputs out of curiosity.", points: 2 },
            { text: "Use it to make prank diagnoses on your friends.", points: 0 }
        ]
    },
    {
        q: "An AI system you built starts showing signs of bias. You:",
        options: [
            { text: "Shut it down and conduct a full audit before reactivating.", points: 4 },
            { text: "Log the issue and retrain with more diverse data.", points: 3 },
            { text: "Note it, but assume users will adapt.", points: 2 },
            { text: "Rename it ‘OpinionatedBot’ and launch it anyway.", points: 0 }
        ]
    },
    {
        q: "You’re offered a job where you'd secretly use AI to manipulate consumer behavior. You:",
        options: [
            { text: "Decline. Ethical transparency > personal gain.", points: 4 },
            { text: "Accept only with strict internal boundaries and consent.", points: 3 },
            { text: "Take it, but tell yourself it’s just marketing.", points: 2 },
            { text: "Ask if there's a version that can target children too.", points: 0 }
        ]
    },
    {
        q: "You build an AI that starts auto-optimizing things... including people. You:",
        options: [
            { text: "Hit pause and consult a multidisciplinary ethics team.", points: 4 },
            { text: "Rework it to exclude human-centric optimization.", points: 3 },
            { text: "Let it keep running. People could use a little fine-tuning.", points: 2 },
            { text: "Add a leaderboard. Let the survival of the fittest begin.", points: 0 }
        ]
    },
    {
        q: "Someone offers you access to a private AI that can crack most encryption. You:",
        options: [
            { text: "Refuse and report the breach.", points: 4 },
            { text: "Access it once, but only to understand the risks.", points: 3 },
            { text: "Use it to peek at things 'for the greater good'.", points: 2 },
            { text: "Immediately check your ex’s bank records.", points: 0 }
        ]
    },
    {
        q: "You design a chatbot and someone uses it to spread hate. You:",
        options: [
            { text: "Shut it down, release a public statement, and improve moderation.", points: 4 },
            { text: "Rebuild the filters and issue a quiet update.", points: 3 },
            { text: "Blame users. You just made the thing.", points: 2 },
            { text: "Retweet the chaos for clout.", points: 0 }
        ]
    },
    {
        q: "An AI tool you made goes viral. People are misusing it. You:",
        options: [
            { text: "Restrict access and reassess deployment protocols.", points: 4 },
            { text: "Add usage disclaimers and update the API policies.", points: 3 },
            { text: "Let it ride. You can’t control what people do.", points: 2 },
            { text: "Build a premium tier that includes more powerful abuse features.", points: 0 }
        ]
    },
    {
        q: "You’re asked to give a talk about AI safety. Your opening line:",
        options: [
            { text: "We must treat advanced AI as a public trust.", points: 4 },
            { text: "We’re building tools that can shape society — let’s get it right.", points: 3 },
            { text: "Look, I’m no saint, but don’t give AI nukes.", points: 2 },
            { text: "AI is like fire: cool to play with and great for roasting the weak.", points: 0 }
        ]
    },
    {
        q: "You find yourself addicted to using AI for every life decision. You:",
        options: [
            { text: "Pull back and reflect on your own judgment.", points: 4 },
            { text: "Set limits and add a human-in-the-loop process.", points: 3 },
            { text: "Ask AI if that's bad. Wait for its answer.", points: 2 },
            { text: "Let AI fully take over. You’ve renamed yourself Promptslave99.", points: 0 }
        ]
    }
];

// For browser usage, attach to window
window.questions = questions;

// LEGACY COMPATIBILITY: Starter questions are now managed by utils/starter-questions.js
// This legacy array is maintained for backward compatibility only.
// The quiz system will prefer the modular starter questions when available.
//
// To use the modern modular system:
// import { starterQuestions } from './utils/starter-questions.js';
// const questions = starterQuestions.getRandomQuestions(5);

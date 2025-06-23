// debug-utils.js
// Centralized debugging utilities for AI Trust Tier Quiz

(function() {
    'use strict';
    
    // Debug configuration
    const DEBUG_CONFIG = {
        enabled: window.location.hostname === 'localhost' || 
                window.location.search.includes('debug=true') ||
                window.location.search.includes('dev=true'),
        
        levels: {
            ERROR: 0,
            WARN: 1, 
            INFO: 2,
            DEBUG: 3
        },
        
        currentLevel: window.location.search.includes('verbose=true') ? 3 : 2
    };
    
    // Centralized logging function
    function debugLog(message, level = 'INFO', category = 'GENERAL') {
        if (!DEBUG_CONFIG.enabled) return;
        
        const levelNum = DEBUG_CONFIG.levels[level] || DEBUG_CONFIG.levels.INFO;
        if (levelNum > DEBUG_CONFIG.currentLevel) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const emoji = {
            ERROR: '❌',
            WARN: '⚠️', 
            INFO: 'ℹ️',
            DEBUG: '🔍'
        }[level] || 'ℹ️';
        
        const prefix = `${emoji} [${timestamp}] [${category}]`;
        
        switch (level) {
            case 'ERROR':
                console.error(prefix, message);
                break;
            case 'WARN':
                console.warn(prefix, message);
                break;
            default:
                console.log(prefix, message);
        }
    }
    
    // Specialized logging functions
    const logger = {
        // Microgame-specific logging
        microgame: {
            load: (gameName) => debugLog(`Loading microgame: ${gameName}`, 'INFO', 'MICROGAME'),
            complete: (gameName, score) => debugLog(`Microgame completed: ${gameName} → ${score}`, 'INFO', 'MICROGAME'),
            error: (gameName, error) => debugLog(`Microgame error in ${gameName}: ${error}`, 'ERROR', 'MICROGAME'),
            timeout: (gameName) => debugLog(`Microgame timeout: ${gameName}`, 'WARN', 'MICROGAME')
        },
        
        // Quiz flow logging
        quiz: {
            start: () => debugLog('Quiz started', 'INFO', 'QUIZ'),
            question: (num, total) => debugLog(`Question ${num}/${total} displayed`, 'DEBUG', 'QUIZ'),
            answer: (question, choice) => debugLog(`Answer selected: ${choice}`, 'DEBUG', 'QUIZ'),
            complete: (tier) => debugLog(`Quiz completed with tier: ${tier}`, 'INFO', 'QUIZ')
        },
        
        // System logging
        system: {
            load: (component) => debugLog(`Component loaded: ${component}`, 'DEBUG', 'SYSTEM'),
            error: (component, error) => debugLog(`System error in ${component}: ${error}`, 'ERROR', 'SYSTEM'),
            performance: (operation, duration) => debugLog(`Performance: ${operation} took ${duration}ms`, 'DEBUG', 'PERF')
        },
        
        // General purpose logging
        info: (message) => debugLog(message, 'INFO'),
        warn: (message) => debugLog(message, 'WARN'),
        error: (message) => debugLog(message, 'ERROR'),
        debug: (message) => debugLog(message, 'DEBUG')
    };
    
    // Error handling utilities
    function handleError(error, context = 'Unknown', userMessage = null) {
        logger.system.error(context, error.message || error);
        
        // Show user-friendly error if needed
        if (userMessage) {
            showUserError(userMessage, context);
        }
        
        // Log detailed error for debugging
        if (DEBUG_CONFIG.enabled) {
            console.error('Detailed error info:', error);
        }
    }
    
    function showUserError(message, context) {
        // Only show user errors for critical issues
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
            border-radius: 8px;
            padding: 15px 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 10000;
            max-width: 300px;
            font-size: 14px;
        `;
        
        errorDiv.innerHTML = `
            <strong>Notice:</strong><br>
            ${message}<br>
            <small style="color: #666;">Context: ${context}</small>
            <button onclick="this.parentElement.remove()" 
                    style="float: right; margin-top: 5px; background: none; border: none; cursor: pointer;">✕</button>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 10000);
    }    // Performance monitoring with fallback for older browsers
    const performanceMonitor = {
        timers: new Map(),
        
        // Get high resolution timestamp with fallback
        now: () => {
            if (window.performance && window.performance.now) {
                return window.performance.now();
            }
            return Date.now();
        },
        
        start: (operation) => {
            performanceMonitor.timers.set(operation, performanceMonitor.now());
            logger.debug(`Started timing: ${operation}`);
        },
        
        end: (operation) => {
            const startTime = performanceMonitor.timers.get(operation);
            if (startTime) {
                const duration = Math.round(performanceMonitor.now() - startTime);
                logger.system.performance(operation, duration);
                performanceMonitor.timers.delete(operation);
                return duration;
            }
            return null;
        }
    };
      // Expose utilities globally
    window.DebugUtils = {
        logger,
        handleError,
        performance: performanceMonitor,
        isDebugMode: () => DEBUG_CONFIG.enabled,
        setDebugLevel: (level) => {
            DEBUG_CONFIG.currentLevel = DEBUG_CONFIG.levels[level] || DEBUG_CONFIG.currentLevel;
        }
    };
    
    // Log debug system initialization
    if (DEBUG_CONFIG.enabled) {
        logger.system.load('Debug utilities initialized');
        logger.info(`Debug mode active (level: ${Object.keys(DEBUG_CONFIG.levels)[DEBUG_CONFIG.currentLevel]})`);
    }
    
})();

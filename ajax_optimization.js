// AJAX OPTIMIZATION MODULE FOR ATTACQ PROTOTYPES v4.2
// Comprehensive performance optimizations to reduce jankiness

(function() {
    'use strict';

    // Performance monitoring
    const PerformanceMonitor = {
        loadTimes: new Map(),
        cacheHits: new Map(),
        
        startTimer: function(operation) {
            this.loadTimes.set(operation, performance.now());
        },
        
        endTimer: function(operation) {
            const startTime = this.loadTimes.get(operation);
            if (startTime) {
                const duration = performance.now() - startTime;
                console.log(`⚡ ${operation} completed in ${duration.toFixed(2)}ms`);
                this.loadTimes.delete(operation);
                return duration;
            }
        },
        
        recordCacheHit: function(resource) {
            const hits = this.cacheHits.get(resource) || 0;
            this.cacheHits.set(resource, hits + 1);
            console.log(`💾 Cache hit for ${resource} (${hits + 1} times)`);
        }
    };

    // Smart Caching System
    const SmartCache = {
        htmlCache: new Map(),
        scriptCache: new Map(),
        styleCache: new Map(),
        preloadQueue: [],
        
        // Cache with TTL and versioning
        set: function(key, value, type = 'html', ttl = 300000) { // 5 min default
            const cache = this.getCache(type);
            cache.set(key, {
                data: value,
                timestamp: Date.now(),
                ttl: ttl,
                version: this.getVersion(key)
            });
        },
        
        get: function(key, type = 'html') {
            const cache = this.getCache(type);
            const entry = cache.get(key);
            
            if (!entry) return null;
            
            // Check if expired
            if (Date.now() - entry.timestamp > entry.ttl) {
                cache.delete(key);
                return null;
            }
            
            PerformanceMonitor.recordCacheHit(key);
            return entry.data;
        },
        
        getCache: function(type) {
            switch(type) {
                case 'script': return this.scriptCache;
                case 'style': return this.styleCache;
                default: return this.htmlCache;
            }
        },
        
        getVersion: function(key) {
            // Extract version from cache-busting parameter
            const match = key.match(/[?&]v=([^&]*)/);
            return match ? match[1] : Date.now().toString();
        },
        
        // Preload resources intelligently
        preload: function(resources) {
            resources.forEach(resource => {
                if (!this.get(resource.url, resource.type)) {
                    this.preloadQueue.push(resource);
                }
            });
            
            this.processPreloadQueue();
        },
        
        processPreloadQueue: function() {
            if (this.preloadQueue.length === 0) return;
            
            const resource = this.preloadQueue.shift();
            
            // Use requestIdleCallback for background loading
            const processNext = () => {
                if (this.preloadQueue.length > 0) {
                    requestIdleCallback(() => this.processPreloadQueue());
                }
            };
            
            this.fetchOptimized(resource.url, resource.type)
                .then(() => processNext())
                .catch(() => processNext());
        },
        
        fetchOptimized: async function(url, type = 'html') {
            PerformanceMonitor.startTimer(`fetch-${url}`);
            
            try {
                const response = await fetch(url, {
                    cache: 'force-cache', // Use browser cache when possible
                    credentials: 'same-origin'
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.text();
                this.set(url, data, type);
                
                PerformanceMonitor.endTimer(`fetch-${url}`);
                return data;
                
            } catch (error) {
                PerformanceMonitor.endTimer(`fetch-${url}`);
                console.error(`Failed to fetch ${url}:`, error);
                throw error;
            }
        }
    };

    // Optimized Microgame Loader
    const OptimizedMicrogameLoader = {
        loadingPromises: new Map(),
        
        // Prevent duplicate loads
        loadMicrogame: async function(microgameId, nextQuestionFunction) {
            // Check if already loading
            if (this.loadingPromises.has(microgameId)) {
                console.log(`⚡ Reusing existing load promise for ${microgameId}`);
                return this.loadingPromises.get(microgameId);
            }
            
            const loadPromise = this.loadMicrogameCore(microgameId, nextQuestionFunction);
            this.loadingPromises.set(microgameId, loadPromise);
            
            // Clean up promise when done
            loadPromise.finally(() => {
                this.loadingPromises.delete(microgameId);
            });
            
            return loadPromise;
        },
        
        loadMicrogameCore: async function(microgameId, nextQuestionFunction) {
            PerformanceMonitor.startTimer(`microgame-${microgameId}`);
            
            const game = this.findGame(microgameId);
            if (!game) {
                console.error(`Game not found: ${microgameId}`);
                if (nextQuestionFunction) nextQuestionFunction();
                return;
            }
            
            const gameContainer = document.getElementById('game-container');
            if (!gameContainer) {
                console.error('Game container not found');
                if (nextQuestionFunction) nextQuestionFunction();
                return;
            }
            
            try {
                // Get optimized file path
                const filePath = this.getMicrogamePath(game.file);
                
                // Try cache first
                let html = SmartCache.get(filePath);
                
                if (!html) {
                    // Add intelligent cache-busting
                    const cacheBustedPath = this.addCacheBusting(filePath);
                    html = await SmartCache.fetchOptimized(cacheBustedPath);
                }
                
                // Parse and setup microgame with optimizations
                await this.setupMicrogame(html, game, gameContainer, nextQuestionFunction);
                
                PerformanceMonitor.endTimer(`microgame-${microgameId}`);
                
            } catch (error) {
                console.error(`Error loading microgame ${microgameId}:`, error);
                this.showErrorFallback(gameContainer, error);
                if (nextQuestionFunction) nextQuestionFunction();
            }
        },
        
        setupMicrogame: async function(html, game, gameContainer, nextQuestionFunction) {
            // Use DocumentFragment for efficient DOM manipulation
            const fragment = document.createDocumentFragment();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // Extract and cache components separately
            const scripts = Array.from(tempDiv.querySelectorAll('script'));
            const styles = Array.from(tempDiv.querySelectorAll('style'));
            
            // Remove scripts to prevent conflicts
            scripts.forEach(script => script.remove());
            
            // Create optimized container
            const wrapper = this.createOptimizedWrapper(tempDiv.innerHTML);
            fragment.appendChild(wrapper);
            
            // Batch DOM updates
            this.batchDOMUpdate(() => {
                gameContainer.innerHTML = '';
                gameContainer.appendChild(fragment);
                gameContainer.style.display = 'block';
            });
            
            // Apply styles efficiently
            this.applyStylesOptimized(styles, game.id);
            
            // Setup game logic with debouncing
            this.setupGameLogicOptimized(wrapper, game, nextQuestionFunction);
        },
        
        createOptimizedWrapper: function(innerHTML) {
            const wrapper = document.createElement('div');
            wrapper.className = 'microgame-optimized';
            wrapper.style.cssText = `
                contain: layout style paint;
                will-change: transform;
                transform: translateZ(0);
                position: relative;
                isolation: isolate;
            `;
            wrapper.innerHTML = innerHTML;
            return wrapper;
        },
        
        batchDOMUpdate: function(updateFunction) {
            // Use requestAnimationFrame for smooth updates
            requestAnimationFrame(() => {
                updateFunction();
            });
        },
        
        applyStylesOptimized: function(styles, gameId) {
            // Check if styles already applied
            if (document.querySelector(`style[data-optimized-game="${gameId}"]`)) {
                return;
            }
            
            const styleElement = document.createElement('style');
            styleElement.setAttribute('data-optimized-game', gameId);
            
            let combinedCSS = '';
            styles.forEach(style => {
                // Scope CSS to prevent conflicts
                let scopedCSS = this.scopeCSS(style.textContent, gameId);
                combinedCSS += scopedCSS + '\n';
            });
            
            // Add performance optimizations
            combinedCSS += this.getOptimizedCSS();
            
            styleElement.textContent = combinedCSS;
            document.head.appendChild(styleElement);
        },
        
        scopeCSS: function(css, gameId) {
            return css.replace(
                /([^{}@]+){/g,
                (match, selector) => {
                    if (selector.includes('@')) return match;
                    const cleanSelector = selector.trim();
                    return `.microgame-optimized ${cleanSelector} {`;
                }
            );
        },
        
        getOptimizedCSS: function() {
            return `
                .microgame-optimized {
                    transform: translateZ(0);
                    backface-visibility: hidden;
                    perspective: 1000px;
                }
                .microgame-optimized button {
                    transform: translateZ(0);
                    will-change: transform;
                    touch-action: manipulation;
                    user-select: none;
                    pointer-events: auto !important;
                    cursor: pointer !important;
                }
                .microgame-optimized button:hover {
                    transform: translateZ(0) scale(1.02);
                    transition: transform 0.1s ease;
                }
            `;
        },
        
        setupGameLogicOptimized: function(wrapper, game, nextQuestionFunction) {
            let gameCompleted = false;
            let gameTimer = null;
            
            // Debounced completion handler
            const completeGame = this.debounce((tier) => {
                if (gameCompleted) return;
                gameCompleted = true;
                
                if (gameTimer) clearTimeout(gameTimer);
                
                // Clean up with animation
                this.cleanupGameOptimized(wrapper, game.id);
                
                if (nextQuestionFunction) {
                    // Delay callback to ensure smooth cleanup
                    setTimeout(nextQuestionFunction, 100);
                }
            }, 100);
            
            // Setup button interactions with optimizations
            this.setupButtonInteractions(wrapper, completeGame);
            
            // Setup timeout with warning system
            if (game.timeLimit) {
                this.setupTimeoutOptimized(game, completeGame);
            }
            
            // Expose optimized completion function
            window.submitMicrogameScore = completeGame;
        },
        
        setupButtonInteractions: function(wrapper, completeGame) {
            const buttons = wrapper.querySelectorAll('button');
            
            buttons.forEach((button, index) => {
                // Use passive listeners for better performance
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Add visual feedback
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = '';
                    }, 100);
                    
                    // Default scoring logic
                    const tier = this.calculateTier(index, buttons.length);
                    completeGame(tier);
                }, { passive: false });
            });
        },
        
        setupTimeoutOptimized: function(game, completeGame) {
            // Warning system before timeout
            const warningTime = Math.max(2000, game.timeLimit * 0.8);
            
            setTimeout(() => {
                this.showTimeoutWarning();
            }, warningTime);
            
            setTimeout(() => {
                completeGame('baby'); // Default timeout score
            }, game.timeLimit);
        },
        
        showTimeoutWarning: function() {
            // Create subtle warning indicator
            const warning = document.createElement('div');
            warning.className = 'timeout-warning';
            warning.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 165, 0, 0.9);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 10000;
                animation: pulse 1s infinite;
            `;
            warning.textContent = 'Time running out!';
            
            document.body.appendChild(warning);
            
            setTimeout(() => {
                if (warning.parentNode) {
                    warning.remove();
                }
            }, 3000);
        },
        
        cleanupGameOptimized: function(wrapper, gameId) {
            // Animated cleanup
            wrapper.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            wrapper.style.opacity = '0';
            wrapper.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                const container = document.getElementById('game-container');
                if (container) {
                    container.innerHTML = '';
                    container.style.display = 'none';
                }
                
                // Clean up styles
                const styles = document.querySelectorAll(`style[data-optimized-game="${gameId}"]`);
                styles.forEach(style => style.remove());
            }, 300);
        },
        
        calculateTier: function(buttonIndex, totalButtons) {
            // Intelligent tier calculation
            const tiers = ['baby', 'tinkerer', 'scholar', 'saint'];
            const tierIndex = Math.min(buttonIndex, tiers.length - 1);
            return tiers[tierIndex];
        },
        
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        findGame: function(microgameId) {
            const registries = [
                window.Microgames,
                window.microgameRegistry,
                typeof Microgames !== 'undefined' ? Microgames : null
            ];
            
            for (const registry of registries) {
                if (Array.isArray(registry)) {
                    const game = registry.find(g => g && g.id === microgameId);
                    if (game) return game;
                }
            }
            
            return null;
        },
        
        getMicrogamePath: function(filename) {
            if (typeof getMicrogamePath === 'function') {
                return getMicrogamePath(filename);
            }
            return 'microgames/' + filename;
        },
        
        addCacheBusting: function(path) {
            // Intelligent cache busting - only when needed
            const separator = path.includes('?') ? '&' : '?';
            return path + separator + 'v=' + Date.now();
        },
        
        showErrorFallback: function(container, error) {
            container.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    font-family: sans-serif;
                ">
                    <h3>⚠️ Microgame Load Error</h3>
                    <p>Failed to load microgame. Continuing...</p>
                    <small>${error.message}</small>
                </div>
            `;
            
            setTimeout(() => {
                container.innerHTML = '';
                container.style.display = 'none';
            }, 3000);
        },

        // Integration with the new microgame debug system
        integrateWithDebugSystem: function() {
            if (window.MicrogameDebugger) {
                console.log('⚡ AJAX Optimization integrating with Debug System');
                
                // Override debug logging to include performance metrics
                const originalLog = window.MicrogameDebugger.log;
                window.MicrogameDebugger.log = function(category, message, data) {
                    // Call original logger
                    originalLog.call(this, category, message, data);
                    
                    // Add performance tracking for microgame operations
                    if (category.includes('MICROGAME') && message.includes('completed')) {
                        PerformanceMonitor.recordCacheHit('microgame_completion');
                    }
                };
                
                // Add microgame-specific optimizations
                window.MicrogameFixer.enhancedTimeout = function(callback, delay, gameName) {
                    PerformanceMonitor.startTimer(`timeout_${gameName}`);
                    
                    const timeoutId = setTimeout(() => {
                        PerformanceMonitor.endTimer(`timeout_${gameName}`);
                        callback();
                    }, delay);
                    
                    return timeoutId;
                };
            }
        },

    };

    // Resource Preloader
    const ResourcePreloader = {
        init: function() {
            // Preload common microgames on idle
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    this.preloadCriticalResources();
                });
            } else {
                setTimeout(() => this.preloadCriticalResources(), 1000);
            }
        },
        
        preloadCriticalResources: function() {
            if (!window.Microgames || !Array.isArray(window.Microgames)) return;
            
            // Preload first 3 microgames
            const criticalGames = window.Microgames.slice(0, 3);
            const resources = criticalGames.map(game => ({
                url: OptimizedMicrogameLoader.getMicrogamePath(game.file),
                type: 'html'
            }));
            
            SmartCache.preload(resources);
        }
    };

    // Connection Quality Detection
    const ConnectionMonitor = {
        quality: 'good', // good, fair, poor
        
        init: function() {
            if ('connection' in navigator) {
                this.updateQuality();
                navigator.connection.addEventListener('change', () => {
                    this.updateQuality();
                });
            }
        },
        
        updateQuality: function() {
            const connection = navigator.connection;
            const effectiveType = connection.effectiveType;
            
            if (effectiveType === '4g') {
                this.quality = 'good';
            } else if (effectiveType === '3g') {
                this.quality = 'fair';
            } else {
                this.quality = 'poor';
            }
            
            console.log(`📶 Connection quality: ${this.quality}`);
            this.adjustOptimizations();
        },
        
        adjustOptimizations: function() {
            switch(this.quality) {
                case 'poor':
                    // Reduce preloading, increase cache times
                    SmartCache.preloadQueue = [];
                    break;
                case 'fair':
                    // Moderate optimizations
                    break;
                case 'good':
                    // Full optimizations
                    ResourcePreloader.preloadCriticalResources();
                    break;
            }
        }
    };

    // Export optimized functions
    window.AjaxOptimization = {
        SmartCache,
        OptimizedMicrogameLoader,
        PerformanceMonitor,
        ResourcePreloader,
        ConnectionMonitor
    };

    // Replace existing microgame loader
    window.loadMicrogameOptimized = OptimizedMicrogameLoader.loadMicrogame.bind(OptimizedMicrogameLoader);

    // Initialize optimizations
    document.addEventListener('DOMContentLoaded', () => {
        console.log('⚡ AJAX Optimization Module initialized');
        ResourcePreloader.init();
        ConnectionMonitor.init();
    });

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .microgame-optimized {
            animation: fadeInUp 0.3s ease;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

})();

// 🎮 Options Page JavaScript - EXTERNAL FILE
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Options page loaded');
    
    // Load saved settings
    loadSettings();
    
    // Event listeners for all toggles and controls
    setupEventListeners();
});

function loadSettings() {
    chrome.storage.sync.get([
        'soundEnabled',
        'scanlinesEnabled', 
        'animationSpeed',
        'confidenceThreshold',
        'leaguesPriority',
        'realTimeEnabled',
        'cacheTimeout',
        'debugMode'
    ], function(result) {
        console.log('📊 Loaded settings:', result);
        
        // Apply loaded settings to UI
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.classList.toggle('active', result.soundEnabled || false);
        }
        
        const scanlinesToggle = document.getElementById('scanlinesToggle');
        if (scanlinesToggle) {
            scanlinesToggle.classList.toggle('active', result.scanlinesEnabled !== false);
        }
        
        const animationSpeed = document.getElementById('animationSpeed');
        if (animationSpeed) {
            animationSpeed.value = result.animationSpeed || 'normal';
        }
        
        const confidenceThreshold = document.getElementById('confidenceThreshold');
        if (confidenceThreshold) {
            confidenceThreshold.value = result.confidenceThreshold || '50';
        }
        
        const leaguesPriority = document.getElementById('leaguesPriority');
        if (leaguesPriority) {
            leaguesPriority.value = result.leaguesPriority || 'all';
        }
        
        const realTimeToggle = document.getElementById('realTimeToggle');
        if (realTimeToggle) {
            realTimeToggle.classList.toggle('active', result.realTimeEnabled !== false);
        }
        
        const cacheTimeout = document.getElementById('cacheTimeout');
        if (cacheTimeout) {
            cacheTimeout.value = result.cacheTimeout || '300';
        }
        
        const debugToggle = document.getElementById('debugToggle');
        if (debugToggle) {
            debugToggle.classList.toggle('active', result.debugMode || false);
        }
    });
    
    // Load statistics
    loadPlayerStats();
}

function setupEventListeners() {
    // Toggle switches
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', function() {
            toggleSetting('soundEnabled', this);
        });
    }
    
    const scanlinesToggle = document.getElementById('scanlinesToggle');
    if (scanlinesToggle) {
        scanlinesToggle.addEventListener('click', function() {
            toggleSetting('scanlinesEnabled', this);
        });
    }
    
    const realTimeToggle = document.getElementById('realTimeToggle');
    if (realTimeToggle) {
        realTimeToggle.addEventListener('click', function() {
            toggleSetting('realTimeEnabled', this);
        });
    }
    
    const debugToggle = document.getElementById('debugToggle');
    if (debugToggle) {
        debugToggle.addEventListener('click', function() {
            toggleSetting('debugMode', this);
        });
    }
    
    // Select dropdowns
    const animationSpeed = document.getElementById('animationSpeed');
    if (animationSpeed) {
        animationSpeed.addEventListener('change', function() {
            saveSetting('animationSpeed', this.value);
        });
    }
    
    const confidenceThreshold = document.getElementById('confidenceThreshold');
    if (confidenceThreshold) {
        confidenceThreshold.addEventListener('change', function() {
            saveSetting('confidenceThreshold', this.value);
        });
    }
    
    const leaguesPriority = document.getElementById('leaguesPriority');
    if (leaguesPriority) {
        leaguesPriority.addEventListener('change', function() {
            saveSetting('leaguesPriority', this.value);
        });
    }
    
    const cacheTimeout = document.getElementById('cacheTimeout');
    if (cacheTimeout) {
        cacheTimeout.addEventListener('change', function() {
            saveSetting('cacheTimeout', this.value);
        });
    }
    
    // Buttons
    const connectAccount = document.getElementById('connectAccount');
    if (connectAccount) {
        connectAccount.addEventListener('click', function() {
            chrome.tabs.create({url: 'https://bet-studio.com/accedi/?source=extension'});
        });
    }
    
    const clearCache = document.getElementById('clearCache');
    if (clearCache) {
        clearCache.addEventListener('click', function() {
            chrome.storage.local.clear(function() {
                showNotification('Cache cleared successfully!');
            });
        });
    }
    
    const exportSettings = document.getElementById('exportSettings');
    if (exportSettings) {
        exportSettings.addEventListener('click', exportSettingsFunction);
    }
    
    const resetSettings = document.getElementById('resetSettings');
    if (resetSettings) {
        resetSettings.addEventListener('click', resetSettingsFunction);
    }
}

function toggleSetting(settingName, element) {
    element.classList.toggle('active');
    const isActive = element.classList.contains('active');
    saveSetting(settingName, isActive);
    console.log(`🔄 ${settingName} set to:`, isActive);
}

function saveSetting(key, value) {
    const setting = {};
    setting[key] = value;
    chrome.storage.sync.set(setting, function() {
        console.log(`💾 Saved ${key}:`, value);
    });
}

function loadPlayerStats() {
    chrome.storage.sync.get([
        'totalPredictions',
        'accuracyRate', 
        'currentStreak',
        'bestStreak'
    ], function(result) {
        const totalPredictions = document.getElementById('totalPredictions');
        if (totalPredictions) {
            totalPredictions.textContent = result.totalPredictions || '0';
        }
        
        const accuracyRate = document.getElementById('accuracyRate');
        if (accuracyRate) {
            accuracyRate.textContent = (result.accuracyRate || '0') + '%';
        }
        
        const currentStreak = document.getElementById('currentStreak');
        if (currentStreak) {
            currentStreak.textContent = result.currentStreak || '0';
        }
        
        const bestStreak = document.getElementById('bestStreak');
        if (bestStreak) {
            bestStreak.textContent = result.bestStreak || '0';
        }
    });
}

function exportSettingsFunction() {
    chrome.storage.sync.get(null, function(settings) {
        const blob = new Blob([JSON.stringify(settings, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bet-studio-settings.json';
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Settings exported!');
    });
}

function resetSettingsFunction() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        chrome.storage.sync.clear(function() {
            showNotification('Settings reset successfully!');
            setTimeout(() => {
                location.reload();
            }, 1500);
        });
    }
}

function showNotification(message) {
    // Simple notification system
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--neon);
        color: #000;
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: bold;
        z-index: 1000;
        font-size: 12px;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

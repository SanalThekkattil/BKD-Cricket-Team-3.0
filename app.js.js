// BKD Cricket Team Application with Tossing Feature
class BKDCricketApp {
    constructor() {
        this.permanentPlayers = [];
        this.guestPlayers = [];
        this.teams = {
            teamA: [],
            teamB: [],
            generated: false
        };
        this.tossResult = {
            conducted: false,
            winner: null,
            decision: null, // 'bat' or 'bowl'
            loser: null
        };
        this.isAdminMode = false;
        this.editingPlayerId = null;
        this.editingPlayerType = null; // 'permanent' or 'guest'

        // Initialize with sample data
        this.initializeSampleData();

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing BKD Cricket App...');
        // Show main screen
        this.showScreen('main-screen');
        // Bind all events
        this.bindEvents();
        // Load initial section after a short delay
        setTimeout(() => {
            this.switchSection('players');
        }, 200);
    }

    initializeSampleData() {
        // All players start as UNAVAILABLE by default
        this.permanentPlayers = [
            {"id": 1, "name": "Sanal", "role": "Allrounder", "ranking": 90, "isAvailable": false, "type": "permanent"},
            {"id": 2, "name": "Gokul", "role": "Allrounder", "ranking": 90, "isAvailable": false, "type": "permanent"},
            {"id": 3, "name": "Sudheer", "role": "Allrounder", "ranking": 90, "isAvailable": false, "type": "permanent"},
            {"id": 4, "name": "Vijesh Kuttan", "role": "Allrounder", "ranking": 90, "isAvailable": false, "type": "permanent"},
            {"id": 5, "name": "Danush", "role": "Allrounder", "ranking": 89, "isAvailable": false, "type": "permanent"},
            {"id": 6, "name": "Arjun", "role": "Allrounder", "ranking": 70, "isAvailable": false, "type": "permanent"},
            {"id": 7, "name": "Pradheesh", "role": "Batter", "ranking": 70, "isAvailable": false, "type": "permanent"},
            {"id": 8, "name": "Saurav Appu", "role": "Allrounder", "ranking": 68, "isAvailable": false, "type": "permanent"},
            {"id": 9, "name": "Divekan", "role": "Allrounder", "ranking": 85, "isAvailable": false, "type": "permanent"},
            {"id": 10, "name": "Hari", "role": "Allrounder", "ranking": 90, "isAvailable": false, "type": "permanent"},
            {"id": 11, "name": "Jayan", "role": "Allrounder", "ranking": 88, "isAvailable": false, "type": "permanent"},
            {"id": 12, "name": "Manikuttan", "role": "Allrounder", "ranking": 70, "isAvailable": false, "type": "permanent"},
            {"id": 13, "name": "Muthu", "role": "Allrounder", "ranking": 85, "isAvailable": false, "type": "permanent"},
            {"id": 14, "name": "Nandu", "role": "Allrounder", "ranking": 65, "isAvailable": false, "type": "permanent"},
            {"id": 15, "name": "Akhil", "role": "Batter", "ranking": 50, "isAvailable": false, "type": "permanent"},
            {"id": 16, "name": "Prajith", "role": "Batter", "ranking": 89, "isAvailable": false, "type": "permanent"},
            {"id": 17, "name": "Pranav", "role": "Batter", "ranking": 60, "isAvailable": false, "type": "permanent"},
            {"id": 19, "name": "Rijith", "role": "Allrounder", "ranking": 85, "isAvailable": false, "type": "permanent"},
            {"id": 20, "name": "Subhi", "role": "Allrounder", "ranking": 65, "isAvailable": false, "type": "permanent"},
            {"id": 21, "name": "Sumesh", "role": "Allrounder", "ranking": 50, "isAvailable": false, "type": "permanent"},
            {"id": 22, "name": "Unnikuttan", "role": "Bowler", "ranking": 70, "isAvailable": false, "type": "permanent"},
            {"id": 23, "name": "Suresh", "role": "Batter", "ranking": 76, "isAvailable": false, "type": "permanent"},
            {"id": 24, "name": "Nasar", "role": "Bowler", "ranking": 70, "isAvailable": false, "type": "permanent"},
            {"id": 25, "name": "Santhosh Babu", "role": "Allrounder", "ranking": 85, "isAvailable": false, "type": "permanent"},
            {"id": 26, "name": "Kannan Thekkecity", "role": "Allrounder", "ranking": 90, "isAvailable": false, "type": "permanent"},
            {"id": 27, "name": "Unni Thekkecity", "role": "Batter", "ranking": 85, "isAvailable": false, "type": "permanent"},
        ];

        this.adminCredentials = {
            username: "admin",
            password: "admin123"
        };

        this.guestIdCounter = 1000; // Start guest IDs from 1000 to avoid conflicts
    }

    bindEvents() {
        console.log('Binding events...');

        // Navigation buttons - use event delegation on document
        document.addEventListener('click', (e) => {
            // Handle navigation buttons
            if (e.target.classList.contains('nav-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const section = e.target.dataset.section;
                console.log('Navigation clicked:', section);
                if (section) {
                    this.switchSection(section);
                }
                return;
            }

            // Handle admin toggle
            if (e.target.id === 'admin-toggle') {
                e.preventDefault();
                e.stopPropagation();
                console.log('Admin toggle clicked');
                this.toggleAdmin();
                return;
            }

            // Handle other buttons
            if (e.target.id === 'add-guest-btn') {
                e.preventDefault();
                this.openGuestModal();
            } else if (e.target.id === 'add-permanent-player-btn') {
                e.preventDefault();
                this.openPermanentPlayerModal();
            } else if (e.target.id === 'generate-teams-btn') {
                e.preventDefault();
                this.generateTeams();
            } else if (e.target.id === 'regenerate-teams-btn') {
                e.preventDefault();
                this.regenerateTeams();
            } else if (e.target.id === 'conduct-toss-btn') {
                e.preventDefault();
                this.conductToss();
            } else if (e.target.id === 'reset-toss-btn') {
                e.preventDefault();
                this.resetToss();
            }

            // Handle modal close buttons
            if (e.target.id === 'close-admin-login' || e.target.id === 'cancel-admin-login') {
                e.preventDefault();
                this.closeModal('admin-login-modal');
            } else if (e.target.id === 'close-guest-modal' || e.target.id === 'cancel-guest') {
                e.preventDefault();
                this.closeModal('guest-modal');
            } else if (e.target.id === 'close-permanent-modal' || e.target.id === 'cancel-permanent') {
                e.preventDefault();
                this.closeModal('permanent-player-modal');
            }

            // Modal overlay clicks
            if (e.target.classList.contains('modal-overlay')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            }

            // Guest player delete buttons
            if (e.target.classList.contains('delete-guest-btn')) {
                e.preventDefault();
                const guestId = parseInt(e.target.dataset.guestId);
                this.removeGuestPlayer(guestId);
            }

            // Admin panel buttons
            if (e.target.classList.contains('edit-permanent-btn')) {
                e.preventDefault();
                const playerId = parseInt(e.target.dataset.playerId);
                this.editPermanentPlayer(playerId);
            } else if (e.target.classList.contains('delete-permanent-btn')) {
                e.preventDefault();
                const playerId = parseInt(e.target.dataset.playerId);
                this.deletePermanentPlayer(playerId);
            }
        });

        // Handle checkbox changes for player availability
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.dataset.playerId) {
                const playerId = parseInt(e.target.dataset.playerId);
                console.log('Toggle changed for player:', playerId);
                this.togglePlayerAvailability(playerId);
            }
        });

        // Handle form submissions
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            if (e.target.id === 'admin-login-form') {
                this.handleAdminLogin();
            } else if (e.target.id === 'guest-form') {
                this.saveGuestPlayer();
            } else if (e.target.id === 'permanent-player-form') {
                this.savePermanentPlayer();
            }
        });

        console.log('Events bound successfully');
    }

    // Tossing Methods
    conductToss() {
        console.log('Conducting toss...');
        
        if (!this.teams.generated) {
            alert('Please generate teams first!');
            return;
        }

        // Show loading effect
        this.showLoadingOverlay('Conducting toss...');

        // Simulate toss delay
        setTimeout(() => {
            // Random toss result
            const isTeamAWinner = Math.random() < 0.5;
            const decisions = ['bat', 'bowl'];
            const randomDecision = decisions[Math.floor(Math.random() * decisions.length)];

            this.tossResult = {
                conducted: true,
                winner: isTeamAWinner ? 'A' : 'B',
                decision: randomDecision,
                loser: isTeamAWinner ? 'B' : 'A'
            };

            this.hideLoadingOverlay();
            this.renderTeams();
            
            // Show toss result animation
            this.showTossResultNotification();
            
            console.log('Toss result:', this.tossResult);
        }, 2000);
    }

    resetToss() {
        this.tossResult = {
            conducted: false,
            winner: null,
            decision: null,
            loser: null
        };
        this.renderTeams();
        console.log('Toss reset');
    }

    showTossResultNotification() {
        const notification = document.createElement('div');
        notification.className = 'toss-notification';
        notification.innerHTML = `
            <div class="toss-notification-content">
                <h3>🪙 Toss Result</h3>
                <div class="toss-result-details">
                    <p><strong>Team ${this.tossResult.winner}</strong> won the toss!</p>
                    <p>Decision: <strong>${this.tossResult.decision.toUpperCase()} FIRST</strong></p>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 4000);
    }

    // Rest of the existing methods remain the same...
    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.add('hidden');
        });

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            console.log('Showing screen:', screenId);
        } else {
            console.error('Screen not found:', screenId);
        }
    }

    switchSection(sectionId) {
        console.log('... Switching to section:', sectionId);

        // Update navigation - make sure to target the correct buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        const targetBtn = document.querySelector(`[data-section="${sectionId}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
            console.log('Navigation button activated:', sectionId);
        } else {
            console.error('Navigation button not found for:', sectionId);
        }

        // Hide all sections first
        const sections = document.querySelectorAll('.dashboard-section');
        sections.forEach(section => {
            section.classList.add('hidden');
        });

        // Show target section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            console.log('Section shown:', sectionId);

            // Load section data based on which section is active
            switch(sectionId) {
                case 'players':
                    this.renderPlayerSelection();
                    this.updatePlayerStats();
                    break;
                case 'guests':
                    this.renderGuestPlayers();
                    break;
                case 'teams':
                    this.renderTeams();
                    this.updateTeamBalance();
                    break;
                case 'admin':
                    this.renderAdminPanel();
                    break;
                default:
                    console.warn('Unknown section:', sectionId);
            }
        } else {
            console.error('Section not found:', `${sectionId}-section`);
        }
    }

    toggleAdmin() {
        console.log('Toggle admin called, current mode:', this.isAdminMode);
        if (this.isAdminMode) {
            // Logout admin
            this.isAdminMode = false;
            document.body.classList.remove('admin-mode');
            const adminToggle = document.getElementById('admin-toggle');
            if (adminToggle) {
                adminToggle.textContent = 'Admin';
                adminToggle.classList.remove('btn--primary');
                adminToggle.classList.add('btn--outline');
            }
            // Switch back to players section
            this.switchSection('players');
        } else {
            // Show admin login
            this.openModal('admin-login-modal');
        }
    }

    handleAdminLogin() {
        const username = document.getElementById('admin-username').value.trim();
        const password = document.getElementById('admin-password').value;
        const errorDiv = document.getElementById('admin-login-error');

        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }

        console.log('Admin login attempt:', username);

        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
            this.isAdminMode = true;
            document.body.classList.add('admin-mode');
            const adminToggle = document.getElementById('admin-toggle');
            if (adminToggle) {
                adminToggle.textContent = 'Logout';
                adminToggle.classList.remove('btn--outline');
                adminToggle.classList.add('btn--primary');
            }
            this.closeModal('admin-login-modal');
            this.switchSection('admin');
            this.simulateDBSync();
            console.log('Admin login successful');
        } else {
            if (errorDiv) {
                errorDiv.textContent = 'Invalid credentials. Use admin/admin123';
                errorDiv.classList.remove('hidden');
            }
            console.log('Admin login failed');
        }
    }

    // Player Selection Functions
    renderPlayerSelection() {
        console.log('Rendering player selection...');
        const grid = document.getElementById('player-selection-grid');
        if (!grid) {
            console.error('Player selection grid not found');
            return;
        }

        grid.innerHTML = '';

        if (this.permanentPlayers.length === 0) {
            grid.innerHTML = '<div class="loading-message">Loading players...</div>';
            return;
        }

        this.permanentPlayers.forEach(player => {
            const card = document.createElement('div');
            card.className = `player-selection-card ${player.isAvailable ? 'available' : ''}`;
            
            card.innerHTML = `
                <div class="player-info">
                    <div class="player-name">${player.name}</div>
                    <div class="player-meta">
                        <span class="role-badge role-badge--${player.role.toLowerCase()}">${player.role}</span>
                        <span class="ranking-badge ${this.getRankingClass(player.ranking)}">${player.ranking}</span>
                    </div>
                </div>
                <div class="availability-toggle">
                    <input type="checkbox" id="toggle-${player.id}" data-player-id="${player.id}" ${player.isAvailable ? 'checked' : ''}>
                    <label for="toggle-${player.id}" class="slider"></label>
                </div>
            `;
            
            grid.appendChild(card);
        });

        console.log('Player selection rendered');
    }

    updatePlayerStats() {
        const available = this.getAvailablePlayers().length;
        const total = this.permanentPlayers.length;
        const guests = this.guestPlayers.length;

        const availableCountEl = document.getElementById('available-count');
        const totalCountEl = document.getElementById('total-count');
        const guestCountEl = document.getElementById('guest-count');

        if (availableCountEl) availableCountEl.textContent = available;
        if (totalCountEl) totalCountEl.textContent = total;
        if (guestCountEl) guestCountEl.textContent = guests;
    }

    togglePlayerAvailability(playerId) {
        const player = this.permanentPlayers.find(p => p.id === playerId);
        if (player) {
            player.isAvailable = !player.isAvailable;
            console.log(`Player ${player.name} availability: ${player.isAvailable}`);
            
            // Update the card appearance
            this.renderPlayerSelection();
            this.updatePlayerStats();
            
            // If teams are already generated, we should regenerate them
            if (this.teams.generated) {
                console.log('Teams already generated, may need regeneration');
            }
        }
    }

    getRankingClass(ranking) {
        if (ranking >= 80) return 'ranking-badge--high';
        if (ranking >= 60) return 'ranking-badge--medium';
        return 'ranking-badge--low';
    }

    getAvailablePlayers() {
        return [...this.permanentPlayers.filter(p => p.isAvailable), ...this.guestPlayers];
    }

    // Guest Player Functions
    renderGuestPlayers() {
        console.log('Rendering guest players...');
        const container = document.getElementById('guest-players-list');
        if (!container) {
            console.error('Guest players container not found');
            return;
        }

        container.innerHTML = '';

        if (this.guestPlayers.length === 0) {
            container.innerHTML = '<p class="no-guests">No guest players added yet. Click "Add Guest Player" to add temporary players for today\'s match.</p>';
            return;
        }

        this.guestPlayers.forEach(player => {
            const card = document.createElement('div');
            card.className = 'guest-player-card';
            
            card.innerHTML = `
                <div class="guest-player-info">
                    <span class="guest-badge">GUEST</span>
                    <span class="player-name">${player.name}</span>
                    <span class="role-badge role-badge--${player.role.toLowerCase()}">${player.role}</span>
                    <span class="ranking-badge ${this.getRankingClass(player.ranking)}">${player.ranking}</span>
                </div>
                <button class="btn btn--sm btn--outline delete-guest-btn" data-guest-id="${player.id}">
                    Remove
                </button>
            `;
            
            container.appendChild(card);
        });

        this.updatePlayerStats();
        console.log('Guest players rendered');
    }

    // Team Generation Functions
    generateTeams() {
        console.log('Generating teams...');
        
        const availablePlayers = this.getAvailablePlayers();
        
        if (availablePlayers.length < 4) {
            alert('Need at least 4 players to generate teams!');
            return;
        }

        this.showLoadingOverlay('Creating balanced teams...');

        // Simulate processing time
        setTimeout(() => {
            this.teams = this.createBalancedTeams(availablePlayers);
            this.teams.generated = true;
            
            // Reset toss when new teams are generated
            this.resetToss();
            
            this.hideLoadingOverlay();
            this.renderTeams();
            this.updateTeamBalance();
            
            // Switch to teams view
            this.switchSection('teams');
            
            console.log('Teams generated:', this.teams);
        }, 2000);
    }

    regenerateTeams() {
        this.resetToss(); // Reset toss when regenerating
        this.generateTeams();
    }

    createBalancedTeams(players) {
        // Sort players by ranking (descending)
        const sortedPlayers = [...players].sort((a, b) => b.ranking - a.ranking);
        
        const teamA = [];
        const teamB = [];
        
        // Distribute players in snake draft pattern for balance
        sortedPlayers.forEach((player, index) => {
            if (index % 2 === 0) {
                teamA.push(player);
            } else {
                teamB.push(player);
            }
        });

        return { teamA, teamB, generated: true };
    }

    renderTeams() {
        console.log('Rendering teams...');
        
        const teamAContainer = document.getElementById('team-a-players');
        const teamBContainer = document.getElementById('team-b-players');
        const tossSection = document.getElementById('toss-section');
        
        if (!teamAContainer || !teamBContainer) {
            console.error('Team containers not found');
            return;
        }

        if (!this.teams.generated) {
            teamAContainer.innerHTML = '<p class="no-teams">Select available players and click "Generate Teams" to create balanced teams</p>';
            teamBContainer.innerHTML = '<p class="no-teams">Select available players and click "Generate Teams" to create balanced teams</p>';
            if (tossSection) tossSection.style.display = 'none';
            
            const countBadgeA = document.getElementById('team-a-count');
            const countBadgeB = document.getElementById('team-b-count');
            if (countBadgeA) countBadgeA.textContent = '(0 players)';
            if (countBadgeB) countBadgeB.textContent = '(0 players)';
            return;
        }

        // Show toss section when teams are generated
        if (tossSection) tossSection.style.display = 'block';

        this.renderTeamPlayers(this.teams.teamA, teamAContainer, 'team-a-count');
        this.renderTeamPlayers(this.teams.teamB, teamBContainer, 'team-b-count');

        // Update toss UI
        this.renderTossSection();
    }

    renderTossSection() {
        const tossControls = document.getElementById('toss-controls');
        const tossResult = document.getElementById('toss-result');
        
        if (!tossControls || !tossResult) {
            console.error('Toss elements not found');
            return;
        }

        if (!this.tossResult.conducted) {
            // Show toss button
            tossControls.innerHTML = `
                <button id="conduct-toss-btn" class="btn btn--primary">
                    🪙 Conduct Toss
                </button>
            `;
            tossResult.innerHTML = '';
        } else {
            // Show toss result and reset option
            tossControls.innerHTML = `
                <button id="reset-toss-btn" class="btn btn--outline btn--sm">
                    Reset Toss
                </button>
            `;
            
            const decisionText = this.tossResult.decision === 'bat' ? 'BAT FIRST' : 'BOWL FIRST';
            const decisionIcon = this.tossResult.decision === 'bat' ? '🏏' : '⚾';
            
            tossResult.innerHTML = `
                <div class="toss-result-card">
                    <div class="toss-winner">
                        <h4>🪙 Toss Winner: <span class="winner-team">Team ${this.tossResult.winner}</span></h4>
                        <div class="toss-decision">
                            <span class="decision-icon">${decisionIcon}</span>
                            <span class="decision-text">Chose to ${decisionText}</span>
                        </div>
                    </div>
                    <div class="match-order">
                        <div class="batting-team">
                            <strong>Batting First:</strong> 
                            Team ${this.tossResult.decision === 'bat' ? this.tossResult.winner : this.tossResult.loser}
                        </div>
                        <div class="bowling-team">
                            <strong>Bowling First:</strong> 
                            Team ${this.tossResult.decision === 'bowl' ? this.tossResult.winner : this.tossResult.loser}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    renderTeamPlayers(players, container, countBadgeId) {
        const countBadge = document.getElementById(countBadgeId);
        
        if (players.length === 0) {
            container.innerHTML = '<p class="no-teams">Select available players and click "Generate Teams" to create balanced teams</p>';
            if (countBadge) countBadge.textContent = '(0 players)';
            return;
        }

        if (countBadge) countBadge.textContent = `(${players.length} players)`;

        container.innerHTML = '';
        players.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.className = `team-player ${player.type === 'guest' ? 'guest-player' : ''}`;
            
            const badgeHtml = player.type === 'guest' ? '<span class="guest-badge">GUEST</span>' : '';
            
            playerDiv.innerHTML = `
                <div class="player-details">
                    ${badgeHtml}
                    <span class="player-name">${player.name}</span>
                    <span class="role-badge role-badge--${player.role.toLowerCase()}">${player.role}</span>
                </div>
                <span class="ranking-badge ${this.getRankingClass(player.ranking)}">${player.ranking}</span>
            `;
            
            container.appendChild(playerDiv);
        });
    }

    updateTeamBalance() {
        if (!this.teams.generated) return;

        const teamAAvg = this.calculateTeamAverage(this.teams.teamA);
        const teamBAvg = this.calculateTeamAverage(this.teams.teamB);
        const difference = Math.abs(teamAAvg - teamBAvg).toFixed(1);

        // Update balance display elements
        const teamAAvgEl = document.getElementById('team-a-avg');
        const teamBAvgEl = document.getElementById('team-b-avg');
        const balanceDiffEl = document.getElementById('balance-difference');

        if (teamAAvgEl) teamAAvgEl.textContent = teamAAvg.toFixed(1);
        if (teamBAvgEl) teamBAvgEl.textContent = teamBAvg.toFixed(1);
        if (balanceDiffEl) balanceDiffEl.textContent = difference;
    }

    calculateTeamAverage(team) {
        if (team.length === 0) return 0;
        const total = team.reduce((sum, player) => sum + player.ranking, 0);
        return total / team.length;
    }

    // Existing utility methods remain the same...
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            // Clear any form data
            const form = modal.querySelector('form');
            if (form) form.reset();
            
            // Clear any error messages
            const errorDiv = modal.querySelector('.error-message');
            if (errorDiv) errorDiv.classList.add('hidden');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showLoadingOverlay(message = 'Loading...') {
        const overlay = document.getElementById('loading-overlay');
        const loadingMessage = document.getElementById('loading-message');
        
        if (overlay && loadingMessage) {
            loadingMessage.textContent = message;
            overlay.classList.remove('hidden');
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    simulateDBSync() {
        // Simulate database synchronization
        console.log('Simulating database sync...');
    }

    // Additional methods for guest players, admin panel, etc. would continue here...
    // (The rest of the original methods remain unchanged)
    
    openGuestModal() {
        this.editingPlayerId = null;
        this.editingPlayerType = null;
        this.openModal('guest-modal');
    }

    saveGuestPlayer() {
        const name = document.getElementById('guest-name').value.trim();
        const role = document.getElementById('guest-role').value;
        const ranking = parseInt(document.getElementById('guest-ranking').value) || 50;

        if (!name) {
            alert('Please enter player name');
            return;
        }

        const newGuest = {
            id: this.guestIdCounter++,
            name: name,
            role: role,
            ranking: ranking,
            isAvailable: true,
            type: 'guest'
        };

        this.guestPlayers.push(newGuest);
        this.closeModal('guest-modal');
        this.renderGuestPlayers();
        this.renderPlayerSelection();

        console.log('Guest player added:', newGuest);
    }

    removeGuestPlayer(guestId) {
        this.guestPlayers = this.guestPlayers.filter(p => p.id !== guestId);
        this.renderGuestPlayers();
        console.log('Guest player removed:', guestId);
    }

    openPermanentPlayerModal() {
        this.editingPlayerId = null;
        this.editingPlayerType = 'permanent';
        this.openModal('permanent-player-modal');
    }

    savePermanentPlayer() {
        const name = document.getElementById('permanent-name').value.trim();
        const role = document.getElementById('permanent-role').value;
        const ranking = parseInt(document.getElementById('permanent-ranking').value) || 50;

        if (!name) {
            alert('Please enter player name');
            return;
        }

        if (this.editingPlayerId) {
            // Edit existing player
            const player = this.permanentPlayers.find(p => p.id === this.editingPlayerId);
            if (player) {
                player.name = name;
                player.role = role;
                player.ranking = ranking;
                console.log('Player updated:', player);
            }
        } else {
            // Add new player
            const newId = Math.max(...this.permanentPlayers.map(p => p.id), 0) + 1;
            const newPlayer = {
                id: newId,
                name: name,
                role: role,
                ranking: ranking,
                isAvailable: false,
                type: 'permanent'
            };

            this.permanentPlayers.push(newPlayer);
            console.log('New permanent player added:', newPlayer);
        }

        this.closeModal('permanent-player-modal');
        this.renderAdminPanel();
        this.renderPlayerSelection();
    }

    editPermanentPlayer(playerId) {
        const player = this.permanentPlayers.find(p => p.id === playerId);
        if (!player) return;

        this.editingPlayerId = playerId;
        this.editingPlayerType = 'permanent';

        // Fill the form
        document.getElementById('permanent-name').value = player.name;
        document.getElementById('permanent-role').value = player.role;
        document.getElementById('permanent-ranking').value = player.ranking;

        this.openModal('permanent-player-modal');
    }

    deletePermanentPlayer(playerId) {
        if (confirm('Are you sure you want to delete this player?')) {
            this.permanentPlayers = this.permanentPlayers.filter(p => p.id !== playerId);
            this.renderAdminPanel();
            this.renderPlayerSelection();
            console.log('Permanent player deleted:', playerId);
        }
    }

    renderAdminPanel() {
        console.log('Rendering admin panel...');
        const tableBody = document.getElementById('admin-players-table-body');
        if (!tableBody) {
            console.error('Admin table body not found');
            return;
        }

        tableBody.innerHTML = '';

        this.permanentPlayers.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.id}</td>
                <td>${player.name}</td>
                <td><span class="role-badge role-badge--${player.role.toLowerCase()}">${player.role}</span></td>
                <td><span class="ranking-badge ${this.getRankingClass(player.ranking)}">${player.ranking}</span></td>
                <td><span class="status status--${player.isAvailable ? 'success' : 'error'}">${player.isAvailable ? 'Available' : 'Not Available'}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn--sm btn--outline edit-permanent-btn" data-player-id="${player.id}">Edit</button>
                        <button class="btn btn--sm btn--outline delete-permanent-btn" data-player-id="${player.id}">Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });

        console.log('Admin panel rendered');
    }
}

// Initialize the app
const app = new BKDCricketApp();
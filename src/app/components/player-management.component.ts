import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStateService } from '../services/game-state.service';
import { ApiService } from '../services/api.service';

export interface Player {
  id?: string;
  playerId?: string;
  firstname: string;
  lastname: string;
  email: string;
  notes: string;
  createdAt?: string;
}

@Component({
  selector: 'app-player-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="player-management-container">
      <div class="game-info">
        <h2>Hantera spelare</h2>
        <div class="current-game">
          @if (editingGameName()) {
            <div class="edit-game-section">
              <strong>Aktuellt spel:</strong>
              <div class="edit-game-input">
                <input 
                  type="text" 
                  [(ngModel)]="newGameName"
                  class="form-control game-name-input"
                  placeholder="Ange spelnamn"
                  (keyup.enter)="saveGameName()"
                  (keyup.escape)="cancelEditGameName()"
                >
                <button 
                  class="btn btn-small btn-success"
                  (click)="saveGameName()"
                  [disabled]="!newGameName.trim()"
                  title="Spara"
                >
                  ✓
                </button>
                <button 
                  class="btn btn-small btn-secondary"
                  (click)="cancelEditGameName()"
                  title="Avbryt"
                >
                  ✕
                </button>
              </div>
            </div>
          } @else {
            <div class="game-name-display">
              <strong>Aktuellt spel:</strong> {{ gameStateService.gameState().gameName }}
              <button 
                class="btn btn-small btn-primary"
                (click)="startEditGameName()"
                title="Redigera spelnamn"
              >
                ✏️
              </button>
            </div>
          }
        </div>
      </div>
      
      <!-- Current players -->
      @if (gameStateService.gameState().players.length > 0) {
        <div class="current-players">
          <h3>Nuvarande spelare ({{ gameStateService.gameState().players.length }}/4)</h3>
          @if (initialPlayerCount > 0) {
            <div class="player-info-text">
              {{ initialPlayerCount }} spelare fanns redan i spelet, {{ gameStateService.gameState().players.length - initialPlayerCount }} tillagda nu
            </div>
          }
          <div class="players-list">
            @for (player of gameStateService.gameState().players; track $index) {
              <div class="player-item" [class.initial-player]="isInitialPlayer($index)">
                <div class="player-content">
                  <span class="player-name">{{ player }}</span>
                  @if (isInitialPlayer($index)) {
                    <span class="player-badge">Befintlig</span>
                  } @else {
                    <span class="player-badge new-player">Ny</span>
                  }
                </div>
                <button 
                  class="btn btn-small btn-danger"
                  (click)="removePlayer($index)"
                  title="Ta bort spelare"
                >
                  ✕
                </button>
              </div>
            }
          </div>
        </div>
      }
      
      <!-- Available players from database -->
      <div class="available-players-section">
        <h3>Välj befintlig spelare</h3>
        
        @if (loadingPlayers()) {
          <div class="loading">
            Laddar spelare...
          </div>
        }
        
        @if (!loadingPlayers() && getAvailablePlayersForSelection().length > 0) {
          <div class="players-grid">
            @for (player of getAvailablePlayersForSelection(); track (player.id || player.playerId)) {
              <div 
                class="available-player-item"
                (click)="addPlayerDirectly(player)"
                [class.disabled]="gameStateService.gameState().players.length >= 4 || isPlayerAlreadyAdded(player)"
              >
                <div class="player-info">
                  <div class="player-name">{{ player.firstname }} {{ player.lastname }}</div>
                  <div class="player-email">{{ player.email }}</div>
                  @if (player.notes) {
                    <div class="player-notes">{{ player.notes }}</div>
                  }
                  @if (isPlayerAlreadyAdded(player)) {
                    <div class="already-added">✓ Redan tillagd</div>
                  }
                </div>
              </div>
            }
          </div>
        }
        
        @if (!loadingPlayers() && getAvailablePlayersForSelection().length === 0 && availablePlayers().length > 0) {
          <div class="no-players">
            <p>Alla befintliga spelare är redan tillagda i spelet.</p>
          </div>
        }
        
        @if (!loadingPlayers() && availablePlayers().length === 0) {
          <div class="no-players">
            <p>Inga befintliga spelare hittades.</p>
          </div>
        }
      </div>
      
      <!-- Add new player -->
      <div class="add-player-section">
        <h3>Lägg till spelare</h3>
        <form class="player-form" (ngSubmit)="addPlayer()">
          <div class="form-row">
            <div class="form-group">
              <label for="firstname">Förnamn *:</label>
              <input 
                type="text" 
                id="firstname"
                [(ngModel)]="newPlayer.firstname"
                name="firstname"
                placeholder="Ange förnamn"
                class="form-control"
                required
                maxlength="50"
              >
            </div>
            
            <div class="form-group">
              <label for="lastname">Efternamn:</label>
              <input 
                type="text" 
                id="lastname"
                [(ngModel)]="newPlayer.lastname"
                name="lastname"
                placeholder="Ange efternamn"
                class="form-control"
                maxlength="50"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email *:</label>
            <input 
              type="email" 
              id="email"
              [(ngModel)]="newPlayer.email"
              name="email"
              placeholder="ange@email.se"
              class="form-control"
              required
              maxlength="100"
            >
          </div>
          
          <div class="form-group">
            <label for="notes">Anteckningar:</label>
            <textarea 
              id="notes"
              [(ngModel)]="newPlayer.notes"
              name="notes"
              placeholder="Valfria anteckningar om spelaren"
              class="form-control"
              rows="3"
              maxlength="500"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit"
              class="btn btn-primary"
              [disabled]="!isPlayerFormValid() || gameStateService.gameState().players.length >= 4 || isCreatingPlayer()"
            >
              @if (isCreatingPlayer()) {
                Skapar spelare...
              } @else {
                Lägg till spelare
              }
            </button>
            
            <button 
              type="button"
              class="btn btn-secondary btn-small"
              (click)="clearPlayerForm()"
            >
              Rensa
            </button>
          </div>
        </form>
        
        @if (gameStateService.gameState().players.length >= 4) {
          <div class="max-players-warning">
            Du har valt alla 4 spelare som krävs för Mah-jong.
          </div>
        }
      </div>
      
      <!-- Player validation -->
      <div class="validation-info">
        <div class="player-count" [class.valid]="gameStateService.gameState().players.length === 4">
          <span class="icon">{{ gameStateService.gameState().players.length === 4 ? '✓' : '⚠' }}</span>
          Exakt 4 spelare krävs för Mah-jong ({{ gameStateService.gameState().players.length }}/4)
        </div>
      </div>
      
      <!-- Action buttons -->
      <div class="action-buttons">
        <button 
          class="btn btn-secondary"
          (click)="goBackToGameSelection()"
        >
          ← Tillbaka till spelval
        </button>
        
        <button 
          class="btn btn-success"
          (click)="startGame()"
          [disabled]="gameStateService.gameState().players.length !== 4 || startingGame()"
        >
          @if (startingGame()) {
            Startar spel...
          } @else {
            Börja spela →
          }
        </button>
      </div>
      
      <!-- Error message -->
      @if (errorMessage()) {
        <div class="error-message">
          {{ errorMessage() }}
        </div>
      }
    </div>
  `,
  styles: [`
    .player-management-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .game-info {
      margin-bottom: 30px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .game-info h2 {
      margin: 0 0 10px 0;
      color: #2c3e50;
    }
    
    .current-game {
      color: #666;
    }
    
    .game-name-display {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .edit-game-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .edit-game-input {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .game-name-input {
      flex: 1;
      padding: 5px 8px;
      font-size: 14px;
      border: 2px solid #3498db;
      border-radius: 4px;
    }
    
    .game-name-input:focus {
      outline: none;
      border-color: #2980b9;
      box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    }
    
    .current-players {
      margin-bottom: 25px;
    }
    
    h3 {
      color: #2c3e50;
      margin-bottom: 15px;
    }
    
    .players-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 15px;
    }
    
    .player-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      transition: all 0.2s ease;
    }
    
    .player-item:hover {
      border-color: #3498db;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .player-item.initial-player {
      background: #f8f9fa;
      border-color: #6c757d;
    }

    .player-content {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }

    .player-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      background: #6c757d;
      color: white;
    }

    .player-badge.new-player {
      background: #28a745;
    }

    .player-info-text {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
      font-style: italic;
    }
    
    .add-player-section {
      margin-bottom: 25px;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: white;
    }
    
    .available-players-section {
      margin-bottom: 25px;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #f8f9fa;
    }
    
    .available-players-section h3 {
      margin-top: 0;
      color: #2c3e50;
    }
    
    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
      font-style: italic;
    }
    
    .players-grid {
      display: grid;
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .available-player-item {
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: white;
    }
    
    .available-player-item:hover {
      border-color: #3498db;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .available-player-item.selected {
      border-color: #2ecc71;
      background: #f8fff9;
    }
    
    .available-player-item.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: #f5f5f5;
    }
    
    .available-player-item.disabled:hover {
      border-color: #e0e0e0;
      box-shadow: none;
    }
    
    .player-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .player-name {
      font-weight: bold;
      font-size: 16px;
      color: #2c3e50;
    }
    
    .player-email {
      font-size: 14px;
      color: #666;
    }
    
    .player-notes {
      font-size: 12px;
      color: #888;
      font-style: italic;
    }
    
    .already-added {
      font-size: 12px;
      color: #27ae60;
      font-weight: bold;
    }
    
    .no-players {
      text-align: center;
      padding: 20px;
      color: #666;
      font-style: italic;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
    
    .form-group {
      margin-bottom: 0;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #2c3e50;
    }
    
    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      box-sizing: border-box;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    }
    
    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }
    
    .form-actions {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-top: 10px;
    }
    
    .input-group {
      display: flex;
      gap: 10px;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-small {
      padding: 5px 10px;
      font-size: 14px;
    }
    
    .btn-primary {
      background-color: #3498db;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #2980b9;
    }
    
    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }
    
    .btn-secondary:hover:not(:disabled) {
      background-color: #7f8c8d;
    }
    
    .btn-success {
      background-color: #2ecc71;
      color: white;
    }
    
    .btn-success:hover:not(:disabled) {
      background-color: #27ae60;
    }
    
    .btn-danger {
      background-color: #e74c3c;
      color: white;
    }
    
    .btn-danger:hover:not(:disabled) {
      background-color: #c0392b;
    }
    
    .max-players-warning {
      color: #e67e22;
      font-size: 14px;
      font-style: italic;
      margin-top: 5px;
    }
    
    .validation-info {
      margin-bottom: 25px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
    }
    
    .player-count {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 5px;
      color: #e74c3c;
    }
    
    .player-count.valid {
      color: #27ae60;
    }
    
    .player-count .icon {
      font-weight: bold;
      font-size: 16px;
    }
    
    .action-buttons {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-top: 30px;
    }
    
    .action-buttons .btn {
      flex: 1;
    }
    
    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 10px;
      border-radius: 4px;
      margin-top: 15px;
      border-left: 4px solid #f44336;
    }
  `]
})
export class PlayerManagementComponent implements OnInit {
  availablePlayers = signal<Player[]>([]);
  loadingPlayers = signal<boolean>(false);
  initialPlayerCount = 0; // Track how many players were already in the game
  editingGameName = signal<boolean>(false);
  newGameName = '';
  
  newPlayer = {
    firstname: '',
    lastname: '',
    email: '',
    notes: ''
  };
  errorMessage = signal<string>('');
  creatingPlayer = signal<boolean>(false);
  startingGame = signal<boolean>(false);

  constructor(
    public gameStateService: GameStateService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadPlayers();
    // Store the initial number of players when component loads
    this.initialPlayerCount = this.gameStateService.gameState().players.length;
  }

  loadPlayers() {
    this.loadingPlayers.set(true);
    this.errorMessage.set('');
    
    this.apiService.getPlayers().subscribe({
      next: (response) => {
        console.log('Players loaded:', response);
        let playersList: Player[] = [];
        
        if (response && Array.isArray(response)) {
          playersList = response;
        } else if (response && response.players && Array.isArray(response.players)) {
          playersList = response.players;
        }
        
        // Normalize the player objects to ensure consistent property names
        const normalizedPlayers = playersList.map(player => ({
          id: player.id || player.playerId,
          firstname: player.firstname,
          lastname: player.lastname || '',
          email: player.email,
          notes: player.notes || '',
          createdAt: player.createdAt
        }));
        
        this.availablePlayers.set(normalizedPlayers);
        this.loadingPlayers.set(false);
      },
      error: (error) => {
        console.error('Error loading players:', error);
        this.errorMessage.set('Kunde inte ladda spelare från servern.');
        this.loadingPlayers.set(false);
        this.availablePlayers.set([]);
      }
    });
  }

  isPlayerFormValid(): boolean {
    return !!(this.newPlayer.firstname.trim() && this.newPlayer.email.trim());
  }

  isCreatingPlayer(): boolean {
    return this.creatingPlayer();
  }

  clearPlayerForm() {
    this.newPlayer = {
      firstname: '',
      lastname: '',
      email: '',
      notes: ''
    };
    this.errorMessage.set('');
  }

  addPlayer() {
    if (!this.isPlayerFormValid()) {
      this.errorMessage.set('Förnamn och email är obligatoriska fält.');
      return;
    }

    const currentPlayers = this.gameStateService.gameState().players;
    
    if (currentPlayers.length >= 4) {
      this.errorMessage.set('Du har redan valt alla 4 spelare som krävs.');
      return;
    }

    // Check if player already exists in current game (by email)
    const playerDisplayName = `${this.newPlayer.firstname.trim()} ${this.newPlayer.lastname?.trim() || ''}`.trim();
    if (currentPlayers.some(player => player.includes(this.newPlayer.email))) {
      this.errorMessage.set('En spelare med denna email finns redan i spelet.');
      return;
    }

    this.creatingPlayer.set(true);
    this.errorMessage.set('');

    const playerData = {
      firstname: this.newPlayer.firstname.trim(),
      lastname: this.newPlayer.lastname?.trim() || '',
      email: this.newPlayer.email.trim(),
      notes: this.newPlayer.notes?.trim() || ''
    };

    this.apiService.createPlayer(playerData).subscribe({
      next: (response) => {
        console.log('Player response:', response);
        
        let displayName = playerDisplayName;
        if (response.status === 409) {
          // Player already exists
          this.gameStateService.showNotification('success', `Spelare ${displayName} (${this.newPlayer.email}) hittades och lades till!`);
        } else {
          // New player created
          this.gameStateService.showNotification('success', `Spelare ${displayName} (${this.newPlayer.email}) skapad och tillagd!`);
        }
        
        // Add player to the game (with email for identification and store ID)
        const updatedPlayers = [...currentPlayers, `${displayName} (${this.newPlayer.email})`];
        const currentPlayerIds = this.gameStateService.gameState().playerIds || [];
        const playerId = response.id || response.playerId || response.gameId || 'unknown'; // Try different possible ID fields
        const updatedPlayerIds = [...currentPlayerIds, playerId];
        
        this.gameStateService.updateGameState({ 
          players: updatedPlayers,
          playerIds: updatedPlayerIds
        });
        
        this.clearPlayerForm();
        this.creatingPlayer.set(false);
      },
      error: (error) => {
        console.error('Error creating/finding player:', error);
        this.creatingPlayer.set(false);
        
        if (error.status === 409) {
          // Player exists, treat as success - but we need to get the ID somehow
          const displayName = playerDisplayName;
          this.gameStateService.showNotification('success', `Spelare ${displayName} (${this.newPlayer.email}) hittades och lades till!`);
          
          const updatedPlayers = [...currentPlayers, `${displayName} (${this.newPlayer.email})`];
          const currentPlayerIds = this.gameStateService.gameState().playerIds || [];
          const playerId = error.error?.id || error.error?.playerId || 'unknown-error'; // Try to get ID from error response
          const updatedPlayerIds = [...currentPlayerIds, playerId];
          
          this.gameStateService.updateGameState({ 
            players: updatedPlayers,
            playerIds: updatedPlayerIds
          });
          this.clearPlayerForm();
        } else {
          this.errorMessage.set('Kunde inte skapa/hitta spelare. Försök igen.');
        }
      }
    });
  }

  removePlayer(index: number) {
    const currentPlayers = this.gameStateService.gameState().players;
    const currentPlayerIds = this.gameStateService.gameState().playerIds;
    
    const updatedPlayers = currentPlayers.filter((_, i) => i !== index);
    const updatedPlayerIds = currentPlayerIds.filter((_, i) => i !== index);
    
    // Update initial player count if we're removing an initial player
    if (index < this.initialPlayerCount) {
      this.initialPlayerCount--;
    }
    
    this.gameStateService.updateGameState({ 
      players: updatedPlayers,
      playerIds: updatedPlayerIds
    });
    this.errorMessage.set('');
  }

  goBackToGameSelection() {
    this.gameStateService.updateGameState({ currentView: 'gameSelection' });
    this.errorMessage.set('');
  }

  startGame() {
    const players = this.gameStateService.gameState().players;
    const playerIds = this.gameStateService.gameState().playerIds;
    const gameId = this.gameStateService.gameState().gameId;
    
    console.log('StartGame called - Current state:', {
      players: players,
      playerIds: playerIds,
      gameId: gameId,
      currentView: this.gameStateService.gameState().currentView
    });
    
    if (players.length !== 4) {
      this.errorMessage.set('Exakt 4 spelare krävs för att börja spela Mah-jong.');
      return;
    }

    if (!gameId) {
      this.errorMessage.set('Inget spel valt. Gå tillbaka och välj ett spel.');
      return;
    }

    // Check if any changes have been made to players
    const hasPlayerChanges = this.hasPlayerChanges();
    console.log('Player changes detected:', hasPlayerChanges);
    
    if (!hasPlayerChanges) {
      // No changes made, go directly to score registration
      console.log('No player changes detected, going directly to score registration');
      
      console.log('Before updateGameState - currentView:', this.gameStateService.gameState().currentView);
      
      this.gameStateService.updateGameState({ 
        playerName: players[0],
        currentView: 'scoreRegistration' 
      });
      
      console.log('After updateGameState - currentView:', this.gameStateService.gameState().currentView);
      
      this.gameStateService.showNotification('success', 
        'Spelet startar med befintliga spelare!');
      return;
    }

    // Changes were made, need to update players via API
    console.log('Player changes detected, updating via API');
    this.updatePlayersViaAPI(gameId, playerIds, players);
  }

  private hasPlayerChanges(): boolean {
    const currentPlayerCount = this.gameStateService.gameState().players.length;
    const currentPlayerIds = this.gameStateService.gameState().playerIds;
    
    // If we have fewer players than initially loaded, changes were made
    if (currentPlayerCount < this.initialPlayerCount) {
      console.log('Player count decreased from', this.initialPlayerCount, 'to', currentPlayerCount);
      return true;
    }
    
    // If we have more players than initially loaded, changes were made
    if (currentPlayerCount > this.initialPlayerCount) {
      console.log('Player count increased from', this.initialPlayerCount, 'to', currentPlayerCount);
      return true;
    }
    
    // If we have the same number but any new player IDs that weren't there initially
    if (currentPlayerCount === this.initialPlayerCount && this.initialPlayerCount > 0) {
      // For this case, we'd need to track the original player IDs, but since we're replacing players
      // if count is same and we had initial players, assume no changes for now
      console.log('Player count unchanged, assuming no changes');
      return false;
    }
    
    // If we started with 0 players and now have some, changes were made
    if (this.initialPlayerCount === 0 && currentPlayerCount > 0) {
      console.log('Started with no players, now have', currentPlayerCount);
      return true;
    }
    
    return false;
  }

  private updatePlayersViaAPI(gameId: string, playerIds: string[], players: string[]) {
    // Validate that all player IDs are valid (not empty or unknown)
    const validPlayerIds = playerIds.filter(id => id && id !== 'unknown-id' && id !== 'unknown-error');
    if (validPlayerIds.length !== 4) {
      this.errorMessage.set('Vissa spelare saknar giltiga ID:n. Försök lägga till spelarna igen.');
      this.startingGame.set(false);
      return;
    }

    // Set loading state
    this.startingGame.set(true);
    this.gameStateService.showNotification('success', 'Uppdaterar spelare i spelet...');
    this.errorMessage.set('');

    // Make API call to add players to the game
    this.apiService.addPlayersToGame(gameId, playerIds).subscribe({
      next: (response) => {
        console.log('Players updated in game:', response);
        
        // Set the first player as the current player for score registration
        console.log('API success - Before updateGameState - currentView:', this.gameStateService.gameState().currentView);
        
        this.gameStateService.updateGameState({ 
          playerName: players[0],
          currentView: 'scoreRegistration' 
        });
        
        console.log('API success - After updateGameState - currentView:', this.gameStateService.gameState().currentView);
        
        this.gameStateService.showNotification('success', 
          'Spelare uppdaterade! Spelet startar med 4 spelare!');
        
        this.startingGame.set(false);
      },
      error: (error) => {
        console.error('Error updating players in game:', error);
        this.startingGame.set(false);
        
        if (error.status === 400) {
          this.errorMessage.set('Ogiltiga spelardata. Kontrollera att alla spelare är korrekta.');
        } else if (error.status === 404) {
          this.errorMessage.set('Spelet hittades inte. Gå tillbaka och välj ett annat spel.');
        } else if (error.status === 409) {
          this.errorMessage.set('Spelare är redan tillagda i detta spel.');
        } else {
          this.errorMessage.set('Kunde inte uppdatera spelare i spelet. Försök igen.');
        }
        
        this.gameStateService.showNotification('error', 'Fel vid uppdatering av spelare');
      }
    });
  }

  addPlayerDirectly(player: Player) {
    const currentPlayers = this.gameStateService.gameState().players;
    
    if (currentPlayers.length >= 4) {
      this.errorMessage.set('Du har redan valt alla 4 spelare som krävs.');
      return;
    }

    // Check if player already exists in current game (by email)
    if (this.isPlayerAlreadyAdded(player)) {
      this.errorMessage.set('Denna spelare finns redan i spelet.');
      return;
    }

    // Add player to the game with ID stored
    const playerDisplayName = `${player.firstname} ${player.lastname}`.trim();
    const playerWithEmail = `${playerDisplayName} (${player.email})`;
    const playerId = player.id || player.playerId || 'unknown-id';
    
    // Store both display name and ID
    const updatedPlayers = [...currentPlayers, playerWithEmail];
    const currentPlayerIds = this.gameStateService.gameState().playerIds;
    const updatedPlayerIds = [...currentPlayerIds, playerId];
    
    this.gameStateService.updateGameState({ 
      players: updatedPlayers,
      playerIds: updatedPlayerIds
    });
    
    this.gameStateService.showNotification('success', `Spelare ${playerDisplayName} tillagd!`);
    this.errorMessage.set('');
  }

  isPlayerAlreadyAdded(player: Player): boolean {
    const currentPlayers = this.gameStateService.gameState().players;
    return currentPlayers.some(p => p.includes(player.email));
  }

  getAvailablePlayersForSelection(): Player[] {
    const currentPlayers = this.gameStateService.gameState().players;
    return this.availablePlayers().filter(player => 
      !currentPlayers.some(p => p.includes(player.email))
    );
  }

  isInitialPlayer(index: number): boolean {
    return index < this.initialPlayerCount;
  }

  startEditGameName() {
    this.editingGameName.set(true);
    this.newGameName = this.gameStateService.gameState().gameName || '';
    this.errorMessage.set('');
    
    // Focus the input field after a short delay
    setTimeout(() => {
      const input = document.querySelector('.game-name-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }

  cancelEditGameName() {
    this.editingGameName.set(false);
    this.newGameName = '';
    this.errorMessage.set('');
  }

  saveGameName() {
    if (!this.newGameName.trim()) {
      this.errorMessage.set('Spelnamnet får inte vara tomt.');
      return;
    }

    const gameId = this.gameStateService.gameState().gameId;
    if (!gameId) {
      this.errorMessage.set('Spel-ID saknas.');
      return;
    }

    const updateData = {
      gameId: gameId,
      name: this.newGameName.trim()
    };

    // Call API to update game name
    this.apiService.updateGame(updateData).subscribe({
      next: (response) => {
        console.log('Game name updated:', response);
        
        // Update the game state with new name
        this.gameStateService.updateGameState({
          gameName: this.newGameName.trim()
        });
        
        this.cancelEditGameName();
        this.gameStateService.showNotification('success', `Spelnamn uppdaterat till "${this.newGameName.trim()}"!`);
      },
      error: (error) => {
        console.error('Error updating game name:', error);
        if (error.status === 404) {
          this.errorMessage.set('Spelet hittades inte.');
        } else if (error.status === 400) {
          this.errorMessage.set('Ogiltigt spelnamn.');
        } else {
          this.errorMessage.set('Kunde inte uppdatera spelnamnet. Försök igen.');
        }
      }
    });
  }
}

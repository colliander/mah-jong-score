import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { GameStateService } from '../services/game-state.service';

export interface Game {
  gameId?: string;
  id?: string;
  gameName?: string;
  name?: string;
  createdAt?: string;
  players?: string[];
  playerNames?: string[]; // Add this to store actual player names
  status?: string;
  player1_id?: string;
  player2_id?: string;
  player3_id?: string;
  player4_id?: string;
}

@Component({
  selector: 'app-game-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="game-selection-container">
      <h2>Välj spel eller skapa nytt</h2>
      
      <!-- Loading state -->
      @if (loading()) {
        <div class="loading">
          Laddar spel...
        </div>
      }
      
      <!-- Existing games -->
      @if (!loading() && games().length > 0) {
        <div class="existing-games">
          <h3>Existerande spel</h3>
          <div class="games-list">
            @for (game of games(); track (game.gameId || game.id)) {
              <div 
                class="game-item"
                (click)="loadGameDirectly(game)"
              >
                <div class="game-info">
                  <div class="game-header">
                    <div class="game-name">{{ game.gameName || game.name }}</div>
                    <div class="game-status" [class]="getStatusClass(game.status)">
                      {{ getStatusText(game.status) }}
                    </div>
                  </div>
                  @if (game.createdAt) {
                    <div class="game-date">
                      {{ formatDate(game.createdAt) }}
                    </div>
                  }
                  @if (getPlayerCount(game) > 0) {
                    <div class="game-players">
                      {{ getPlayerCount(game) }}/4 spelare: {{ getPlayerNames(game) }}
                    </div>
                  } @else {
                    <div class="game-players no-players">
                      Inga spelare tillagda än
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
      
      <!-- No games message -->
      @if (!loading() && games().length === 0) {
        <div class="no-games">
          <p>Inga spel hittades. Skapa ett nytt spel nedan.</p>
        </div>
      }
      
      <!-- Create new game section -->
      <div class="create-new-game">
        <h3>Skapa nytt spel</h3>
        <div class="form-group">
          <label for="newGameName">Spelnamn:</label>
          <input 
            type="text" 
            id="newGameName"
            [(ngModel)]="newGameName"
            placeholder="Ange ett namn för spelet"
            class="form-control"
          >
        </div>
        
        <button 
          class="btn btn-success"
          (click)="createNewGame()"
          [disabled]="!newGameName.trim()"
        >
          Skapa nytt spel
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
    .game-selection-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    h2, h3 {
      color: #2c3e50;
      margin-bottom: 15px;
    }
    
    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
    }
    
    .existing-games {
      margin-bottom: 30px;
    }
    
    .games-list {
      display: grid;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .game-item {
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: white;
    }
    
    .game-item:hover {
      border-color: #3498db;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .game-item.selected {
      border-color: #2ecc71;
      background: #f8fff9;
    }
    
    .game-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }
    
    .game-status {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      color: white;
    }
    
    .status-new {
      background: #17a2b8;
    }
    
    .status-started {
      background: #ffc107;
      color: #212529;
    }
    
    .status-ended {
      background: #28a745;
    }
    
    .status-unknown {
      background: #6c757d;
    }
    
    .game-name {
      font-weight: bold;
      font-size: 16px;
      color: #2c3e50;
    }
    
    .game-id {
      font-size: 12px;
      color: #666;
      font-family: monospace;
    }
    
    .game-date {
      font-size: 12px;
      color: #666;
    }
    
    .game-players {
      font-size: 14px;
      color: #27ae60;
    }
    
    .game-players.no-players {
      color: #666;
      font-style: italic;
    }
    
    .create-new-game {
      border-top: 1px solid #e0e0e0;
      padding-top: 20px;
    }
    
    .form-group {
      margin-bottom: 15px;
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
    }
    
    .form-control:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.2s ease;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-primary {
      background-color: #3498db;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #2980b9;
    }
    
    .btn-success {
      background-color: #2ecc71;
      color: white;
    }
    
    .btn-success:hover:not(:disabled) {
      background-color: #27ae60;
    }
    
    .no-games {
      text-align: center;
      padding: 20px;
      color: #666;
      font-style: italic;
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
export class GameSelectionComponent implements OnInit {
  games = signal<Game[]>([]);
  loading = signal(false);
  newGameName = '';
  errorMessage = signal<string>('');

  constructor(
    private apiService: ApiService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    this.loading.set(true);
    this.errorMessage.set('');
    
    this.apiService.getGames().subscribe({
      next: (response) => {
        console.log('Games loaded - raw response:', response);
        let gamesList: Game[] = [];
        
        if (response && Array.isArray(response)) {
          gamesList = response;
        } else if (response && response.games && Array.isArray(response.games)) {
          gamesList = response.games;
        }
        
        console.log('Games list before normalization:', gamesList);
        
        // Normalize the game objects to ensure consistent property names
        const normalizedGames = gamesList.map(game => {
          console.log('Processing game:', game);
          const normalized = {
            gameId: game.gameId || game.id,
            gameName: game.gameName || game.name,
            createdAt: game.createdAt,
            players: game.players || [],
            status: game.status,
            player1_id: game.player1_id || (game as any).player1Id,
            player2_id: game.player2_id || (game as any).player2Id,
            player3_id: game.player3_id || (game as any).player3Id,
            player4_id: game.player4_id || (game as any).player4Id
          };
          console.log('Normalized game:', normalized);
          return normalized;
        });
        
        console.log('Normalized games:', normalizedGames);
        
        // Load player names for each game
        this.loadPlayerNamesForGames(normalizedGames);
      },
      error: (error) => {
        console.error('Error loading games:', error);
        this.errorMessage.set('Kunde inte ladda spel från servern.');
        this.loading.set(false);
        this.games.set([]);
      }
    });
  }

  loadGameDirectly(game: Game) {
    const gameId = game.gameId || game.id;
    const gameName = game.gameName || game.name;
    
    if (gameId && gameName) {
      this.gameStateService.showNotification('success', `Hämtar speldata för "${gameName}"...`);
      
      // Check if the game has players already assigned
      const playerIds = [game.player1_id, game.player2_id, game.player3_id, game.player4_id].filter(id => id) as string[];
      console.log('Game selected:', game);
      console.log('Player IDs found:', playerIds);
      
      if (playerIds.length > 0) {
        // Game has players, fetch their details
        this.loadGameWithExistingPlayers(gameId, gameName, playerIds);
      } else {
        // No players assigned, load empty game
        this.gameStateService.updateGameState({
          gameCreated: true,
          gameId: gameId,
          gameName: gameName,
          players: [],
          playerIds: [],
          currentView: 'playerManagement'
        });
        
        this.gameStateService.showNotification('success', `Spel "${gameName}" valt!`);
        this.errorMessage.set('');
      }
    }
  }

  private loadGameWithExistingPlayers(gameId: string, gameName: string, playerIds: string[]) {
    // Fetch all players to match with the IDs
    this.apiService.getPlayers().subscribe({
      next: (playersResponse) => {
        console.log('All players loaded for matching:', playersResponse);
        
        let allPlayers: any[] = [];
        if (playersResponse && Array.isArray(playersResponse)) {
          allPlayers = playersResponse;
        } else if (playersResponse && playersResponse.players && Array.isArray(playersResponse.players)) {
          allPlayers = playersResponse.players;
        }
        
        // Match player IDs with player details
        const matchedPlayers: string[] = [];
        const matchedPlayerIds: string[] = [];
        
        playerIds.forEach(playerId => {
          const player = allPlayers.find(p => (p.id || p.playerId) === playerId);
          console.log(`Looking for player with ID ${playerId}:`, player);
          if (player) {
            const displayName = `${player.firstname || ''} ${player.lastname || ''}`.trim() + ` (${player.email || ''})`;
            matchedPlayers.push(displayName);
            matchedPlayerIds.push(playerId);
          } else {
            // Player not found, add placeholder
            console.log(`Player with ID ${playerId} not found in available players`);
            matchedPlayers.push(`Okänd spelare (ID: ${playerId})`);
            matchedPlayerIds.push(playerId);
          }
        });
        
        console.log('Matched players:', matchedPlayers);
        console.log('Matched player IDs:', matchedPlayerIds);
        
        // Update game state with matched players
        this.gameStateService.updateGameState({
          gameCreated: true,
          gameId: gameId,
          gameName: gameName,
          players: matchedPlayers,
          playerIds: matchedPlayerIds,
          currentView: 'playerManagement'
        });
        
        this.gameStateService.showNotification('success', 
          `Spel "${gameName}" valt med ${matchedPlayers.length} befintliga spelare!`);
        this.errorMessage.set('');
      },
      error: (error) => {
        console.error('Error loading players for matching:', error);
        
        // Still load the game but with placeholder player info
        const placeholderPlayers = playerIds.map(id => `Spelare (ID: ${id})`);
        
        this.gameStateService.updateGameState({
          gameCreated: true,
          gameId: gameId,
          gameName: gameName,
          players: placeholderPlayers,
          playerIds: playerIds,
          currentView: 'playerManagement'
        });
        
        this.gameStateService.showNotification('success', 
          `Spel "${gameName}" valt med ${playerIds.length} spelare (kunde inte ladda spelarenamn)`);
        this.errorMessage.set('');
      }
    });
  }

  createNewGame() {
    if (!this.newGameName.trim()) {
      return;
    }

    const gameData = {
      name: this.newGameName.trim()
    };

    this.gameStateService.showNotification('success', 'Skapar nytt spel...');
    
    this.apiService.createGame(gameData).subscribe({
      next: (response) => {
        console.log('Game created:', response);
        
        // Use the gameId returned from the API
        const gameId = response.gameId || response.id;
        const gameName = response.gameName || response.name || this.newGameName.trim();
        
        // Update game state
        this.gameStateService.updateGameState({
          gameCreated: true,
          gameId: gameId,
          gameName: gameName,
          players: [],
          playerIds: [],
          currentView: 'playerManagement'
        });
        
        this.gameStateService.showNotification('success', `Spel "${gameName}" skapat!`);
        this.newGameName = '';
      },
      error: (error) => {
        console.error('Error creating game:', error);
        this.gameStateService.showNotification('error', 'Kunde inte skapa spel. Försök igen.');
      }
    });
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('sv-SE') + ' ' + date.toLocaleTimeString('sv-SE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return dateString;
    }
  }

  getStatusText(status?: string): string {
    console.log('Getting status text for:', status);
    if (!status) return 'Okänt';
    
    switch (status.toLowerCase()) {
      case 'new': return 'Nytt';
      case 'started': return 'Påbörjat';
      case 'ended': return 'Avslutat';
      default: return `Okänt (${status})`;
    }
  }

  getStatusClass(status?: string): string {
    if (!status) return 'status-unknown';
    
    switch (status.toLowerCase()) {
      case 'new': return 'status-new';
      case 'started': return 'status-started';
      case 'ended': return 'status-ended';
      default: return 'status-unknown';
    }
  }

  getPlayerCount(game: Game): number {
    let count = 0;
    if (game.player1_id) count++;
    if (game.player2_id) count++;
    if (game.player3_id) count++;
    if (game.player4_id) count++;
    return count;
  }

  private loadPlayerNamesForGames(games: Game[]) {
    // Get all players first
    this.apiService.getPlayers().subscribe({
      next: (playersResponse) => {
        let allPlayers: any[] = [];
        if (playersResponse && Array.isArray(playersResponse)) {
          allPlayers = playersResponse;
        } else if (playersResponse && playersResponse.players && Array.isArray(playersResponse.players)) {
          allPlayers = playersResponse.players;
        }

        // Add player names to each game
        const gamesWithPlayerNames = games.map(game => {
          const playerIds = [game.player1_id, game.player2_id, game.player3_id, game.player4_id].filter(id => id);
          const playerNames: string[] = [];

          playerIds.forEach(playerId => {
            const player = allPlayers.find(p => (p.id || p.playerId) === playerId);
            if (player) {
              const displayName = `${player.firstname || ''} ${player.lastname || ''}`.trim();
              playerNames.push(displayName);
            }
          });

          return {
            ...game,
            playerNames: playerNames
          };
        });

        this.games.set(gamesWithPlayerNames);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading player names:', error);
        // Still set the games even if we can't load player names
        this.games.set(games);
        this.loading.set(false);
      }
    });
  }

  getPlayerNames(game: Game): string {
    if (game.playerNames && game.playerNames.length > 0) {
      return game.playerNames.join(', ');
    }
    
    // Fallback to basic info if no names available
    const playerIds = [game.player1_id, game.player2_id, game.player3_id, game.player4_id].filter(id => id);
    if (playerIds.length > 0) {
      return `${playerIds.length} spelare tillagda`;
    }
    
    return 'Inga spelare';
  }
}

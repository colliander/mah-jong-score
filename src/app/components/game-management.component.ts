import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-game-management',
  standalone: true,
  imports: [NgIf, FormsModule],
  template: `
    <div class="game-management" *ngIf="!gameState().gameCreated">
      <h2>Spelhantering</h2>
      
      <!-- Game creation section -->
      <div class="game-creation">
        <h3>Skapa nytt spel</h3>
        <div class="input-group">
          <label for="gameName">Spelnamn:</label>
          <input 
            id="gameName"
            type="text" 
            [(ngModel)]="gameName" 
            placeholder="Ange spelnamn"
            class="game-input">
          <button 
            (click)="createGame()" 
            [disabled]="!gameName.trim()"
            class="create-game-btn">
            Skapa spel
          </button>
        </div>
      </div>

      <!-- Notifications -->
      <div class="notification" *ngIf="notificationState().status" 
           [class.success]="notificationState().status === 'success'"
           [class.error]="notificationState().status === 'error'">
        {{ notificationState().message }}
      </div>
    </div>
  `,
  styles: [`
    .game-management {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin-bottom: 20px;
      background-color: #f9f9f9;
    }

    .game-management h2 {
      margin-top: 0;
      color: #333;
    }

    .input-group {
      margin-bottom: 15px;
    }

    .input-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    .game-input, .player-input {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-right: 10px;
      font-size: 14px;
      width: 200px;
    }

    .create-game-btn, .reset-game-btn {
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .create-game-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .create-game-btn:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .reset-game-btn {
      background-color: #6c757d;
    }

    .reset-game-btn:hover {
      background-color: #545b62;
    }

    .game-details {
      background-color: white;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .game-details p {
      margin: 5px 0;
    }

    .notification {
      padding: 10px;
      border-radius: 4px;
      margin-top: 15px;
      font-weight: bold;
    }

    .notification.success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .notification.error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  `]
})
export class GameManagementComponent {
  gameName: string = '';
  playerName: string = '';
  gameState: any;
  notificationState: any;

  constructor(
    private apiService: ApiService,
    private gameStateService: GameStateService
  ) {
    // Initialize playerName from state
    this.playerName = this.gameStateService.gameState().playerName;
    this.gameState = this.gameStateService.gameState;
    this.notificationState = this.gameStateService.notificationState;
  }

  createGame() {
    if (!this.gameName.trim()) {
      this.gameStateService.showNotification('error', 'Ange ett spelnamn!');
      return;
    }

    const gameData = {
      name: this.gameName.trim()
    };

    this.apiService.createGame(gameData).subscribe({
      next: (response) => {
        console.log('Game created successfully:', response);
        
        // Use the gameId returned from the API
        const gameId = response.gameId || response.id;
        const gameName = response.gameName || response.name || this.gameName.trim();
        
        this.gameStateService.updateGameState({
          gameCreated: true,
          gameId: gameId,
          gameName: gameName
        });
        this.gameStateService.showNotification('success', 
          `Spel "${this.gameName}" skapat framgångsrikt! Spel-ID: ${gameId}`);
        this.gameName = '';
      },
      error: (error) => {
        console.error('Error creating game:', error);
        this.gameStateService.showNotification('error', 
          'Fel vid skapande av spel. Kontrollera din internetanslutning.');
      }
    });
  }

  updatePlayerName(name: string) {
    this.gameStateService.updateGameState({ playerName: name });
  }

  resetGame() {
    this.gameStateService.resetGame();
    this.gameName = '';
    this.playerName = '';
  }
}

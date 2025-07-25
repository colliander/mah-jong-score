import { Injectable, signal } from '@angular/core';

export interface GameState {
  gameCreated: boolean;
  gameId: string;
  gameName: string;
  playerName: string;
  players: string[];
  playerIds: string[];
  currentView: 'gameSelection' | 'playerManagement' | 'scoreRegistration';
}

export interface NotificationState {
  status: 'success' | 'error' | null;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  // Game state signals
  private _gameState = signal<GameState>({
    gameCreated: false,
    gameId: '',
    gameName: '',
    playerName: '',
    players: [],
    playerIds: [],
    currentView: 'gameSelection'
  });

  // Notification state signals
  private _notificationState = signal<NotificationState>({
    status: null,
    message: ''
  });

  // Public readonly access
  gameState = this._gameState.asReadonly();
  notificationState = this._notificationState.asReadonly();

  // Game state methods
  updateGameState(updates: Partial<GameState>) {
    this._gameState.update(current => ({ ...current, ...updates }));
  }

  resetGame() {
    this._gameState.set({
      gameCreated: false,
      gameId: '',
      gameName: '',
      playerName: '',
      players: [],
      playerIds: [],
      currentView: 'gameSelection'
    });
  }

  // Notification methods
  showNotification(status: 'success' | 'error', message: string) {
    this._notificationState.set({ status, message });
    
    // Auto-clear after 5 seconds
    setTimeout(() => {
      this._notificationState.set({ status: null, message: '' });
    }, 5000);
  }

  clearNotification() {
    this._notificationState.set({ status: null, message: '' });
  }
}

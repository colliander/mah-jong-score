import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiBaseUrl = 'https://mahjong-backend.in.bosbec.io';
  private readonly apiToken: string = 'a99ef626-35a2-4d59-ab37-fc1892d820ca';

  constructor(private http: HttpClient) {}

  // Centralized HTTP request method
  makeApiRequest(endpoint: string, data: any): Observable<any> {
    const headers = {
      'Authorization': this.apiToken,
      'Content-Type': 'application/json'
    };

    const url = `${this.apiBaseUrl}${endpoint}`;
    return this.http.post(url, data, { headers });
  }

  // Centralized GET request method
  makeGetRequest(endpoint: string): Observable<any> {
    const headers = {
      'Authorization': this.apiToken,
      'Content-Type': 'application/json'
    };

    const url = `${this.apiBaseUrl}${endpoint}`;
    return this.http.get(url, { headers });
  }

  // Create a new game
  createGame(gameData: { name: string }): Observable<any> {
    return this.makeApiRequest('/create-game', gameData);
  }

  // Add score to game
  addScore(scoreData: { 
    gameId: string, 
    playerId: string,
    playerName: string, 
    roundWind: string, 
    playerWind: string, 
    score: number,
    hand: any
  }): Observable<any> {
    return this.makeApiRequest('/add-score', scoreData);
  }

  // Get all existing games
  getGames(): Observable<any> {
    return this.makeGetRequest('/games');
  }

  // Create a new player
  createPlayer(playerData: { firstname: string, lastname: string, notes: string, email: string }): Observable<any> {
    return this.makeApiRequest('/create-player', playerData);
  }

  // Get all existing players
  getPlayers(): Observable<any> {
    return this.makeGetRequest('/players');
  }

  // Get players for a specific game
  getGamePlayers(gameId: string): Observable<any> {
    return this.makeGetRequest(`/games/${gameId}/players`);
  }

  // Add players to a game
  addPlayersToGame(gameId: string, playerIds: string[]): Observable<any> {
    const data = {
      id: gameId,
      player1_id: playerIds[0] || '',
      player2_id: playerIds[1] || '',
      player3_id: playerIds[2] || '',
      player4_id: playerIds[3] || ''
    };
    console.log('API call data for add-players:', data);
    return this.makeApiRequest('/add-players', data);
  }

  // Update game information
  updateGame(gameData: { gameId: string, name: string }): Observable<any> {
    return this.makeApiRequest('/update-game', {
      id: gameData.gameId,
      name: gameData.name
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ScoreRegistrationComponent } from './components/score-registration.component';
import { GameSelectionComponent } from './components/game-selection.component';
import { PlayerManagementComponent } from './components/player-management.component';
import { GameStateService } from './services/game-state.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ScoreRegistrationComponent, GameSelectionComponent, PlayerManagementComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'mahjong-app';
  
  constructor(public gameStateService: GameStateService) {}
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { GameStateService } from '../services/game-state.service';
import { TILE_IMAGES } from '../tile-images';

@Component({
  selector: 'app-score-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './score-registration.component.html',
  styleUrls: ['./score-registration.component.css']
})
export class ScoreRegistrationComponent {
  // Grundstenar för mah-jong-handen (34 olika typer)
  tiles = [
    // Characters (Man/Wan) - 萬
    { icon: TILE_IMAGES.m1, label: '1 Man', id: 'm1' },
    { icon: TILE_IMAGES.m2, label: '2 Man', id: 'm2' },
    { icon: TILE_IMAGES.m3, label: '3 Man', id: 'm3' },
    { icon: TILE_IMAGES.m4, label: '4 Man', id: 'm4' },
    { icon: TILE_IMAGES.m5, label: '5 Man', id: 'm5' },
    { icon: TILE_IMAGES.m6, label: '6 Man', id: 'm6' },
    { icon: TILE_IMAGES.m7, label: '7 Man', id: 'm7' },
    { icon: TILE_IMAGES.m8, label: '8 Man', id: 'm8' },
    { icon: TILE_IMAGES.m9, label: '9 Man', id: 'm9' },
    
    // Circles (Pin/Tong) - 筒
    { icon: TILE_IMAGES.p1, label: '1 Pin', id: 'p1' },
    { icon: TILE_IMAGES.p2, label: '2 Pin', id: 'p2' },
    { icon: TILE_IMAGES.p3, label: '3 Pin', id: 'p3' },
    { icon: TILE_IMAGES.p4, label: '4 Pin', id: 'p4' },
    { icon: TILE_IMAGES.p5, label: '5 Pin', id: 'p5' },
    { icon: TILE_IMAGES.p6, label: '6 Pin', id: 'p6' },
    { icon: TILE_IMAGES.p7, label: '7 Pin', id: 'p7' },
    { icon: TILE_IMAGES.p8, label: '8 Pin', id: 'p8' },
    { icon: TILE_IMAGES.p9, label: '9 Pin', id: 'p9' },
    
    // Bamboo (Sou/Tiao) - 條
    { icon: TILE_IMAGES.s1, label: '1 Sou', id: 's1' },
    { icon: TILE_IMAGES.s2, label: '2 Sou', id: 's2' },
    { icon: TILE_IMAGES.s3, label: '3 Sou', id: 's3' },
    { icon: TILE_IMAGES.s4, label: '4 Sou', id: 's4' },
    { icon: TILE_IMAGES.s5, label: '5 Sou', id: 's5' },
    { icon: TILE_IMAGES.s6, label: '6 Sou', id: 's6' },
    { icon: TILE_IMAGES.s7, label: '7 Sou', id: 's7' },
    { icon: TILE_IMAGES.s8, label: '8 Sou', id: 's8' },
    { icon: TILE_IMAGES.s9, label: '9 Sou', id: 's9' },
    
    // Winds (Kaze) - 風
    { icon: TILE_IMAGES.we, label: 'East', id: 'we' },
    { icon: TILE_IMAGES.ws, label: 'South', id: 'ws' },
    { icon: TILE_IMAGES.ww, label: 'West', id: 'ww' },
    { icon: TILE_IMAGES.wn, label: 'North', id: 'wn' },
    
    // Dragons (Sangen) - 三元牌
    { icon: TILE_IMAGES.dr, label: 'Red Dragon', id: 'dr' },
    { icon: TILE_IMAGES.dg, label: 'Green Dragon', id: 'dg' },
    { icon: TILE_IMAGES.dw, label: 'White Dragon', id: 'dw' }
  ];

  // Bonusstenar (läggs till separat, räknas inte mot 14-stenarsgränsen)
  bonusTiles = [
    // Flowers (Hana) - 花牌
    { icon: TILE_IMAGES.h1, label: 'Plommon', id: 'h1' },
    { icon: TILE_IMAGES.h2, label: 'Orkidé', id: 'h2' },
    { icon: TILE_IMAGES.h3, label: 'Krysantemum', id: 'h3' },
    { icon: TILE_IMAGES.h4, label: 'Bambu', id: 'h4' },
    
    // Seasons (Kisetsu) - 季節牌
    { icon: TILE_IMAGES.h5, label: 'Vår', id: 'h5' },
    { icon: TILE_IMAGES.h6, label: 'Sommar', id: 'h6' },
    { icon: TILE_IMAGES.h7, label: 'Höst', id: 'h7' },
    { icon: TILE_IMAGES.h8, label: 'Vinter', id: 'h8' }
  ];

  hand: any[] = [];
  bonusHand: any[] = [];
  hiddenPongs: string[] = [];
  kongs: string[] = [];
  hiddenKongs: string[] = [];
  isMahjong = false;
  score: number | null = null;
  scoreExplanation: string = '';
  roundWind: string = '';
  playerWind: string = '';
  playerName: string = '';

  windOptions = [
    { icon: TILE_IMAGES.we, label: 'East', id: 'we' },
    { icon: TILE_IMAGES.ws, label: 'South', id: 'ws' },
    { icon: TILE_IMAGES.ww, label: 'West', id: 'ww' },
    { icon: TILE_IMAGES.wn, label: 'North', id: 'wn' }
  ];

  gameState: any;
  notificationState: any;

  constructor(
    private apiService: ApiService,
    private gameStateService: GameStateService
  ) {
    this.gameState = this.gameStateService.gameState;
    this.notificationState = this.gameStateService.notificationState;
    // Initialize playerName from state
    this.playerName = this.gameStateService.gameState().playerName;
  }

  // Automatiskt upptäck kongs och gruppera handen
  autoDetectKongsAndGroups() {
    const counts: Record<string, number> = {};
    for (const tile of this.hand) {
      counts[tile.id] = (counts[tile.id] || 0) + 1;
    }
    
    // Automatiskt upptäck kongs
    this.kongs = [];
    for (const [tileId, count] of Object.entries(counts)) {
      if (count >= 4) {
        this.kongs.push(tileId);
      }
    }
  }

  // Gruppera handen för visning
  getGroupedHand() {
    const counts: Record<string, any> = {};
    const tileMap: Record<string, any> = {};
    
    // Skapa en map för snabb lookup av tile-objekt
    for (const tile of this.tiles) {
      tileMap[tile.id] = tile;
    }
    
    // Räkna stenar och skapa grupper
    for (const tile of this.hand) {
      if (!counts[tile.id]) {
        counts[tile.id] = {
          tile: tileMap[tile.id],
          count: 0
        };
      }
      counts[tile.id].count++;
    }

    const groups = {
      bonusTiles: this.bonusHand,
      kongs: [] as any[],       // 4 stenar
      pongs: [] as any[],       // 3 stenar
      straights: [] as any[],   // 3 stenar i följd
      pairs: [] as any[],       // 2 stenar
      singles: [] as any[]      // 1 sten
    };

    // Först, hitta alla stegar (3 stenar i följd)
    const usedInStraights: Record<string, number> = {};
    
    // Kolla varje typ (m, p, s) för stegar
    for (const suit of ['m', 'p', 's']) {
      for (let start = 1; start <= 7; start++) { // 1-2-3 till 7-8-9
        const tile1 = `${suit}${start}`;
        const tile2 = `${suit}${start + 1}`;
        const tile3 = `${suit}${start + 2}`;
        
        // Kontrollera om vi har alla tre stenarna och de inte redan används i stegar
        if (counts[tile1] && counts[tile2] && counts[tile3]) {
          const available1 = counts[tile1].count - (usedInStraights[tile1] || 0);
          const available2 = counts[tile2].count - (usedInStraights[tile2] || 0);
          const available3 = counts[tile3].count - (usedInStraights[tile3] || 0);
          
          if (available1 > 0 && available2 > 0 && available3 > 0) {
            // Vi har en stege!
            groups.straights.push({
              tiles: [tileMap[tile1], tileMap[tile2], tileMap[tile3]],
              type: 'straight',
              suit: suit
            });
            
            // Markera att vi använt dessa stenar i en stege
            usedInStraights[tile1] = (usedInStraights[tile1] || 0) + 1;
            usedInStraights[tile2] = (usedInStraights[tile2] || 0) + 1;
            usedInStraights[tile3] = (usedInStraights[tile3] || 0) + 1;
          }
        }
      }
    }

    // Sedan, sortera in återstående stenar baserat på antal (efter att ha tagit bort de som används i stegar)
    for (const [tileId, data] of Object.entries(counts)) {
      const usedInStraight = usedInStraights[tileId] || 0;
      const remainingCount = data.count - usedInStraight;
      
      if (remainingCount >= 4) {
        groups.kongs.push({ tile: data.tile, count: remainingCount });
      } else if (remainingCount === 3) {
        groups.pongs.push({ tile: data.tile, count: remainingCount });
      } else if (remainingCount === 2) {
        groups.pairs.push({ tile: data.tile, count: remainingCount });
      } else if (remainingCount === 1) {
        groups.singles.push({ tile: data.tile, count: remainingCount });
      }
    }

    return groups;
  }

  // Beräkna max tillåtna stenar baserat på automatiskt upptäckta kongs
  getMaxHandSize(): number {
    this.autoDetectKongsAndGroups(); // Automatiskt upptäck kongs först
    return 14 + this.kongs.length;
  }

  addTile(tile: any) {
    // Kolla om det är en bonussten (blomma eller årstid)
    if (tile.id.startsWith('h')) {
      this.bonusHand.push(tile);
    } else {
      // Vanliga stenar räknas mot maxhandstorlek (14 + antal kongs)
      if (this.hand.length < this.getMaxHandSize()) {
        this.hand.push(tile);
      }
    }
  }

  removeTile(index: number) {
    this.hand.splice(index, 1);
  }

  removeBonusTile(index: number) {
    this.bonusHand.splice(index, 1);
  }

  // Ta bort en sten av en viss typ från handen
  removeTileByType(tileId: string) {
    const index = this.hand.findIndex(tile => tile.id === tileId);
    if (index !== -1) {
      this.hand.splice(index, 1);
    }
  }

  toggleHiddenPong(tileId: string) {
    const index = this.hiddenPongs.indexOf(tileId);
    if (index > -1) {
      this.hiddenPongs.splice(index, 1);
    } else {
      this.hiddenPongs.push(tileId);
    }
  }

  toggleKong(tileId: string) {
    const index = this.kongs.indexOf(tileId);
    if (index > -1) {
      this.kongs.splice(index, 1);
    } else {
      this.kongs.push(tileId);
    }
  }

  toggleHiddenKong(tileId: string) {
    const index = this.hiddenKongs.indexOf(tileId);
    if (index > -1) {
      this.hiddenKongs.splice(index, 1);
    } else {
      this.hiddenKongs.push(tileId);
    }
  }

  isHiddenPong(tileId: string): boolean {
    return this.hiddenPongs.includes(tileId);
  }

  isKong(tileId: string): boolean {
    return this.kongs.includes(tileId);
  }

  isHiddenKong(tileId: string): boolean {
    return this.hiddenKongs.includes(tileId);
  }

  getUniqueTilesWithPongs(): any[] {
    const counts: Record<string, number> = {};
    for (const tile of this.hand) {
      counts[tile.id] = (counts[tile.id] || 0) + 1;
    }
    
    const uniqueTilesWithPongs: any[] = [];
    for (const tile of this.tiles) {
      if (counts[tile.id] >= 3) {
        uniqueTilesWithPongs.push(tile);
      }
    }
    return uniqueTilesWithPongs;
  }

  getUniqueTilesWithKongs(): any[] {
    const counts: Record<string, number> = {};
    for (const tile of this.hand) {
      counts[tile.id] = (counts[tile.id] || 0) + 1;
    }
    
    const uniqueTilesWithKongs: any[] = [];
    for (const tile of this.tiles) {
      if (counts[tile.id] >= 4) {
        uniqueTilesWithKongs.push(tile);
      }
    }
    return uniqueTilesWithKongs;
  }

  // Kontrollera om handen är komplett för poängberäkning
  isHandComplete(): boolean {
    // En komplett hand ska ha 14 stenar + bonusstenar, där varje kong ger +1 extra sten
    this.autoDetectKongsAndGroups();
    const expectedSize = 14 + this.kongs.length;
    return this.hand.length === expectedSize;
  }

  // Returnerar kort label för hörnet på varje tile
  getTileShortLabel(tileId: string): string {
    // Tecken (m), cirklar (p), bambu (s)
    if (/^[mps][1-9]$/.test(tileId)) return tileId[1];
    // Vindar
    if (tileId === 'we') return 'E'; // East
    if (tileId === 'ws') return 'S'; // South
    if (tileId === 'ww') return 'W'; // West
    if (tileId === 'wn') return 'N'; // North
    // Drakar - ingen label
    if (tileId === 'dr' || tileId === 'dg' || tileId === 'dw') return '';
    // Blommor (h1-h4) och årstider (h5-h8) - samma label för matchande vindar
    if (tileId === 'h1' || tileId === 'h5') return 'E'; // East
    if (tileId === 'h2' || tileId === 'h6') return 'S'; // South
    if (tileId === 'h3' || tileId === 'h7') return 'W'; // West
    if (tileId === 'h4' || tileId === 'h8') return 'N'; // North
    return '';
  }

  calculateScore() {
    let score = 0;
    let explanation = '';
    
    if (this.isMahjong) {
      score = 20;
      explanation += '20 poäng för mah-jong. ';
    } else {
      this.score = 0;
      this.scoreExplanation = 'Ingen mah-jong, ingen poäng.';
      return;
    }

    // Använd automatiskt grupperade hand för poängberäkning
    this.autoDetectKongsAndGroups();
    const groups = this.getGroupedHand();
    let doubles = 0;
    
    // Funktioner för att kontrollera stentyper
    const isTerminal = (tileId: string): boolean => {
      return tileId.endsWith('1') || tileId.endsWith('9'); // m1, m9, p1, p9, s1, s9
    };

    const isDragon = (tileId: string): boolean => {
      return ['dr', 'dg', 'dw'].includes(tileId);
    };

    const isWind = (tileId: string): boolean => {
      return ['we', 'ws', 'ww', 'wn'].includes(tileId);
    };

    const getPongBasePoints = (tileId: string, isHidden: boolean): number => {
      const basePoints = (isTerminal(tileId) || isDragon(tileId) || isWind(tileId)) ? 4 : 2;
      return isHidden ? basePoints * 2 : basePoints;
    };

    const getKongBasePoints = (tileId: string, isHidden: boolean): number => {
      const basePoints = (isTerminal(tileId) || isDragon(tileId) || isWind(tileId)) ? 16 : 8;
      return isHidden ? basePoints * 2 : basePoints;
    };

    // Poäng för kongs (automatiskt upptäckta)
    for (const group of groups.kongs) {
      const tileId = group.tile.id;
      const isHidden = this.isHiddenKong(tileId);
      const kongPoints = getKongBasePoints(tileId, isHidden);
      score += kongPoints;
      explanation += `${kongPoints} poäng för ${isHidden ? 'dold ' : ''}kong (${group.tile.label}). `;
      
      // Dubbleringar för speciella kongs
      if (isDragon(tileId)) {
        doubles++;
        explanation += `Drakarna dubblerar poängen. `;
      }
      if (tileId === this.roundWind) {
        doubles++;
        explanation += `Rundvind dubblerar poängen. `;
      }
      if (tileId === this.playerWind) {
        doubles++;
        explanation += `Spelarens vind dubblerar poängen. `;
      }
    }

    // Poäng för pongs (automatiskt upptäckta)
    for (const group of groups.pongs) {
      const tileId = group.tile.id;
      const isHidden = this.isHiddenPong(tileId);
      const pongPoints = getPongBasePoints(tileId, isHidden);
      score += pongPoints;
      explanation += `${pongPoints} poäng för ${isHidden ? 'dold ' : ''}pong (${group.tile.label}). `;
      
      // Dubbleringar för speciella pongs
      if (isDragon(tileId)) {
        doubles++;
        explanation += `Drakarna dubblerar poängen. `;
      }
      if (tileId === this.roundWind) {
        doubles++;
        explanation += `Rundvind dubblerar poängen. `;
      }
      if (tileId === this.playerWind) {
        doubles++;
        explanation += `Spelarens vind dubblerar poängen. `;
      }
    }

    // Poäng för par i drakar, spelarens vind eller rondens vind
    for (const group of groups.pairs) {
      const tileId = group.tile.id;
      if (isDragon(tileId) || tileId === this.playerWind || tileId === this.roundWind) {
        score += 2;
        explanation += `2 poäng för par i ${isDragon(tileId) ? 'drake' : tileId === this.playerWind ? 'egen vind' : 'rondens vind'} (${group.tile.label}). `;
      }
    }

    // Poäng för stegar (normalt 0 poäng men identifierade för komplett hand)
    for (const group of groups.straights) {
      explanation += `Stege identifierad: ${group.tiles.map((t: any) => t.label).join('-')}. `;
    }

    // Bonusstenar (blommor och årstider)
    if (this.bonusHand.length > 0) {
      score += this.bonusHand.length * 4;
      explanation += `${this.bonusHand.length * 4} poäng för ${this.bonusHand.length} bonusstenar. `;
    }

    // Dubblering för matchande blomma/årstid med egen vind
    const windToBonus: Record<string, string[]> = {
      'we': ['h1', 'h5'], // East: blomma 1, årstid 1
      'ws': ['h2', 'h6'], // South: blomma 2, årstid 2
      'ww': ['h3', 'h7'], // West: blomma 3, årstid 3
      'wn': ['h4', 'h8']  // North: blomma 4, årstid 4
    };
    
    if (this.playerWind && windToBonus[this.playerWind]) {
      const matchingBonuses = this.bonusHand.filter(t => 
        windToBonus[this.playerWind].includes(t.id)
      );
      if (matchingBonuses.length > 0) {
        doubles += matchingBonuses.length;
        explanation += `${matchingBonuses.length} dubblering${matchingBonuses.length > 1 ? 'ar' : ''} för matchande blomma/årstid med egen vind. `;
      }
    }

    // Dubblering för hand utan stegar (endast pongs/kongs)
    if (groups.straights.length === 0 && (groups.kongs.length > 0 || groups.pongs.length > 0)) {
      doubles++;
      explanation += `Dubblering för hand utan stegar (endast pongs/kongs). `;
    }

    // Dubblera poängen för varje dubblering
    if (doubles > 0) {
      score = score * Math.pow(2, doubles);
      explanation += `Totalt ${doubles} dubbleringar ger slutpoäng ${score}.`;
    }

    this.score = score;
    this.scoreExplanation = explanation;

    // Skicka poängen till API:et
    this.submitScore(score);
  }

  submitScore(score: number) {
    const gameState = this.gameStateService.gameState();
    
    if (!gameState.playerName.trim()) {
      this.gameStateService.showNotification('error', 'Ange ditt namn för att spara poängen!');
      return;
    }

    if (!gameState.gameCreated || !gameState.gameId) {
      this.gameStateService.showNotification('error', 'Du måste skapa ett spel först innan du kan spara poäng!');
      return;
    }

    // Get player ID from the selected player
    const playerId = this.getPlayerIdFromName(gameState.playerName.trim());
    
    // Get grouped tiles structure from current hand
    const groupedTiles = this.getGroupedTilesData();
    
    // Map winds to English names
    const roundWindEnglish = this.mapWindToEnglish(this.roundWind);
    const playerWindEnglish = this.mapWindToEnglish(this.playerWind);

    const scoreData = {
      gameId: gameState.gameId,
      playerId: playerId,
      playerName: gameState.playerName.trim(),
      roundWind: roundWindEnglish,
      playerWind: playerWindEnglish,
      score: score,
      hand: groupedTiles
    };

    console.log('Sending score data:', scoreData);
    console.log('Wind mapping:', {
      originalRoundWind: this.roundWind,
      mappedRoundWind: roundWindEnglish,
      originalPlayerWind: this.playerWind,
      mappedPlayerWind: playerWindEnglish
    });
    console.log('Grouped hand structure:', groupedTiles);

    this.apiService.addScore(scoreData).subscribe({
      next: (response) => {
        console.log('Score added successfully:', response);
        this.gameStateService.showNotification('success', 'Poäng sparad framgångsrikt till servern!');
      },
      error: (error) => {
        console.error('Error adding score:', error);
        this.gameStateService.showNotification('error', 'Fel vid sparande av poäng. Kontrollera din internetanslutning.');
      }
    });
  }

  updatePlayerName(name: string) {
    this.gameStateService.updateGameState({ playerName: name });
    this.playerName = name;
  }

  goBackToPlayerManagement() {
    this.gameStateService.updateGameState({ currentView: 'playerManagement' });
  }

  // Helper method to extract first name from player string
  getPlayerFirstName(playerString: string): string {
    // PlayerString format: "Firstname Lastname (email@example.com)"
    const nameMatch = playerString.match(/^([^\s]+)/);
    return nameMatch ? nameMatch[1] : playerString;
  }

  // Helper method to check if player is currently selected
  isPlayerSelected(playerString: string): boolean {
    return this.playerName === playerString;
  }

  // Method to select a player
  selectPlayer(playerString: string): void {
    this.playerName = playerString;
    this.gameStateService.updateGameState({ playerName: playerString });
  }

  // Helper method to map wind IDs to English names
  mapWindToEnglish(windId: string): string {
    const windMap: { [key: string]: string } = {
      'we': 'east',
      'ws': 'south', 
      'ww': 'west',
      'wn': 'north'
    };
    return windMap[windId] || windId;
  }

  // Helper method to get player ID from current player name
  getPlayerIdFromName(playerName: string): string {
    const players = this.gameStateService.gameState().players;
    const playerIds = this.gameStateService.gameState().playerIds;
    
    // Find the index of the current player
    const playerIndex = players.findIndex(p => p === playerName);
    
    if (playerIndex !== -1 && playerIndex < playerIds.length) {
      const playerId = playerIds[playerIndex];
      console.log(`Found player ID: ${playerId} for player: ${playerName}`);
      return playerId;
    }
    
    console.warn(`Could not find player ID for: ${playerName}`);
    console.log('Available players:', players);
    console.log('Available player IDs:', playerIds);
    
    // Fallback: return unknown-id if no match found
    return 'unknown-id';
  }

  // Helper method to get grouped tiles structure from current hand
  getGroupedTilesData(): any {
    const groupedHand = this.getGroupedHand();
    
    // Create a structured representation of the hand
    const handStructure = {
      bonusTiles: groupedHand.bonusTiles.map(tile => ({
        tileId: tile.id,
        type: 'bonus',
        count: 1
      })),
      kongs: groupedHand.kongs.map(group => ({
        tileId: group.tile.id,
        type: 'kong',
        count: group.count,
        hidden: this.isHiddenKong(group.tile.id)
      })),
      pongs: groupedHand.pongs.map(group => ({
        tileId: group.tile.id,
        type: 'pong',
        count: group.count,
        hidden: this.isHiddenPong(group.tile.id)
      })),
      straights: groupedHand.straights.map(group => ({
        tiles: group.tiles.map((tile: any) => tile.id),
        type: 'straight',
        suit: group.suit
      })),
      pairs: groupedHand.pairs.map(group => ({
        tileId: group.tile.id,
        type: 'pair',
        count: group.count
      })),
      singles: groupedHand.singles.map(group => ({
        tileId: group.tile.id,
        type: 'single',
        count: group.count
      }))
    };
    
    return handStructure;
  }

  // Helper method to get hand title with player name
  getHandTitle(): string {
    if (this.playerName && this.playerName.trim()) {
      const firstName = this.getPlayerFirstName(this.playerName);
      return `${firstName}s hand`;
    }
    return 'Din hand';
  }
}

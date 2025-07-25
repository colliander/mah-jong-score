/**
 * Mahjong Tile Image URLs - LOKALA FILER
 * 
   // FLOWERS (花牌) - Blommor (Använd filnamn: flower1.svg, flower2.svg, etc.)
  'h1': 'assets/tiles/flower1.svg',  // Plommon
  'h2': 'assets/tiles/flower2.svg',  // Orkidé
  'h3': 'assets/tiles/flower3.svg',  // Krysantemum
  'h4': 'assets/tiles/flower4.svg',  // Bambuna fil innehåller alla sökvägar till lokala bilderna för mah-jong-stenarna.
 * Lägg alla SVG-filer i mappen: src/assets/tiles/
 * 
 * Format: 'tile-id': 'assets/tiles/filnamn.svg'
 */

export const TILE_IMAGES = {
  // CHARACTERS/MAN (萬) - Tecken 1-9 (Använd filnamn: m1.svg, m2.svg, etc.)
  'm1': 'assets/tiles/m1.svg',  // 1 Man
  'm2': 'assets/tiles/m2.svg',  // 2 Man
  'm3': 'assets/tiles/m3.svg',  // 3 Man
  'm4': 'assets/tiles/m4.svg',  // 4 Man
  'm5': 'assets/tiles/m5.svg',  // 5 Man
  'm6': 'assets/tiles/m6.svg',  // 6 Man
  'm7': 'assets/tiles/m7.svg',  // 7 Man
  'm8': 'assets/tiles/m8.svg',  // 8 Man
  'm9': 'assets/tiles/m9.svg',  // 9 Man

  // CIRCLES/PIN (筒) - Cirklar 1-9 (Använd filnamn: p1.svg, p2.svg, etc.)
  'p1': 'assets/tiles/p1.svg',  // 1 Pin (Cirkel)
  'p2': 'assets/tiles/p2.svg',  // 2 Pin (Cirkel)
  'p3': 'assets/tiles/p3.svg',  // 3 Pin (Cirkel)
  'p4': 'assets/tiles/p4.svg',  // 4 Pin (Cirkel)
  'p5': 'assets/tiles/p5.svg',  // 5 Pin (Cirkel)
  'p6': 'assets/tiles/p6.svg',  // 6 Pin (Cirkel)
  'p7': 'assets/tiles/p7.svg',  // 7 Pin (Cirkel)
  'p8': 'assets/tiles/p8.svg',  // 8 Pin (Cirkel)
  'p9': 'assets/tiles/p9.svg',  // 9 Pin (Cirkel)

  // BAMBOO/SOU (條) - Bambu 1-9 (Använd filnamn: s1.svg, s2.svg, etc.)
  's1': 'assets/tiles/s1.svg',  // 1 Sou (Bambu)
  's2': 'assets/tiles/s2.svg',  // 2 Sou (Bambu)
  's3': 'assets/tiles/s3.svg',  // 3 Sou (Bambu)
  's4': 'assets/tiles/s4.svg',  // 4 Sou (Bambu)
  's5': 'assets/tiles/s5.svg',  // 5 Sou (Bambu)
  's6': 'assets/tiles/s6.svg',  // 6 Sou (Bambu)
  's7': 'assets/tiles/s7.svg',  // 7 Sou (Bambu)
  's8': 'assets/tiles/s8.svg',  // 8 Sou (Bambu)
  's9': 'assets/tiles/s9.svg',  // 9 Sou (Bambu)

  // WINDS (風) - Vindar (Använd filnamn: wind-east.svg, wind-south.svg, etc.)
  'we': 'assets/tiles/wind-east.svg',   // East
  'ws': 'assets/tiles/wind-south.svg',  // South
  'ww': 'assets/tiles/wind-west.svg',   // West
  'wn': 'assets/tiles/wind-north.svg',  // North

  // DRAGONS (三元牌) - Drakar (Använd filnamn: dragon-red.svg, dragon-green.svg, etc.)
  'dr': 'assets/tiles/dragon-red.svg',    // Red Dragon
  'dg': 'assets/tiles/dragon-green.svg',  // Green Dragon
  'dw': 'assets/tiles/dragon-white.svg',  // White Dragon

  // FLOWERS (花牌) - Blommor (Använd filnamn: flower1.svg, flower2.svg, etc.)
  'h1': 'assets/tiles/flower-spring.svg',  // Plommon
  'h2': 'assets/tiles/flower-summer.svg',  // Orkidé
  'h3': 'assets/tiles/flower-autumn.svg',  // Krysantemum
  'h4': 'assets/tiles/flower-winter.svg',  // Bambu

  // SEASONS (季節牌) - Årstider (Använd filnamn: season-spring.svg, season-summer.svg, etc.)
  'h5': 'assets/tiles/season-spring.svg',  // Vår
  'h6': 'assets/tiles/season-summer.svg',  // Sommar
  'h7': 'assets/tiles/season-autumn.svg',  // Höst
  'h8': 'assets/tiles/season-winter.svg'   // Vinter
};

/**
 * INSTRUKTIONER FÖR LOKALA FILER:
 * 
 * 1. Skapa mappen: src/assets/tiles/
 * 2. Lägg alla SVG-filer i den mappen med följande filnamn:
 * 
 * TECKEN/CHARACTERS (萬):
 * - m1.svg, m2.svg, m3.svg, m4.svg, m5.svg, m6.svg, m7.svg, m8.svg, m9.svg
 * 
 * CIRKLAR/CIRCLES (筒):
 * - c1.svg, c2.svg, c3.svg, c4.svg, c5.svg, c6.svg, c7.svg, c8.svg, c9.svg
 * 
 * BAMBU/BAMBOO (條):
 * - b1.svg, b2.svg, b3.svg, b4.svg, b5.svg, b6.svg, b7.svg, b8.svg, b9.svg
 * 
 * VINDAR/WINDS (風):
 * - wind-east.svg (東)
 * - wind-south.svg (南)
 * - wind-west.svg (西)
 * - wind-north.svg (北)
 * 
 * DRAKAR/DRAGONS (三元牌):
 * - dragon-red.svg (中)
 * - dragon-green.svg (發)
 * - dragon-white.svg (白)
 * 
 * BLOMMOR/FLOWERS (花牌):
 * - flower1.svg (Plommon)
 * - flower2.svg (Orkidé)
 * - flower3.svg (Krysantemum)
 * - flower4.svg (Bambu)
 * 
 * ÅRSTIDER/SEASONS (季節牌):
 * - season1.svg (Vår)
 * - season2.svg (Sommar)
 * - season3.svg (Höst)
 * - season4.svg (Vinter)
 * 
 * 3. Alla filer ska vara i SVG-format
 * 4. Kontrollera att filnamnen stämmer exakt (versalkänsligt!)
 * 5. Efter att du lagt dit filerna, ladda om appen för att se dem
 */

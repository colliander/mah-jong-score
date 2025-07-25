# Mah-jong Poängberäkning

## Grundregler

### Grundpoäng
- **20 poäng** för att göra mah-jong (komplett hand med 14 stenar)
- Ingen poäng utan mah-jong

### Dubbleringar (multiplicerar totala poängen)
Varje dubblering multiplicerar hela poängen med 2. Flera dubbleringar stackas (2^antal_dubbleringar).

#### Pongs/Kongs som ger dubblering:
- **Pong i drakar** (🀄🀅🀆) - 1 dubblering per drake-pong (2 poäng bas)
  - Dold pong i drake: 2 dubbleringar (4 poäng bas)
  - Kong i drake: 1 dubblering (8 poäng bas)
  - Dold kong i drake: 2 dubbleringar (16 poäng bas)
- **Pong i rondens vind** - 1 dubblering (2 poäng bas)
  - Dold pong i rondens vind: 2 dubbleringar (4 poäng bas)
  - Kong i rondens vind: 1 dubblering (8 poäng bas)
  - Dold kong i rondens vind: 2 dubbleringar (16 poäng bas)
- **Pong i egen vind** - 1 dubblering (2 poäng bas)
  - Dold pong i egen vind: 2 dubbleringar (4 poäng bas)
  - Kong i egen vind: 1 dubblering (8 poäng bas)
  - Dold kong i egen vind: 2 dubbleringar (16 poäng bas)

#### Bonusstenar som ger dubblering:
- **Matchande blomma/årstid med egen vind** - 1 dubblering
  - East (🀀): Plommon (🀢) eller Vår (🀦)
  - South (🀁): Orkidé (🀣) eller Sommar (🀧)
  - West (🀂): Krysantemum (🀤) eller Höst (🀨)
  - North (🀃): Bambu (🀥) eller Vinter (🀩)

### Bonuspoäng (läggs till grundpoängen innan dubbleringar)
- **4 poäng per bonussten** (blommor och årstider)
- **Pongs/Kongs baspoäng**:
  - Pong: 2 poäng (dold: 4 poäng)
  - Pong i terminaler (1:or/9:or): 4 poäng (dold: 8 poäng)
  - Kong: 8 poäng (dold: 16 poäng)
  - Kong i terminaler (1:or/9:or): 16 poäng (dold: 32 poäng)

## Beräkningsexempel

### Exempel 1: Enkel mah-jong
- Mah-jong: 20 poäng
- Inga dubbleringar
- **Total: 20 poäng**

### Exempel 2: Mah-jong med drake-pong
- Mah-jong: 20 poäng
- 1 pong i röd drake: 1 dubblering
- **Total: 20 × 2 = 40 poäng**

### Exempel 3: Mah-jong med bonusstenar
- Mah-jong: 20 poäng
- 2 bonusstenar: +8 poäng = 28 poäng totalt
- Ingen dubblering
- **Total: 28 poäng**

### Exempel 4: Komplex hand
- Mah-jong: 20 poäng
- 1 bonussten: +4 poäng = 24 poäng
- 1 pong i drake: 1 dubblering
- 1 matchande blomma med egen vind: 1 dubblering
- **Total: 24 × 2² = 24 × 4 = 96 poäng**

### Exempel 5: Dold pong
- Mah-jong: 20 poäng
- 1 dold pong i röd drake: 2 dubbleringar
- **Total: 20 × 2² = 20 × 4 = 80 poäng**

## Stentyper

### Grundstenar (suit tiles)
- **Man (万)**: 🀇🀈🀉🀊🀋🀌🀍🀎🀏 (1-9)
- **Pin (筒)**: 🀙🀚🀛🀜🀝🀞🀟🀠🀡 (1-9)
- **Sou (索)**: 🀐🀑🀒🀓🀔🀕🀖🀗🀘 (1-9)

### Hederstenar (honor tiles)
- **Vindar**: 🀀(East) 🀁(South) 🀂(West) 🀃(North)
- **Drakar**: 🀄(Red) 🀅(Green) 🀆(White)

### Bonusstenar
- **Blommor**: 🀢(Plommon) 🀣(Orkidé) 🀤(Krysantemum) 🀥(Bambu)
- **Årstider**: 🀦(Vår) 🀧(Sommar) 🀨(Höst) 🀩(Vinter)

## Noter
- Bonusstenar räknas inte mot de 14 stenarna i en komplett hand
- Dubbleringar appliceras efter att alla bonuspoäng lagts till grundpoängen
- Flera dubbleringar multipliceras: 2^antal_dubbleringar
- **Dolda pongs/kongs** ger dubbelt så många dubbleringar som öppna (2 istället för 1)
- En dold pong/kong är en uppsättning av 3-4 lika stenar som spelaren inte har visat för andra spelare
- **Terminaler** (1:or och 9:or) i alla färger ger dubbel baspoäng för pongs/kongs:
  - Man: 🀇(1) 🀏(9), Pin: 🀙(1) 🀡(9), Sou: 🀐(1) 🀘(9)

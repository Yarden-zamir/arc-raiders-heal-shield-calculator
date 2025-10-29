# Arc Raiders Damage Calculator

A React-based calculator to determine how many shots it takes to kill you in Arc Raiders, with accurate shield mitigation mechanics, healing items, and weapon upgrade levels.

## Features

- **Shield Types**: Select from Light, Medium, or Heavy shields with realistic stats
- **Weapon Selection**: Choose from all Arc Raiders weapons with upgrade level sliders
- **Shield Mitigation**: Accurate damage mitigation calculations (shields reduce incoming damage by a percentage)
- **Health & Shield Sliders**: Adjust current health and shield charge with visual indicators
- **Healing Items**: Factor in health restoration items
- **Shield Batteries**: Restore shield charge
- **Visual Charts**: Bar graphs comparing survivability across different scenarios

## Data Sources

- Weapon data: [nateblaine/arcraiders-data](https://github.com/nateblaine/arcraiders-data)
- Game mechanics: [Arc Raiders Wiki](https://arcraiders.wiki/)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server (port 5174):
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## How Shields Work

Shields in Arc Raiders **mitigate damage** rather than adding extra health:

### Shield Types
| Shield | Charge | Damage Mitigation | Movement Penalty |
|--------|--------|-------------------|------------------|
| Light  | 40     | 40%              | None             |
| Medium | 70     | 42.5%            | -5%              |
| Heavy  | 80     | 52.5%            | -15%             |

### Mechanics
- While shield has charge > 0, incoming damage is reduced by the mitigation percentage
- Shield charge depletes with each hit (by full weapon damage)
- Player takes mitigated damage to health while shield is active
- Once shield charge reaches 0, player takes full unmitigated damage

**Example**: With Medium Shield (70 charge, 42.5% mitigation) being shot by ARPEGGIO (9.5 damage):
- First shot: Player takes 5.46 HP damage, shield loses 9.5 charge
- After ~7 shots: Shield depleted, player takes full 9.5 damage per shot

## Calculator Features

- **Base Health**: 100 HP (adjustable with slider)
- **Shield System**: Three shield types with different charge and mitigation values
- **Healing Items**: Restores health up to 100 HP maximum
- **Shield Batteries**: Restores shield charge
- **Weapon Upgrades**: Slider to select weapon tier/variant (I, II, III, IV, etc.)

The calculator shows:
- Shots to kill with current health and shield
- Shots to kill after using healing items
- Shots to kill after restoring shield charge
- Combined effect of both healing and shield restoration
- Visual bar chart comparing all scenarios

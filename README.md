# Arc Raiders Damage Calculator

Event-based timeline simulator for Arc Raiders combat scenarios with accurate shield mechanics, healing items, and split decision paths.

## Features

- **Event Timeline**: Build combat sequences with shots, heals, shields, and delays
- **Split Paths**: Compare multiple tactical approaches with branching scenarios
- **Shield System**: Accurate damage mitigation (Light/Medium/Heavy shields)
- **Visual Graph**: Real-time health/shield tracking across all event paths
- **URL Sharing**: Save and share scenarios via URL parameters

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

## Quick Start

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm run build
npx serve dist
```

## Data Sources

- Weapons: [nateblaine/arcraiders-data](https://github.com/nateblaine/arcraiders-data)
- Mechanics: [Arc Raiders Wiki](https://arcraiders.wiki/)

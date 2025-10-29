import { useState, useEffect, useRef } from 'react'
import { WEAPONS } from './weaponsData'

// Default configuration
const DEFAULTS = {
  weapon: 'ferro',
  healItem: 'bandage',
  shieldItem: 'shield_recharger',
  shieldType: 'light_shield'
}

// Healing items with data from Arc Raiders wiki
// Source: https://arcraiders.wiki/wiki/Healing
const HEALING_ITEMS = [
  { id: 'vita_shot', name: 'Vita Shot', healing: 50, type: 'instant', image: 'https://arcraiders.wiki/wiki/Special:FilePath/Vita_Shot.png' },
  { id: 'sterilized_bandage', name: 'Sterilized Bandage', healing: 50, type: 'over_time', image: 'https://arcraiders.wiki/wiki/Special:FilePath/Sterilized_Bandage.png' },
  { id: 'herbal_bandage', name: 'Herbal Bandage', healing: 35, type: 'over_time', image: 'https://arcraiders.wiki/wiki/Special:FilePath/Herbal_Bandage.png' },
  { id: 'fruit_mix', name: 'Fruit Mix', healing: 25, type: 'instant', image: 'https://arcraiders.wiki/wiki/Special:FilePath/Fruit_Mix.png' },
  { id: 'bandage', name: 'Bandage', healing: 20, type: 'over_time', image: 'https://arcraiders.wiki/wiki/Special:FilePath/Bandage.png' },
  { id: 'vita_spray', name: 'Vita Spray', healing: 15, type: 'continuous', image: 'https://arcraiders.wiki/wiki/Special:FilePath/Vita_Spray.png' },
  { id: 'expired_pasta', name: 'Expired Pasta', healing: 15, type: 'instant', image: 'https://arcraiders.wiki/wiki/Special:FilePath/Expired_Pasta.png' },
  { id: 'mushroom', name: 'Mushroom', healing: 15, type: 'instant', image: 'https://arcraiders.wiki/wiki/Special:FilePath/Mushroom.png' },
  { id: 'agave', name: 'Agave', healing: 10, type: 'over_time', image: 'https://arcraiders.wiki/wiki/Special:FilePath/Agave.png' },
  { id: 'fabric', name: 'Fabric', healing: 10, type: 'over_time', image: 'https://arcraiders.wiki/wiki/Special:FilePath/Fabric.png' },
  { id: 'moss', name: 'Moss', healing: 10, type: 'over_time', image: 'https://arcraiders.wiki/wiki/Special:FilePath/Moss.png' },
  { id: 'resin', name: 'Resin', healing: 10, type: 'over_time', image: 'https://arcraiders.wiki/wiki/Special:FilePath/Resin.png' }
]

// Shield recharge items from Arc Raiders wiki
// Source: https://arcraiders.wiki/wiki/Healing
const SHIELD_ITEMS = [
  { id: 'surge_shield_recharger', name: 'Surge Shield Recharger', shieldRestore: 50, type: 'instant', image: 'https://arcraiders.wiki/wiki/Special:FilePath/Surge_Shield_Recharger.png' },
  { id: 'shield_recharger', name: 'Shield Recharger', shieldRestore: 40, type: 'over_time', image: 'https://arcraiders.wiki/wiki/Special:FilePath/Shield_Recharger.png' },
  { id: 'arc_powercell', name: 'ARC Powercell', shieldRestore: 20, type: 'over_time', image: 'https://arcraiders.wiki/wiki/Special:FilePath/ARC_Powercell.png' }
]

// Shield types that can be equipped (data from Arc Raiders wiki)
// Source: https://arcraiders.wiki/wiki/Shields
const SHIELD_TYPES = [
  {
    id: 'light_shield',
    name: 'Light Shield',
    shieldCharge: 40,
    damageMitigation: 40,
    movementSpeedModifier: 0,
    description: 'Low protection, no mobility penalty',
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Light_Shield.png'
  },
  {
    id: 'medium_shield',
    name: 'Medium Shield',
    shieldCharge: 70,
    damageMitigation: 42.5,
    movementSpeedModifier: -5,
    description: 'Balanced protection, 5% speed reduction',
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Medium_Shield.png'
  },
  {
    id: 'heavy_shield',
    name: 'Heavy Shield',
    shieldCharge: 80,
    damageMitigation: 52.5,
    movementSpeedModifier: -15,
    description: 'Maximum protection, 15% speed reduction',
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Heavy_Shield.png'
  }
]

// Component for bar chart
function BarChart({ data, maxValue }) {
  const maxShots = Math.max(...data.map(d => d.value), 1)

  return (
    <div className="bar-chart">
      {data.map((item, idx) => {
        const percentage = (item.value / maxShots) * 100
        return (
          <div key={idx} className="bar-item">
            <div className="bar-label">{item.label}</div>
            <div className="bar-container">
              <div
                className="bar-fill"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: item.color || '#00d4ff'
                }}
              >
                <span className="bar-value">{item.value}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Custom Image-Enabled Select Component
function ImageSelect({ value, onChange, options, placeholder = "Select..." }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="custom-image-select" ref={dropdownRef}>
      <div 
        className="custom-image-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? (
          <div className="custom-select-selected">
            {selectedOption.image && (
              <img src={selectedOption.image} alt={selectedOption.label} onError={(e) => { e.target.style.display = 'none' }} />
            )}
            <span>{selectedOption.label}</span>
          </div>
        ) : (
          <span className="custom-select-placeholder">{placeholder}</span>
        )}
        <span className="custom-select-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="custom-image-select-dropdown">
          {options.map(option => (
            <div
              key={option.value}
              className={`custom-select-option ${option.value === value ? 'selected' : ''}`}
              onClick={() => {
                onChange({ target: { value: option.value } })
                setIsOpen(false)
              }}
            >
              {option.image && (
                <img src={option.image} alt={option.label} onError={(e) => { e.target.style.display = 'none' }} />
              )}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Component for line graph showing health over events
function HealthOverEventsGraph({ paths, showSeparate }) {
  const [hoveredPath, setHoveredPath] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })
  const containerRef = useRef(null)

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      const containerWidth = window.innerWidth
      const isMobile = containerWidth <= 768
      const width = isMobile
        ? Math.max(280, containerWidth - 40)
        : Math.min(800, containerWidth - 100)
      const height = isMobile ? 300 : 400
      setDimensions({ width, height })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  if (!paths || paths.length === 0) return null

  // Find max events across all paths
  const maxEvents = Math.max(...paths.map(p => p.data.length))
  const maxHealth = showSeparate
    ? Math.max(...paths.flatMap(p => p.data.map(d => Math.max(d.health, d.shield))))
    : Math.max(...paths.flatMap(p => p.data.map(d => d.totalHp)))

  const { width, height } = dimensions
  const isMobile = width <= 600
  const padding = isMobile
    ? { top: 15, right: 10, bottom: 40, left: 40 }
    : { top: 20, right: 30, bottom: 50, left: 60 }
  const graphWidth = width - padding.left - padding.right
  const graphHeight = height - padding.top - padding.bottom

  const xScale = (eventIndex) => {
    if (maxEvents <= 1) return padding.left + graphWidth / 2
    return padding.left + (eventIndex / (maxEvents - 1)) * graphWidth
  }

  const yScale = (hp) => {
    if (maxHealth === 0) return padding.top + graphHeight
    return padding.top + graphHeight - (hp / maxHealth) * graphHeight
  }

  // Calculate appropriate grid lines for y-axis based on maxHealth
  const yGridValues = []
  const yStep = maxHealth <= 100 ? 25 : maxHealth <= 200 ? 50 : 100
  for (let i = 0; i <= Math.ceil(maxHealth / yStep); i++) {
    yGridValues.push(i * yStep)
  }

  // Calculate x-axis labels
  const xLabelCount = Math.min(maxEvents, 11)
  const xLabels = Array.from({ length: xLabelCount }, (_, i) => {
    if (maxEvents <= 1) return 0
    return Math.round((i / (xLabelCount - 1)) * (maxEvents - 1))
  })

  // Assign colors to paths
  const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffaa00', '#ff44ff', '#44ffff', '#ff8844', '#88ff44', '#4488ff', '#ff44aa', '#44ffaa']
  const pathsWithColors = paths.map((path, idx) => ({
    ...path,
    color: colors[idx % colors.length],
    healthColor: '#ff4444',
    shieldColor: '#4444ff'
  }))

  return (
    <div className="graph-container">
      <h3 style={{ color: '#00d4ff', marginBottom: '15px' }}>Health Over Events</h3>
      <div className="graph-wrapper">
        <svg
          width={width}
          height={height}
          style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '5px' }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          }}
          onMouseLeave={() => setHoveredPath(null)}
        >
          {/* Grid lines */}
          {yGridValues.filter(hp => hp <= maxHealth).map(hp => (
          <g key={`grid-${hp}`}>
            <line
              x1={padding.left}
              y1={yScale(hp)}
              x2={width - padding.right}
              y2={yScale(hp)}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            <text
              x={padding.left - 5}
              y={yScale(hp) + 5}
              fill="#888"
              fontSize={isMobile ? "10" : "12"}
              textAnchor="end"
            >
              {hp}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xLabels.map((eventIdx, i) => (
            <text
              key={`x-${i}`}
              x={xScale(eventIdx)}
              y={height - padding.bottom + 20}
              fill="#888"
              fontSize={isMobile ? "10" : "12"}
              textAnchor="middle"
            >
              {eventIdx}
            </text>
          ))}

        {/* Axis labels */}
        <text
          x={padding.left / 2}
          y={height / 2}
          fill="#00d4ff"
          fontSize={isMobile ? "11" : "14"}
          textAnchor="middle"
          transform={`rotate(-90, ${padding.left / 2}, ${height / 2})`}
        >
          {showSeparate ? 'HP / Shield' : 'Total HP'}
        </text>
        <text
          x={width / 2}
          y={height - 10}
          fill="#00d4ff"
          fontSize={isMobile ? "11" : "14"}
          textAnchor="middle"
        >
          Event Number
        </text>

        {/* Draw lines for each path */}
        {pathsWithColors.map((path, idx) => {
          if (showSeparate) {
            // Show health and shield as separate lines
            const healthPoints = path.data.map((d) => ({
              x: xScale(d.eventIndex),
              y: yScale(d.health)
            }))
            const shieldPoints = path.data.map((d) => ({
              x: xScale(d.eventIndex),
              y: yScale(d.shield)
            }))

            const healthPathData = healthPoints.map((p, i) =>
              i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
            ).join(' ')
            const shieldPathData = shieldPoints.map((p, i) =>
              i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
            ).join(' ')

            return (
              <g key={idx}>
                {/* Health line */}
                <path
                  d={healthPathData}
                  stroke="transparent"
                  strokeWidth="15"
                  fill="none"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredPath(path)}
                  onMouseLeave={() => setHoveredPath(null)}
                />
                <path
                  d={healthPathData}
                  stroke={path.healthColor}
                  strokeWidth={hoveredPath?.label === path.label ? "5" : "3"}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={idx % 2 === 0 ? "none" : "5,5"}
                  style={{
                    cursor: 'pointer',
                    opacity: hoveredPath ? (hoveredPath.label === path.label ? 1 : 0.3) : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={() => setHoveredPath(path)}
                />
                {healthPoints.map((p, i) => (
                  <circle
                    key={`h-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPath?.label === path.label ? "5" : "4"}
                    fill={path.healthColor}
                    stroke="rgba(0,0,0,0.5)"
                    strokeWidth="2"
                    style={{
                      cursor: 'pointer',
                      opacity: hoveredPath ? (hoveredPath.label === path.label ? 1 : 0.3) : 1,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={() => setHoveredPath(path)}
                  />
                ))}

                {/* Shield line */}
                <path
                  d={shieldPathData}
                  stroke="transparent"
                  strokeWidth="15"
                  fill="none"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredPath(path)}
                  onMouseLeave={() => setHoveredPath(null)}
                />
                <path
                  d={shieldPathData}
                  stroke={path.shieldColor}
                  strokeWidth={hoveredPath?.label === path.label ? "5" : "3"}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={idx % 2 === 0 ? "none" : "5,5"}
                  style={{
                    cursor: 'pointer',
                    opacity: hoveredPath ? (hoveredPath.label === path.label ? 1 : 0.3) : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={() => setHoveredPath(path)}
                />
                {shieldPoints.map((p, i) => (
                  <circle
                    key={`s-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPath?.label === path.label ? "5" : "4"}
                    fill={path.shieldColor}
                    stroke="rgba(0,0,0,0.5)"
                    strokeWidth="2"
                    style={{
                      cursor: 'pointer',
                      opacity: hoveredPath ? (hoveredPath.label === path.label ? 1 : 0.3) : 1,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={() => setHoveredPath(path)}
                  />
                ))}
              </g>
            )
          } else {
            // Show total HP as single line
            const points = path.data.map((d) => ({
              x: xScale(d.eventIndex),
              y: yScale(d.totalHp)
            }))

            const pathData = points.map((p, i) =>
              i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
            ).join(' ')

            return (
              <g key={idx}>
                {/* Invisible wider path for easier hovering */}
                <path
                  d={pathData}
                  stroke="transparent"
                  strokeWidth="15"
                  fill="none"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredPath(path)}
                  onMouseLeave={() => setHoveredPath(null)}
                />
                {/* Visible path */}
                <path
                  d={pathData}
                  stroke={path.color}
                  strokeWidth={hoveredPath?.label === path.label ? "5" : "3"}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    cursor: 'pointer',
                    opacity: hoveredPath ? (hoveredPath.label === path.label ? 1 : 0.3) : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={() => setHoveredPath(path)}
                />
                {/* Draw points */}
                {points.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPath?.label === path.label ? "5" : "4"}
                    fill={path.color}
                    stroke="rgba(0,0,0,0.5)"
                    strokeWidth="2"
                    style={{
                      cursor: 'pointer',
                      opacity: hoveredPath ? (hoveredPath.label === path.label ? 1 : 0.3) : 1,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={() => setHoveredPath(path)}
                  />
                ))}
              </g>
            )
          }
        })}

        {/* Tooltip */}
        {hoveredPath && (
          <g>
            <rect
              x={mousePos.x + 10}
              y={mousePos.y - 35}
              width={Math.max(150, hoveredPath.label.length * 7)}
              height="30"
              fill="rgba(0, 0, 0, 0.9)"
              stroke={hoveredPath.color}
              strokeWidth="2"
              rx="5"
            />
            <text
              x={mousePos.x + 15}
              y={mousePos.y - 15}
              fill={hoveredPath.color}
              fontSize={isMobile ? "11" : "14"}
              fontWeight="bold"
            >
              {hoveredPath.label}
            </text>
          </g>
        )}
      </svg>
      </div>

      {/* Legend */}
      <div className="graph-legend">
        {pathsWithColors.map((path, idx) => {
          const finalHealth = path.data[path.data.length - 1]?.health || 0
          const finalShield = path.data[path.data.length - 1]?.shield || 0

          let finalStatus
          if (finalHealth <= 0) {
            // Dead - show death info
            finalStatus = `Died after ${path.totalShotsTaken} shot${path.totalShotsTaken !== 1 ? 's' : ''} at event ${path.deathEventIndex}`
          } else if (showSeparate) {
            finalStatus = `${Math.round(finalHealth)} HP / ${Math.round(finalShield)} Shield`
          } else {
            finalStatus = `${Math.round(finalHealth)} HP remaining`
          }

          return (
            <div
              key={idx}
              className="legend-item"
              style={{
                cursor: 'pointer',
                opacity: hoveredPath ? (hoveredPath.label === path.label ? 1 : 0.3) : 1,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={() => setHoveredPath(path)}
              onMouseLeave={() => setHoveredPath(null)}
            >
              {showSeparate ? (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div className="legend-color" style={{ background: path.healthColor, border: idx % 2 === 0 ? 'none' : '1px dashed rgba(255,255,255,0.5)' }} />
                  <div className="legend-color" style={{ background: path.shieldColor, border: idx % 2 === 0 ? 'none' : '1px dashed rgba(255,255,255,0.5)' }} />
                </div>
              ) : (
                <div className="legend-color" style={{ background: path.color }} />
              )}
              <span style={{ color: '#a0a0a0' }}>
                {path.label} <span style={{ color: finalHealth > 0 ? '#44ff44' : '#ff4444' }}>({finalStatus})</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function App() {
  const [currentHealth, setCurrentHealth] = useState(100)
  const [currentShield, setCurrentShield] = useState(
    SHIELD_TYPES.find(s => s.id === DEFAULTS.shieldType)?.shieldCharge || 0
  )
  const [selectedShieldType, setSelectedShieldType] = useState(DEFAULTS.shieldType)
  const [showSeparateHealthShield, setShowSeparateHealthShield] = useState(false)
  const [isDraggingHealth, setIsDraggingHealth] = useState(false)
  const [isDraggingShield, setIsDraggingShield] = useState(false)

  // Event-based timeline
  const [timeline, setTimeline] = useState([
    { id: 1, type: 'shot', weaponId: DEFAULTS.weapon, label: 'Shot 1', count: 1 }
  ])
  const [nextEventId, setNextEventId] = useState(2)
  const [expandedMultipliers, setExpandedMultipliers] = useState(new Set())
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  // Get the last used weapon from timeline (for default in new events)
  const getLastUsedWeapon = () => {
    // Search timeline in reverse for the last weapon used
    for (let i = timeline.length - 1; i >= 0; i--) {
      const event = timeline[i]
      if (event.type === 'shot' && event.weaponId) {
        return event.weaponId
      }
      if (event.type === 'split' && event.branches) {
        for (let j = event.branches.length - 1; j >= 0; j--) {
          const branch = event.branches[j]
          if (branch.events) {
            for (let k = branch.events.length - 1; k >= 0; k--) {
              if (branch.events[k].type === 'shot' && branch.events[k].weaponId) {
                return branch.events[k].weaponId
              }
            }
          }
        }
      }
    }
    return DEFAULTS.weapon
  }

  // Encode timeline to readable string format with multipliers
  const encodeTimeline = (events) => {
    return events.map(event => {
      if (event.type === 'split') {
        const branches = event.branches.map(branch => {
          const count = branch.count || 1
          let branchStr = ''
          if (branch.type === 'shot') branchStr = `shot:${branch.weaponId}`
          else if (branch.type === 'heal') branchStr = `heal:${branch.itemId}`
          else if (branch.type === 'shield') branchStr = `shield:${branch.itemId}`
          else branchStr = 'nothing'

          return count > 1 ? `${count}x${branchStr}` : branchStr
        }).join('|')
        return `(${branches})`
      } else {
        const count = event.count || 1
        let eventStr = ''
        if (event.type === 'shot') eventStr = `shot:${event.weaponId}`
        else if (event.type === 'heal') eventStr = `heal:${event.itemId}`
        else if (event.type === 'shield') eventStr = `shield:${event.itemId}`
        else eventStr = 'nothing'

        return count > 1 ? `${count}x${eventStr}` : eventStr
      }
    }).join(',')
  }

  // Decode timeline from readable string format with multipliers
  const decodeTimeline = (str) => {
    if (!str) return []

    const events = []
    let id = 1
    const parts = []
    let current = ''
    let depth = 0

    // Split by comma but respect parentheses
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '(') depth++
      if (str[i] === ')') depth--
      if (str[i] === ',' && depth === 0) {
        parts.push(current)
        current = ''
      } else {
        current += str[i]
      }
    }
    if (current) parts.push(current)

    const parseEventPart = (part) => {
      // Check for multiplier (e.g., "5xshot:ferro")
      const multiplierMatch = part.match(/^(\d+)x(.+)$/)
      const count = multiplierMatch ? parseInt(multiplierMatch[1]) : 1
      const eventStr = multiplierMatch ? multiplierMatch[2] : part

      const parsedEvents = []

      if (eventStr.startsWith('(') && eventStr.endsWith(')')) {
        // Split event
        const branchStr = eventStr.slice(1, -1)
        const branchParts = branchStr.split('|')
        const branches = branchParts.map((b, idx) => {
          const branchMatch = b.match(/^(\d+)x(.+)$/)
          const branchCount = branchMatch ? parseInt(branchMatch[1]) : 1
          const branchEventStr = branchMatch ? branchMatch[2] : b

          id++
          if (branchEventStr.startsWith('shot:')) return { id, type: 'shot', weaponId: branchEventStr.slice(5), count: branchCount, label: `Option ${String.fromCharCode(65 + idx)}` }
          if (branchEventStr.startsWith('heal:')) return { id, type: 'heal', itemId: branchEventStr.slice(5), count: branchCount, label: `Option ${String.fromCharCode(65 + idx)}` }
          if (branchEventStr.startsWith('shield:')) return { id, type: 'shield', itemId: branchEventStr.slice(7), count: branchCount, label: `Option ${String.fromCharCode(65 + idx)}` }
          return { id, type: 'nothing', count: branchCount, label: `Option ${String.fromCharCode(65 + idx)}` }
        })
        parsedEvents.push({ id: id++, type: 'split', label: 'Split', branches })
      } else {
        // Regular event with count
        if (eventStr.startsWith('shot:')) parsedEvents.push({ id: id++, type: 'shot', weaponId: eventStr.slice(5), count, label: `Shot ${id}` })
        else if (eventStr.startsWith('heal:')) parsedEvents.push({ id: id++, type: 'heal', itemId: eventStr.slice(5), count, label: 'Heal' })
        else if (eventStr.startsWith('shield:')) parsedEvents.push({ id: id++, type: 'shield', itemId: eventStr.slice(7), count, label: 'Shield Recharge' })
        else if (eventStr === 'nothing') parsedEvents.push({ id: id++, type: 'nothing', count, label: 'Nothing' })
      }

      return parsedEvents
    }

    parts.forEach(part => {
      events.push(...parseEventPart(part))
    })

    return { events, nextId: id }
  }

  // Load state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hasAnyParams = params.toString().length > 0

    // If URL has params, load from URL (even if some are missing)
    // If URL has no params, defaults are already set in useState
    if (hasAnyParams) {
      // Load from URL, use defaults only for truly missing values
      setCurrentHealth(params.has('health') ? parseInt(params.get('health')) || 100 : 100)
      setCurrentShield(params.has('shield') ? parseInt(params.get('shield')) || 0 : 0)

      // If shieldType param exists (even if empty), use it. If not in URL but other params exist, assume no shield
      if (params.has('shieldType')) {
        const shieldType = params.get('shieldType')
        setSelectedShieldType(shieldType)
        if (shieldType) {
          // If there's a shield type but no explicit shield value, set to max
          if (!params.has('shield')) {
            const shield = SHIELD_TYPES.find(s => s.id === shieldType)
            if (shield) setCurrentShield(shield.shieldCharge)
          }
        } else {
          setCurrentShield(0)
        }
      } else {
        // Other params exist but no shieldType = explicitly no shield
        setSelectedShieldType('')
        setCurrentShield(0)
      }

      setShowSeparateHealthShield(params.get('separate') === 'true')

      if (params.has('events')) {
        try {
          const decoded = decodeTimeline(params.get('events'))
          if (decoded.events.length > 0) {
            setTimeline(decoded.events)
            setNextEventId(decoded.nextId)
          }
        } catch (e) {
          console.error('Failed to parse events from URL:', e)
        }
      } else {
        // Reset to default timeline if URL has params but no events
        setTimeline([{ id: 1, type: 'shot', weaponId: DEFAULTS.weapon, label: 'Shot 1', count: 1 }])
        setNextEventId(2)
      }
    }
  }, [])

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams()

    // Encode events first
    const eventsStr = encodeTimeline(timeline)
    const defaultShieldCharge = SHIELD_TYPES.find(s => s.id === DEFAULTS.shieldType)?.shieldCharge || 0
    const hasChanges = currentHealth !== 100 || currentShield !== defaultShieldCharge ||
                       selectedShieldType !== DEFAULTS.shieldType || showSeparateHealthShield ||
                       eventsStr !== `shot:${DEFAULTS.weapon}`

    // If anything changed from defaults, save current state to URL
    if (hasChanges) {
      if (currentHealth !== 100) params.set('health', currentHealth.toString())
      // Only save shield if it differs from the default shield charge
      const currentShieldType = SHIELD_TYPES.find(s => s.id === selectedShieldType)
      const expectedShieldCharge = currentShieldType?.shieldCharge || 0
      if (currentShield !== expectedShieldCharge) params.set('shield', currentShield.toString())
      // Always save shieldType (even if empty) when URL has params, to preserve "no shield" state
      params.set('shieldType', selectedShieldType)
      if (showSeparateHealthShield) params.set('separate', 'true')
      if (eventsStr) params.set('events', eventsStr)
    }

    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [currentHealth, currentShield, selectedShieldType, showSeparateHealthShield, timeline])

  const calculateShotsToKill = (health, shieldCharge, shieldMitigation, weaponDamage) => {
    let currentHealth = health
    let currentShield = shieldCharge
    let shots = 0
    let shieldBreakShot = null

    while (currentHealth > 0) {
      shots++

      if (currentShield > 0) {
        // Shield is active - mitigate incoming damage to health
        const mitigatedDamage = weaponDamage * (1 - shieldMitigation / 100)
        currentHealth -= mitigatedDamage

        // Shield charge is depleted by the full incoming damage
        currentShield -= weaponDamage

        // Track when shield breaks
        if (currentShield <= 0 && shieldBreakShot === null) {
          shieldBreakShot = shots
        }

        if (currentShield < 0) currentShield = 0
      } else {
        // No shield - take full damage
        currentHealth -= weaponDamage
      }
    }

    return { shots, shieldBreakShot }
  }

  // Simulate health over events in the timeline
  // Returns all paths through the timeline (handles splits)
  const simulateHealthOverEvents = (initialHealth, initialShield, shieldMitigation, events) => {
    // Start with one path
    let paths = [{
      health: initialHealth,
      shield: initialShield,
      data: [{
        eventIndex: 0,
        health: initialHealth,
        shield: initialShield,
        totalHp: initialHealth + initialShield,
        label: 'Start'
      }],
      eventHistory: [],
      totalShotsTaken: 0,
      deathEventIndex: null
    }]

    // Process each event
    events.forEach((event, eventIndex) => {
      if (event.type === 'split') {
        // Split creates multiple paths
        const newPaths = []
        paths.forEach(path => {
          event.branches.forEach((branch, branchIndex) => {
            const newPath = {
              ...path,
              data: [...path.data],
              eventHistory: [...path.eventHistory, branch.label],
              totalShotsTaken: path.totalShotsTaken,
              deathEventIndex: path.deathEventIndex
            }
            // Apply all events in the branch
            branch.events.forEach((branchEvent, branchEventIdx) => {
              processEvent(newPath, branchEvent, eventIndex + branchEventIdx + 1)
            })
            newPaths.push(newPath)
          })
        })
        paths = newPaths
      } else {
        // Regular event - applies to all paths
        paths.forEach(path => {
          processEvent(path, event, eventIndex + 1)
        })
      }
    })

    // Generate labels from event history
    paths.forEach(path => {
      path.label = path.eventHistory.length > 0 ? path.eventHistory.join(' > ') : 'No events'
    })

    return paths

    function processEvent(path, event, eventIndex) {
      if (path.health <= 0) return // Path is dead

      const count = event.count || 1

      for (let i = 0; i < count; i++) {
        if (path.health <= 0) break // Stop if dead mid-repetition

        if (event.type === 'shot') {
          const weapon = WEAPONS.find(w => w.id === event.weaponId) || WEAPONS[0]
          const weaponDamage = weapon.damage

          // Track shot count
          path.totalShotsTaken++

          if (path.shield > 0) {
            const mitigatedDamage = weaponDamage * (1 - shieldMitigation / 100)
            path.health -= mitigatedDamage
            path.shield -= weaponDamage
            if (path.shield < 0) path.shield = 0
          } else {
            path.health -= weaponDamage
          }

          // Track death
          if (path.health <= 0 && path.deathEventIndex === null) {
            path.deathEventIndex = eventIndex
          }

          if (i === 0 || i === count - 1 || count <= 2) { // Only add to history at start/end or if count is small
            path.eventHistory.push(`shot (${weapon.name})`)
          } else if (i === 1) {
            path.eventHistory[path.eventHistory.length - 1] = `${count}xshot (${weapon.name})`
          }
        } else if (event.type === 'heal') {
          const item = HEALING_ITEMS.find(h => h.id === event.itemId)
          if (item) {
            path.health = Math.min(path.health + item.healing, 100)
            if (i === 0) path.eventHistory.push(count > 1 ? `${count}xheal (${item.name})` : `heal (${item.name})`)
          }
        } else if (event.type === 'shield') {
          const item = SHIELD_ITEMS.find(s => s.id === event.itemId)
          const maxShield = getCurrentShieldType()?.shieldCharge || 200
          if (item) {
            path.shield = Math.min(path.shield + item.shieldRestore, maxShield)
            if (i === 0) path.eventHistory.push(count > 1 ? `${count}xshield (${item.name})` : `shield (${item.name})`)
          }
        } else if (event.type === 'nothing') {
          if (i === 0) path.eventHistory.push(count > 1 ? `${count}xnothing` : 'nothing')
        }

        if (i === count - 1) { // Only add data point after all repetitions
          path.data.push({
            eventIndex: eventIndex,
            health: Math.max(0, path.health),
            shield: path.shield,
            totalHp: Math.max(0, path.health + path.shield),
            label: event.label || `Event ${eventIndex}`
          })
        }
      }
    }
  }

  // Toggle multiplier UI for an event
  const toggleMultiplier = (eventId) => {
    setExpandedMultipliers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }

  // Drag and drop handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    // Just track where we're hovering, don't update the array yet
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    // Only update timeline when drag ends
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newTimeline = [...timeline]
      const draggedItem = newTimeline[draggedIndex]

      // Remove from old position
      newTimeline.splice(draggedIndex, 1)
      // Insert at new position
      newTimeline.splice(dragOverIndex, 0, draggedItem)

      setTimeline(newTimeline)
    }

    // Clear drag state
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // Timeline manipulation functions
  const addEvent = (type) => {
    const lastWeapon = getLastUsedWeapon()
    const newEvent = {
      id: nextEventId,
      type: type, // 'shot', 'heal', 'shield', 'nothing'
      weaponId: type === 'shot' ? lastWeapon : undefined,
      itemId: type === 'heal' ? DEFAULTS.healItem : type === 'shield' ? DEFAULTS.shieldItem : undefined,
      count: 1,
      label: type === 'shot' ? `Shot ${nextEventId}` : type === 'heal' ? 'Heal' : type === 'shield' ? 'Shield Recharge' : 'Nothing'
    }
    setTimeline([...timeline, newEvent])
    setNextEventId(nextEventId + 1)
  }

  const addSplitEvent = (eventIndex) => {
    const lastWeapon = getLastUsedWeapon()
    const newTimeline = [...timeline]
    const splitEvent = {
      id: nextEventId,
      type: 'split',
      label: 'Split',
      branches: [
        {
          id: nextEventId + 1,
          label: 'Option A',
          events: [
            { id: nextEventId + 2, type: 'shot', weaponId: lastWeapon, count: 1 }
          ]
        },
        {
          id: nextEventId + 3,
          label: 'Option B',
          events: [
            { id: nextEventId + 4, type: 'shot', weaponId: lastWeapon, count: 1 }
          ]
        }
      ]
    }
    newTimeline.splice(eventIndex + 1, 0, splitEvent)
    setTimeline(newTimeline)
    setNextEventId(nextEventId + 5)
  }

  const updateEvent = (eventId, updates) => {
    setTimeline(timeline.map(event => {
      if (event.id === eventId) {
        return { ...event, ...updates }
      }
      if (event.type === 'split' && event.branches) {
        return {
          ...event,
          branches: event.branches.map(branch =>
            branch.id === eventId ? { ...branch, ...updates } : branch
          )
        }
      }
      return event
    }))
  }

  const removeEvent = (eventId) => {
    setTimeline(timeline.filter(event => event.id !== eventId))
  }

  const addBranchToSplit = (splitEventId) => {
    const lastWeapon = getLastUsedWeapon()
    setTimeline(timeline.map(event => {
      if (event.id === splitEventId && event.type === 'split') {
        return {
          ...event,
          branches: [
            ...event.branches,
            {
              id: nextEventId,
              label: `Option ${String.fromCharCode(65 + event.branches.length)}`,
              events: [
                { id: nextEventId + 1, type: 'shot', weaponId: lastWeapon, count: 1 }
              ]
            }
          ]
        }
      }
      return event
    }))
    setNextEventId(nextEventId + 2)
  }

  const addEventToBranch = (splitEventId, branchId, eventType) => {
    const lastWeapon = getLastUsedWeapon()
    setTimeline(timeline.map(event => {
      if (event.id === splitEventId && event.type === 'split') {
        return {
          ...event,
          branches: event.branches.map(branch => {
            if (branch.id === branchId) {
              const newEvent = {
                id: nextEventId,
                type: eventType,
                weaponId: eventType === 'shot' ? lastWeapon : undefined,
                itemId: eventType === 'heal' ? DEFAULTS.healItem : eventType === 'shield' ? DEFAULTS.shieldItem : undefined,
                count: 1
              }
              return {
                ...branch,
                events: [...branch.events, newEvent]
              }
            }
            return branch
          })
        }
      }
      return event
    }))
    setNextEventId(nextEventId + 1)
  }

  const removeEventFromBranch = (splitEventId, branchId, eventId) => {
    setTimeline(timeline.map(event => {
      if (event.id === splitEventId && event.type === 'split') {
        return {
          ...event,
          branches: event.branches.map(branch => {
            if (branch.id === branchId) {
              const newEvents = branch.events.filter(e => e.id !== eventId)
              // Keep at least one event
              if (newEvents.length === 0) {
                return branch
              }
              return {
                ...branch,
                events: newEvents
              }
            }
            return branch
          })
        }
      }
      return event
    }))
  }

  const updateBranchEvent = (splitEventId, branchId, eventId, updates) => {
    setTimeline(timeline.map(event => {
      if (event.id === splitEventId && event.type === 'split') {
        return {
          ...event,
          branches: event.branches.map(branch => {
            if (branch.id === branchId) {
              return {
                ...branch,
                events: branch.events.map(e => e.id === eventId ? { ...e, ...updates } : e)
              }
            }
            return branch
          })
        }
      }
      return event
    }))
  }

  const updateBranch = (splitEventId, branchId, updates) => {
    setTimeline(timeline.map(event => {
      if (event.id === splitEventId && event.type === 'split') {
        return {
          ...event,
          branches: event.branches.map(branch =>
            branch.id === branchId ? { ...branch, ...updates } : branch
          )
        }
      }
      return event
    }))
  }

  const removeBranch = (splitEventId, branchId) => {
    setTimeline(timeline.map(event => {
      if (event.id === splitEventId && event.type === 'split') {
        return {
          ...event,
          branches: event.branches.filter(b => b.id !== branchId)
        }
      }
      return event
    }))
  }

  const handleShieldTypeChange = (e) => {
    const shieldTypeId = e.target.value
    setSelectedShieldType(shieldTypeId)

    if (shieldTypeId) {
      const shieldType = SHIELD_TYPES.find(s => s.id === shieldTypeId)
      if (shieldType) {
        setCurrentShield(shieldType.shieldCharge)
      }
    } else {
      setCurrentShield(0)
    }
  }

  const getCurrentShieldType = () => {
    return SHIELD_TYPES.find(s => s.id === selectedShieldType)
  }

  const currentShieldMitigation = getCurrentShieldType()?.damageMitigation || 0

  // Helper to get clientX from mouse or touch event
  const getClientX = (e) => {
    if (e.touches && e.touches.length > 0) {
      return e.touches[0].clientX
    }
    return e.clientX
  }

  // Handle dragging for health bar
  const handleHealthDrag = (e) => {
    if (!isDraggingHealth) return
    const bar = e.currentTarget
    const rect = bar.getBoundingClientRect()
    const clickX = getClientX(e) - rect.left
    const barWidth = rect.width
    const percentage = Math.max(1, Math.min(100, Math.round((clickX / barWidth) * 100)))
    setCurrentHealth(percentage)
  }

  const handleShieldDrag = (e) => {
    if (!isDraggingShield) return
    const bar = e.currentTarget
    const rect = bar.getBoundingClientRect()
    const clickX = getClientX(e) - rect.left
    const barWidth = rect.width
    const maxShield = getCurrentShieldType().shieldCharge
    const value = Math.max(0, Math.min(maxShield, Math.round((clickX / barWidth) * maxShield)))
    setCurrentShield(value)
  }

  // Handle initial click/touch for health bar
  const handleHealthStart = (e) => {
    const bar = e.currentTarget
    setIsDraggingHealth(true)
    const rect = bar.getBoundingClientRect()
    const clickX = getClientX(e) - rect.left
    const barWidth = rect.width
    const percentage = Math.max(1, Math.min(100, Math.round((clickX / barWidth) * 100)))
    setCurrentHealth(percentage)
    e.preventDefault()
  }

  // Handle initial click/touch for shield bar
  const handleShieldStart = (e) => {
    const bar = e.currentTarget
    setIsDraggingShield(true)
    const rect = bar.getBoundingClientRect()
    const clickX = getClientX(e) - rect.left
    const barWidth = rect.width
    const maxShield = getCurrentShieldType().shieldCharge
    const value = Math.max(0, Math.min(maxShield, Math.round((clickX / barWidth) * maxShield)))
    setCurrentShield(value)
    e.preventDefault()
  }

  // Stop dragging on mouse/touch up
  useEffect(() => {
    const handleEnd = () => {
      setIsDraggingHealth(false)
      setIsDraggingShield(false)
    }
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchend', handleEnd)
    window.addEventListener('touchcancel', handleEnd)
    return () => {
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchend', handleEnd)
      window.removeEventListener('touchcancel', handleEnd)
    }
  }, [])

  // Reset to defaults
  const resetToDefaults = () => {
    // Clear URL first to prevent it from reloading state
    window.history.replaceState({}, '', window.location.pathname)

    // Reset all state
    setCurrentHealth(100)
    setCurrentShield(SHIELD_TYPES.find(s => s.id === DEFAULTS.shieldType)?.shieldCharge || 0)
    setSelectedShieldType(DEFAULTS.shieldType)
    setTimeline([{ id: 1, type: 'shot', weaponId: DEFAULTS.weapon, label: 'Shot 1', count: 1 }])
    setNextEventId(2)
    setExpandedMultipliers(new Set())
    setDraggedIndex(null)
    setDragOverIndex(null)
    setShowSeparateHealthShield(false)
  }

  // Simulate all paths through the timeline
  const paths = simulateHealthOverEvents(currentHealth, currentShield, currentShieldMitigation, timeline)

  return (
    <div>
      <h1
        onClick={resetToDefaults}
        style={{ cursor: 'pointer' }}
        title="Click to reset calculator"
      >
        Arc Raiders Damage Calculator
      </h1>

      <div className="calculator">
        <div className="section">
          <div className="input-group">
            <label htmlFor="shieldType">Equipped Shield Type:</label>
            <ImageSelect
              value={selectedShieldType}
              onChange={handleShieldTypeChange}
              placeholder="No Shield"
              options={[
                { value: '', label: 'No Shield', image: null },
                ...SHIELD_TYPES.map(shield => ({
                  value: shield.id,
                  label: `${shield.name} (${shield.shieldCharge} charge, ${shield.damageMitigation}% mitigation)`,
                  image: shield.image
                }))
              ]}
            />
            {getCurrentShieldType() && (
              <p style={{ color: '#a0a0a0', fontSize: '14px', marginTop: '5px' }}>
                {getCurrentShieldType().description}
              </p>
            )}
          </div>

          {getCurrentShieldType() && (
            <div className="input-group">
              <label htmlFor="shield">
                Shield Health: {currentShield} / {getCurrentShieldType().shieldCharge}
              </label>
              <div 
                className="slider-bar clickable"
                onMouseDown={handleShieldStart}
                onTouchStart={handleShieldStart}
                onMouseMove={handleShieldDrag}
                onTouchMove={handleShieldDrag}
                onMouseUp={() => setIsDraggingShield(false)}
                onTouchEnd={() => setIsDraggingShield(false)}
                onMouseLeave={() => setIsDraggingShield(false)}
                style={{ cursor: isDraggingShield ? 'grabbing' : 'pointer', touchAction: 'none' }}
                title="Click or drag to set shield"
              >
                <div
                  className="slider-bar-fill shield-bar"
                  style={{ width: `${(currentShield / getCurrentShieldType().shieldCharge) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="health">Current Health: {currentHealth} HP</label>
            <div 
              className="slider-bar clickable no-segments"
              onMouseDown={handleHealthStart}
              onTouchStart={handleHealthStart}
              onMouseMove={handleHealthDrag}
              onTouchMove={handleHealthDrag}
              onMouseUp={() => setIsDraggingHealth(false)}
              onTouchEnd={() => setIsDraggingHealth(false)}
              onMouseLeave={() => setIsDraggingHealth(false)}
              style={{ cursor: isDraggingHealth ? 'grabbing' : 'pointer', touchAction: 'none' }}
              title="Click or drag to set health"
            >
              <div
                className="slider-bar-fill health-bar"
                style={{ width: `${currentHealth}%` }}
              />
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Event Timeline</h2>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', flexWrap: 'wrap' }}>
            <button onClick={() => addEvent('shot')}>
              + Shot
            </button>
            <button onClick={() => addEvent('heal')}>
              + Heal
            </button>
            <button onClick={() => addEvent('shield')}>
              + Shield
            </button>
          </div>
          <div className="timeline-container">
            {timeline.map((event, index) => (
              <div
                key={event.id}
                className="timeline-event"
                onDragOver={(e) => handleDragOver(e, index)}
                style={{
                  opacity: draggedIndex === index ? 0.5 : 1,
                  transform: dragOverIndex === index && draggedIndex !== index ? 'scale(1.02)' : 'scale(1)',
                  transition: 'opacity 0.2s, transform 0.2s',
                  outline: dragOverIndex === index && draggedIndex !== index ? '2px solid #00d4ff' : 'none',
                  borderRadius: '8px'
                }}
              >
                {/* Drag Handle */}
                <div
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  className="drag-handle"
                  title="Drag to reorder"
                >
                  ⋮⋮
                </div>
                <div className="event-card">
                {event.type === 'split' ? (
                  <div className="split-event">
                    <div className="split-header">
                      <strong style={{ color: 'var(--color-warning)' }}>Split Event</strong>
                      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                        <button onClick={() => addBranchToSplit(event.id)} style={{ fontSize: '0.75rem' }}>
                          + Branch
                        </button>
                        <button onClick={() => removeEvent(event.id)} style={{ fontSize: '0.75rem', background: 'var(--color-danger)' }}>
                          Remove Split
                        </button>
                      </div>
                    </div>
                    <div className="split-branches">
                      {event.branches.map((branch, branchIdx) => (
                        <div key={branch.id} className="branch-card">
                          <div className="branch-header">
                            <input
                              type="text"
                              value={branch.label}
                              onChange={(e) => updateBranch(event.id, branch.id, { label: e.target.value })}
                              style={{ flex: '1', minWidth: '120px', padding: '0.5rem', fontWeight: 'bold' }}
                              placeholder="Label"
                            />
                            {event.branches.length > 2 && (
                              <button onClick={() => removeBranch(event.id, branch.id)} style={{ fontSize: '0.75rem', padding: '0.5rem', background: 'var(--color-danger)' }}>
                                Remove Branch
                              </button>
                            )}
                          </div>

                          {/* Events within this branch */}
                          <div className="branch-events">
                            {branch.events.map((branchEvent, eventIdx) => (
                              <div key={branchEvent.id} className="branch-event-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
                                  <span style={{ color: '#888', fontSize: '0.75rem', minWidth: '18px', fontWeight: 'bold' }}>{eventIdx + 1}.</span>

                                  {(branchEvent.count || 1) > 1 && (
                                    <button
                                      onClick={() => toggleMultiplier(branchEvent.id)}
                                      style={{
                                        padding: '0.25rem 0.5rem',
                                        fontSize: '0.75rem',
                                        background: expandedMultipliers.has(branchEvent.id) ? 'var(--color-primary)' : '#555'
                                      }}
                                    >
                                      {branchEvent.count}x
                                    </button>
                                  )}
                                </div>

                                <div className="event-row">
                                  <select
                                    value={branchEvent.type}
                                    onChange={(e) => updateBranchEvent(event.id, branch.id, branchEvent.id, {
                                      type: e.target.value,
                                      weaponId: e.target.value === 'shot' ? getLastUsedWeapon() : undefined,
                                      itemId: e.target.value === 'heal' ? DEFAULTS.healItem : e.target.value === 'shield' ? DEFAULTS.shieldItem : undefined
                                    })}
                                    style={{ width: '100%' }}
                                  >
                                    <option value="shot">Shot</option>
                                    <option value="heal">Heal</option>
                                    <option value="shield">Shield</option>
                                    <option value="nothing">Nothing</option>
                                  </select>
                                </div>

                                {branchEvent.type === 'shot' && (
                                  <div className="event-row">
                                    <ImageSelect
                                      value={branchEvent.weaponId || getLastUsedWeapon()}
                                      onChange={(e) => updateBranchEvent(event.id, branch.id, branchEvent.id, { weaponId: e.target.value })}
                                      placeholder="Select weapon..."
                                      options={WEAPONS.sort((a, b) => b.damage - a.damage).map(weapon => ({
                                        value: weapon.id,
                                        label: `${weapon.name} (${weapon.damage} dmg)`,
                                        image: weapon.image
                                      }))}
                                    />
                                  </div>
                                )}

                                {branchEvent.type === 'heal' && (
                                  <div className="event-row">
                                    <select
                                      value={branchEvent.itemId || DEFAULTS.healItem}
                                      onChange={(e) => updateBranchEvent(event.id, branch.id, branchEvent.id, { itemId: e.target.value })}
                                      style={{ width: '100%' }}
                                    >
                                      {HEALING_ITEMS.map(item => (
                                        <option key={item.id} value={item.id}>
                                          {item.name} (+{item.healing} HP)
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}

                                {branchEvent.type === 'shield' && (
                                  <div className="event-row">
                                    <select
                                      value={branchEvent.itemId || DEFAULTS.shieldItem}
                                      onChange={(e) => updateBranchEvent(event.id, branch.id, branchEvent.id, { itemId: e.target.value })}
                                      style={{ width: '100%' }}
                                    >
                                      {SHIELD_ITEMS.map(item => (
                                        <option key={item.id} value={item.id}>
                                          {item.name} (+{item.shieldRestore})
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}

                                <div style={{ display: 'flex', gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-xs)' }}>
                                  {(branchEvent.count || 1) === 1 && (
                                    <button
                                      onClick={() => {
                                        updateBranchEvent(event.id, branch.id, branchEvent.id, { count: 2 })
                                        toggleMultiplier(branchEvent.id)
                                      }}
                                      style={{ fontSize: '0.75rem', flex: 1, background: '#555' }}
                                    >
                                      Multiple
                                    </button>
                                  )}

                                  {branch.events.length > 1 && (
                                    <button onClick={() => removeEventFromBranch(event.id, branch.id, branchEvent.id)} style={{ fontSize: '0.75rem', padding: '0.5rem', background: 'var(--color-danger)' }}>
                                      Remove
                                    </button>
                                  )}
                                </div>

                                {expandedMultipliers.has(branchEvent.id) && (
                                  <div style={{ marginTop: 'var(--spacing-xs)', padding: 'var(--spacing-sm)', background: 'rgba(0,212,255,0.1)', borderRadius: 'var(--radius-sm)' }}>
                                    <label style={{ display: 'block', color: 'var(--color-primary)', fontSize: '0.75rem', marginBottom: 'var(--spacing-xs)', fontWeight: '600' }}>
                                      Repeat: {branchEvent.count || 1}x
                                    </label>
                                    <input
                                      type="range"
                                      min="1"
                                      max="10"
                                      value={branchEvent.count || 1}
                                      onChange={(e) => updateBranchEvent(event.id, branch.id, branchEvent.id, { count: parseInt(e.target.value) })}
                                      style={{ width: '100%' }}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Add event buttons */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-sm)' }}>
                              <button onClick={() => addEventToBranch(event.id, branch.id, 'shot')} style={{ fontSize: '0.75rem' }}>
                                + Shot
                              </button>
                              <button onClick={() => addEventToBranch(event.id, branch.id, 'heal')} style={{ fontSize: '0.75rem' }}>
                                + Heal
                              </button>
                              <button onClick={() => addEventToBranch(event.id, branch.id, 'shield')} style={{ fontSize: '0.75rem' }}>
                                + Shield
                              </button>
                              <button onClick={() => addEventToBranch(event.id, branch.id, 'nothing')} style={{ fontSize: '0.75rem' }}>
                                + Nothing
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="event-controls">
                    {/* Event Header */}
                    <div className="event-row" style={{ marginBottom: 'var(--spacing-sm)' }}>
                      <span className="event-label">Event {index + 1}</span>
                      {(event.count || 1) > 1 && (
                        <button
                          onClick={() => toggleMultiplier(event.id)}
                          style={{
                            background: expandedMultipliers.has(event.id) ? 'var(--color-primary)' : '#555',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.75rem'
                          }}
                          title="Toggle multiplier"
                        >
                          {event.count}x
                        </button>
                      )}
                    </div>

                    {/* Event Type Selection */}
                    <div className="event-row">
                      <select
                        value={event.type}
                        onChange={(e) => updateEvent(event.id, {
                          type: e.target.value,
                          weaponId: e.target.value === 'shot' ? getLastUsedWeapon() : undefined,
                          itemId: e.target.value === 'heal' ? DEFAULTS.healItem : e.target.value === 'shield' ? DEFAULTS.shieldItem : undefined
                        })}
                        style={{ width: '100%' }}
                      >
                        <option value="shot">Shot</option>
                        <option value="heal">Heal</option>
                        <option value="shield">Shield</option>
                      </select>
                    </div>

                    {/* Item/Weapon Selection */}
                    {event.type === 'shot' && (
                      <div className="event-row">
                        <ImageSelect
                          value={event.weaponId || getLastUsedWeapon()}
                          onChange={(e) => updateEvent(event.id, { weaponId: e.target.value })}
                          placeholder="Select weapon..."
                          options={WEAPONS.sort((a, b) => b.damage - a.damage).map(weapon => ({
                            value: weapon.id,
                            label: `${weapon.name} (${weapon.damage} dmg)`,
                            image: weapon.image
                          }))}
                        />
                      </div>
                    )}
                    {event.type === 'heal' && (
                      <div className="event-row">
                        <ImageSelect
                          value={event.itemId || DEFAULTS.healItem}
                          onChange={(e) => updateEvent(event.id, { itemId: e.target.value })}
                          placeholder="Select healing item..."
                          options={HEALING_ITEMS.map(item => ({
                            value: item.id,
                            label: `${item.name} (+${item.healing} HP)`,
                            image: item.image
                          }))}
                        />
                      </div>
                    )}
                    {event.type === 'shield' && (
                      <div className="event-row">
                        <ImageSelect
                          value={event.itemId || DEFAULTS.shieldItem}
                          onChange={(e) => updateEvent(event.id, { itemId: e.target.value })}
                          placeholder="Select shield item..."
                          options={SHIELD_ITEMS.map(item => ({
                            value: item.id,
                            label: `${item.name} (+${item.shieldRestore})`,
                            image: item.image
                          }))}
                        />
                      </div>
                    )}

                    {/* Multiplier Control */}
                    {expandedMultipliers.has(event.id) && (
                      <div style={{ padding: 'var(--spacing-md)', background: 'rgba(0,212,255,0.15)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-primary)' }}>
                        <label style={{ display: 'block', color: 'var(--color-primary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', fontWeight: '600' }}>
                          Repeat: {event.count || 1}x
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={event.count || 1}
                          onChange={(e) => updateEvent(event.id, { count: parseInt(e.target.value) })}
                          style={{ width: '100%' }}
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="event-actions">
                      {(event.count || 1) === 1 && (
                        <button
                          onClick={() => {
                            updateEvent(event.id, { count: 2 })
                            toggleMultiplier(event.id)
                          }}
                          style={{ background: '#555' }}
                          title="Add multiplier"
                        >
                          Multiple
                        </button>
                      )}
                      <button onClick={() => addSplitEvent(index)} style={{ background: 'var(--color-warning)' }}>
                        Split Here
                      </button>
                      <button onClick={() => removeEvent(event.id)} style={{ background: 'var(--color-danger)' }}>
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="results">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#00d4ff' }}>
              <input
                type="checkbox"
                checked={showSeparateHealthShield}
                onChange={(e) => setShowSeparateHealthShield(e.target.checked)}
              />
              Show Health and Shield Separately
            </label>
          </div>
          <HealthOverEventsGraph paths={paths} showSeparate={showSeparateHealthShield} />
        </div>
      </div>
    </div>
  )
}

export default App

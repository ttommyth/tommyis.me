'use client'
import React, { useState, useEffect } from 'react'
import { directionIcons, Step, stepsAct1, stepsAct2, stepsAct3, stepsAct4, stepsAct5, stepsAct6, stepsEndgame } from '@/data/guideData'

type StepItemProps = Step & { stepKey: string; completed?: boolean; onToggle: (key: string) => void }

// helper to inline-highlight names in text
function parseStepText(text: string, areas: string[], npcs: string[], enemies: string[]) {
  const allKeys = [...areas, ...npcs, ...enemies]
  if (allKeys.length === 0) return [text]
  // escape for regex
  const escaped = allKeys.map(k => k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
  const pattern = new RegExp(`(${escaped.join('|')})`, 'g')
  const parts = text.split(pattern)
  return parts.map((part, i) => {
    if (areas.includes(part)) {
      const isLast = part === areas[areas.length - 1]
      return <span key={i} className="text-primary-500">🗺️ {isLast ? <strong>{part}</strong> : part}</span>
    }
    if (npcs.includes(part)) {
      return <span key={i} className="text-secondary-500">🧍‍♂️{part}</span>
    }
    if (enemies.includes(part)) {
      return <span key={i} className="text-red-500">🐉 {part}</span>
    }
    return part
  })
}

function StepItem({ text, areas = [], npcs = [], enemies = [], direction, stepKey, completed = false, onToggle }: StepItemProps) {
  return (
    <li
      onClick={() => onToggle(stepKey)}
      className={`px-4 py-2 cursor-pointer flex flex-col ${completed ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start">
        {/* fixed-width arrow column; show icon component or leave blank for alignment */}
        <span className="flex-shrink-0 mr-2 w-12 h-6 text-center">
          {direction && directionIcons[direction]}
        </span>
        <p className="flex-1">{parseStepText(text, areas, npcs, enemies)}</p>
      </div>
      {/* inline highlights applied in paragraph, no separate tags needed */}
    </li>
  )
}

// define acts array to support multiple acts
const acts = [
  { title: 'Act 1', steps: stepsAct1 },
  { title: 'Act 2', steps: stepsAct2 },
  { title: 'Act 3', steps: stepsAct3 },
  { title: 'Act 4', steps: stepsAct4 },
  { title: 'Act 5', steps: stepsAct5 },
  { title: 'Act 6', steps: stepsAct6 },
  { title: 'Endgame', steps: stepsEndgame },
];

export default function LevelingGuideClient() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  useEffect(() => {
    const saved = localStorage.getItem('levelingGuideCompleted')
    if (saved) setCompleted(JSON.parse(saved))
  }, [])

  const toggleStep = (key: string) => {
    setCompleted(prev => {
      const updated = { ...prev, [key]: !prev[key] }
      localStorage.setItem('levelingGuideCompleted', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div className="mx-auto px-4 pb-8 pt-20">
      <h1>Last Epoch Leveling Guide</h1>
      {acts.map((act, aIdx) => (
        <div key={act.title} className="mt-8 px-4">
          <h2 className="text-2xl font-bold border-b pb-1 mb-4">{act.title}</h2>
          <ul className="divide-y divide-gray-200 divide-dashed">
            {act.steps.map((step, sIdx) => {
              const key = `${aIdx}-${sIdx}`
              return (
                <StepItem
                  key={key}
                  stepKey={key}
                  completed={completed[key]}
                  onToggle={toggleStep}
                  {...step}
                />
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

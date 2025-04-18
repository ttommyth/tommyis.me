'use client'
import React, { useState, useEffect } from 'react'
import { directionEmojis, Step, stepsAct1, stepsAct2, stepsAct3, stepsAct4, stepsAct5, stepsAct6, stepsEndgame } from '@/helper/guideData'



type StepItemProps = Step & { stepKey: string; completed?: boolean; onToggle: (key: string) => void }
function StepItem({ text, area, direction, stepKey, completed = false, onToggle }: StepItemProps) {
  // Inline replace area using {area} placeholder
  const [before, after] = text.split('{area}');
  return (
    <li
      onClick={() => onToggle(stepKey)}
      className={`px-4 py-2 cursor-pointer flex items-start ${completed ? 'opacity-50' : ''}`}
    >
      {/* fixed-width arrow column; show emoji or leave blank for alignment */}
      <span className="flex-shrink-0 mr-2 w-6 text-center">
        {direction && <span role="img" aria-label={direction}>{directionEmojis[direction]}</span>}
      </span>
      <div className="flex-1">
        {before}
        {area && (
          <span className="inline-flex items-center">
            <span role="img" aria-label="map">🗺️</span>
            <strong>{area}</strong>
          </span>
        )}
        {after}
      </div>
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
    <div className="mx-auto px-4 py-8">
      <h1>Last Epoch Leveling Guide</h1>
      {acts.map((act, aIdx) => (
        <div key={act.title} className="mt-8 px-4">
          <h2 className="text-2xl font-bold border-b pb-1 mb-4">{act.title}</h2>
          <ul className="divide-y divide-gray-200">
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

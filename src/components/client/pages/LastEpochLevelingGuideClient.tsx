'use client'
import React, { useState, useEffect } from 'react'
import { directionIcons, Step, stepsAct1, stepsAct2, stepsAct3, stepsAct4, stepsAct5, stepsAct6, stepsEndgame } from '@/data/lastEpochGuideData'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from "framer-motion"
import { twMerge } from "tailwind-merge"

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
      className={`px-4 py-2 cursor-pointer flex flex-col ${completed ? 'opacity-50' : ''} transition-opacity`}
    >
      <div className="flex items-start gap-2">
        {/* fixed-width arrow column; show icon component or leave blank for alignment */}
        <span className="flex-shrink-0 w-12">
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
  const [expandedActs, setExpandedActs] = useState<Record<number, boolean>>({})
  
  useEffect(() => {
    const saved = localStorage.getItem('levelingGuideCompleted')
    if (saved) setCompleted(JSON.parse(saved))
    
    // Initialize all acts as expanded
    const initialExpanded = acts.reduce((acc, _, idx) => {
      acc[idx] = true;
      return acc;
    }, {} as Record<number, boolean>);
    setExpandedActs(initialExpanded);
  }, [])

  const toggleStep = (key: string) => {
    setCompleted(prev => {
      const updated = { ...prev, [key]: !prev[key] }
      localStorage.setItem('levelingGuideCompleted', JSON.stringify(updated))
      return updated
    })
  }

  const toggleActExpansion = (actIndex: number) => {
    setExpandedActs(prev => ({
      ...prev,
      [actIndex]: !prev[actIndex]
    }))
  }

  const clearAllCompleted = () => {
    setCompleted({})
    localStorage.removeItem('levelingGuideCompleted')
  }

  return (
    <div className="mx-auto px-4 pb-8 pt-20 flex flex-col gap-2 min-h-screen">
      <h1>Last Epoch Leveling Guide</h1>
      <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm">
          This guide is based on the{" "}
          <a 
            href="https://www.reddit.com/r/LastEpoch/comments/1jzwp5w/speed_leveling_the_campaign_to_act_7_written_guide/"
            className="text-blue-600 dark:text-blue-400 hover:underline" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Speed Leveling the Campaign to Act 7 Written Guide
          </a>. 
          Special thanks to <strong>u/CrazyGermanTeacher</strong> for creating the original text guide.
        </p>
      </div>
          
      <div className="flex justify-end">
        <button 
          onClick={clearAllCompleted}
          className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
        >
            Clear All Progress
        </button>
      </div>    
      {acts.map((act, aIdx) => (
        <div key={act.title} className="mt-8 px-4">
          <h2 className="text-2xl font-bold mb-2">{act.title}</h2>
          <motion.div     
            className="w-full h-auto border-default border-2 border-solid aria-expanded:border-style-expand rounded-md flex flex-col items-center bg-dotted" 
            aria-expanded={expandedActs[aIdx]}
          >
            <motion.header
              initial={false}
              className="flex flex-row justify-center w-full bg-default border-default border-dashed aria-expanded:border-b-2 aria-expanded:rounded-b-none cursor-pointer rounded-md group"
              onClick={() => toggleActExpansion(aIdx)}
              aria-expanded={expandedActs[aIdx]}
            >
              <motion.div 
                className="group-interact"
                animate={{ rotate: expandedActs[aIdx] ? "180deg" : "0deg" }}
              >
                <ChevronDownIcon className="w-icon h-icon text-default-invert" />
              </motion.div>
            </motion.header>

            <AnimatePresence initial={false}>
              {expandedActs[aIdx] && (
                <motion.section
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 }
                  }}
                  transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className={twMerge("w-full overflow-y-hidden")}
                >
                  <div className="p-2 sm:p-4">
                    <ul className="divide-y divide-invert-default divide-dashed">
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
                </motion.section>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      ))}
    </div>
  )
}

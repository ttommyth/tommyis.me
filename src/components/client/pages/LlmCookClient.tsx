'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import * as webllm from '@mlc-ai/web-llm';
import yaml from 'js-yaml';
import * as emoji from 'node-emoji';
import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// --- Constants (Moved to top level) ---

const MODEL_ID = 'gemma-2-2b-it-q4f16_1-MLC-1k';
const PROMPT_TEMPLATE = `
<system>
You are a cooking assistant in a sandbox game. A user combines ingredients and applies a cooking step.

Rules:
1. Always describe the action, even if it's illogical (e.g. chopping water).
2. When the ingredients and step produce a good edible dish, invent a creative dish name.
3. Do not skip step and produce a dish without necessary ingredients and steps.
4. Reply in valid YAML with exactly these fields:
   name:   // Dish name or combined ingredients (e.g. "Beef Burger", "Fried Potato")
   color:  // Hex color of the result
   emoji:  // Emoji tag for the dish
   description: // One-sentence summary
   history:     // One-sentence account of how it was made
   recipe:      // One-sentence cooking instruction

Example:
Ingredients: Potato, Oil
Step: Fry
Result:
\`\`\`yaml
name: "Potato Chips"
color: "#ffa500"
emoji: ":potato_chips:"
description: "A crispy snack made from fried potatoes."
history: "Potatoes were fried in oil until golden brown."
recipe: "Fry potato slices in oil until golden."
\`\`\`
</system>

Ingredients: {ingredients}
Step: {step}
Result:
`;

// --- Type Definitions (Moved LLMResult here) ---
interface Ingredient {
  id: string;
  name: string;
  icon: string;
  type: 'base' | 'derived';
  recipe?: {
    inputIds: string[];
    stepId: CookingStepId;
  };
  color?: string;
  emoji?: string;
  llmDescription?: string;
  llmHistory?: string;
  llmRecipe?: string;
}

// Result structure expected from LLM YAML parsing
interface LLMResult {
  name: string;
  color: string;
  emoji: string;
  description: string;
  history: string;
  recipe: string;
}

// Initial list of base ingredients based on the plan
const initialBaseIngredients: Ingredient[] = [
  { id: 'egg', name: 'Egg', icon: '🥚', type: 'base' },
  { id: 'flour', name: 'Flour', icon: '🌾', type: 'base' }, // Changed icon for clarity
  { id: 'water', name: 'Water', icon: '💧', type: 'base' },
  { id: 'potato', name: 'Potato', icon: '🥔', type: 'base' },
  { id: 'onion', name: 'Onion', icon: '🧅', type: 'base' },
  { id: 'oil', name: 'Oil', icon: '🏺', type: 'base' }, // Changed icon for clarity
  { id: 'chicken', name: 'Chicken Breast', icon: '🍗', type: 'base' },
  { id: 'salt', name: 'Salt', icon: '🧂', type: 'base' },
];

// Define the available cooking steps
const cookingSteps = [
  { id: 'chop', name: 'Chop', icon: '🔪' },
  { id: 'mix', name: 'Mix', icon: '🥣' },
  { id: 'boil', name: 'Boil', icon: '🔥' },
  { id: 'fry', name: 'Fry', icon: '🍳' },
  { id: 'bake', name: 'Bake', icon: '🧱' }, // Using brick for Bake/Roast oven
];

type CookingStepId = (typeof cookingSteps)[number]['id'];

// --- IngredientDetailPanel Component (Adapted for Modal) ---
interface IngredientDetailPanelProps {
  ingredient: Ingredient; // Now non-nullable as it won't render otherwise
  allItemsMap: Map<string, Ingredient>;
  onClose: () => void;
}

function IngredientDetailPanel({
  ingredient,
  allItemsMap,
  onClose,
}: IngredientDetailPanelProps) {
  // No need for null check here anymore

  const displayEmoji = ingredient.emoji || ingredient.icon;
  const textColor = ingredient.color
    ? getContrastYIQ(ingredient.color)
    : 'black'; // Keep black for default modal text for now

  // Recipe string logic remains the same
  let recipeString = 'Base ingredient.';
  if (ingredient.type === 'derived') {
    if (ingredient.llmRecipe) {
      recipeString = `LLM Recipe: ${ingredient.llmRecipe}`;
    } else if (ingredient.recipe) {
      const { inputIds, stepId } = ingredient.recipe;
      const inputNames = inputIds
        .map((id) => allItemsMap.get(id)?.name ?? '?')
        .join(' + ');
      const stepName =
        cookingSteps.find((s) => s.id === stepId)?.name || stepId;
      recipeString = `Basic Recipe: ${inputNames} + ${stepName}`;
    } else {
      recipeString = 'Recipe unknown.';
    }
  }

  return (
    // Modal Wrapper
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose} // Close modal if background is clicked
    >
      {/* Modal Content - Remove explicit bg/text */}
      <div
        className="relative rounded-lg shadow-xl p-6 w-full max-w-md bg-base-200 dark:bg-base-800" // Removed bg-base-200, text-current
        onClick={(e) => e.stopPropagation()}
        // Apply dynamic color style ONLY if present
        style={
          ingredient.color
            ? {
                backgroundColor: ingredient.color,
                color: getContrastYIQ(ingredient.color),
              }
            : {}
        }
      >
        {/* Close Button (Top Right) - Keep red palette */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-red-50 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>

        {/* Ingredient Header - Style applies dynamic color */}
        <h2
          className="text-xl font-semibold flex items-center gap-3 mb-4"
          style={{ color: textColor }}
        >
          <span className="text-3xl">{displayEmoji}</span>
          {ingredient.name}
        </h2>

        {/* Details Section - Inherits color from style */}
        <div className="space-y-2 text-sm">
          <p>
            <strong>Type:</strong> {ingredient.type}
          </p>
          {ingredient.llmDescription && (
            <p>
              <strong>Description:</strong> {ingredient.llmDescription}
            </p>
          )}
          {ingredient.llmHistory && (
            <p>
              <strong>History:</strong> {ingredient.llmHistory}
            </p>
          )}
          <p>
            <strong>Recipe Info:</strong> {recipeString}
          </p>
          {/* Add more details as needed */}
        </div>
      </div>
    </div>
  );
}

// --- IngredientItem Component ---
interface IngredientItemProps {
  ingredient: Ingredient;
  allItemsMap: Map<string, Ingredient>;
  onClick: (id: string) => void; // Add onClick handler prop
}

// Helper function to determine text color based on background luminance
function getContrastYIQ(hexcolor: string): 'black' | 'white' {
  // Remove the hash at the start if it exists
  hexcolor = hexcolor.replace('#', '');
  // Convert hex to RGB
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);
  // Calculate YIQ (luminance)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  // Return black for light colors, white for dark colors
  return yiq >= 128 ? 'black' : 'white';
}

function IngredientItem({
  ingredient,
  allItemsMap,
  onClick,
}: IngredientItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: ingredient.id,
      data: {
        ingredient,
      },
    });

  // Tooltip logic remains the same
  let tooltipContent = ingredient.name;
  if (ingredient.type === 'derived') {
    const baseDesc = getIngredientDescription(ingredient, allItemsMap);
    tooltipContent = baseDesc;
    if (ingredient.llmDescription) {
      tooltipContent = `${ingredient.llmDescription}\n\nHow it was made: ${ingredient.llmHistory || 'Unknown'}\nRecipe Hint: ${ingredient.llmRecipe || 'Unknown'}`;
    } else {
      tooltipContent = baseDesc;
    }
  } else if (ingredient.llmDescription) {
    tooltipContent = ingredient.llmDescription;
  }

  const displayEmoji = ingredient.emoji || ingredient.icon;

  // Define base dynamic styles
  const itemStyle: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    // Opacity change only applies if NOT in overlay (or we can pass a prop)
    // For now, let's rely on isDragging state which should be false for the overlay clone
    opacity: isDragging ? 0.5 : 1,
  };
  if (ingredient.color) {
    itemStyle.backgroundColor = ingredient.color;
    itemStyle.color = getContrastYIQ(ingredient.color);
  }

  return (
    // Outer draggable node - Remove fallback bg/text class
    <div
      ref={setNodeRef}
      style={itemStyle}
      title={tooltipContent}
      {...attributes}
      // Base classes: Keep border, remove bg/text fallback
      className={`border border-base-300 rounded flex items-stretch my-1`}
    >
      {/* Main Draggable Content Area (with listeners) */}
      <div
        {...listeners}
        // Keep layout classes
        className="flex-grow flex items-center gap-2 p-2 cursor-grab"
      >
        <span className="text-xl">{displayEmoji}</span>
        <span className="flex-grow">{ingredient.name}</span>
        {ingredient.type === 'derived' && (
          <span
            // Keep specific blue for badge for now, contrast handled by logic
            className={`text-xs font-semibold ${!ingredient.color || getContrastYIQ(ingredient.color) === 'black' ? 'text-blue-500' : 'text-blue-200'}`}
          >
            (🧪)
          </span>
        )}
      </div>

      {/* Clickable Info Trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick(ingredient.id);
        }}
        title="View Details"
        // Keep border, remove hover bg, adjust ring
        className="flex items-center justify-center px-2 border-l border-base-300 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary-500"
        style={{ cursor: 'pointer', color: 'inherit' }}
        aria-label="View ingredient details"
      >
        {/* Info Icon - Remove explicit text color */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 opacity-60"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

// --- IngredientList Component ---
interface IngredientListProps {
  availableItems: Ingredient[];
  onAddCustomIngredient: (name: string) => void;
  onSelectIngredient: (id: string) => void; // Prop to handle selection
}

function IngredientList({
  availableItems,
  onAddCustomIngredient,
  onSelectIngredient, // Receive the handler
}: IngredientListProps) {
  const [customName, setCustomName] = useState('');
  const allItemsMap = new Map(availableItems.map((item) => [item.id, item]));

  const handleAddClick = () => {
    if (customName.trim()) {
      onAddCustomIngredient(customName.trim());
      setCustomName('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2">
        {availableItems.map((item) => (
          <IngredientItem
            key={item.id}
            ingredient={item}
            allItemsMap={allItemsMap}
            onClick={onSelectIngredient} // Pass the handler down
          />
        ))}
      </div>
      {/* Keep base border */}
      <div className="mt-2 pt-2 border-t border-base-200">
        <h3 className="text-sm font-semibold mb-1">Add Custom Ingredient</h3>
        <div className="flex gap-1">
          {/* Remove explicit bg from input */}
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Ingredient name..."
            className="flex-1 p-1 border border-base-300 rounded text-sm"
          />
          {/* Keep primary button colors */}
          <button
            onClick={handleAddClick}
            className="p-1 px-2 bg-primary-600 text-primary-50 rounded text-sm hover:bg-primary-700 disabled:opacity-50"
            disabled={!customName.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MixingBowl Component ---
interface MixingBowlProps {
  ingredients: Ingredient[];
  onClearBowl: () => void;
  allItemsMap: Map<string, Ingredient>;
}

function MixingBowl({
  ingredients,
  onClearBowl,
  allItemsMap,
}: MixingBowlProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'mixing-bowl-droppable',
  });

  const style = {
    transition: 'border-color 0.2s ease, background-color 0.2s ease',
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={setNodeRef}
        style={style} // Keep style for transition
        // Keep hover state colors, remove base background
        className={`flex-1 rounded p-2 flex flex-wrap items-start content-start gap-2 overflow-y-auto border-2 border-dashed ${isOver ? 'border-primary-500 bg-primary-100' : 'border-base-300'}`}
      >
        {ingredients.length === 0 ? (
          <p className="text-base-500 italic w-full text-center self-center">
            Drop ingredients here
          </p>
        ) : (
          ingredients.map((item) => {
            // Tooltip logic remains the same
            let tooltipContent = item.name;
            if (item.type === 'derived') {
              const baseDesc = getIngredientDescription(item, allItemsMap);
              tooltipContent = baseDesc;
              if (item.llmDescription) {
                tooltipContent = `${item.llmDescription}\n\nHow it was made: ${item.llmHistory || 'Unknown'}\nRecipe Hint: ${item.llmRecipe || 'Unknown'}`;
              } else {
                tooltipContent = baseDesc;
              }
            } else if (item.llmDescription) {
              tooltipContent = item.llmDescription;
            }

            const displayEmoji = item.emoji || item.icon;

            const itemStyle = {
              backgroundColor: item.color, // Apply dynamic color if exists
              color: item.color ? getContrastYIQ(item.color) : undefined,
            };

            return (
              // Bowl item card - Remove fallback bg/text classes
              <div
                key={item.id}
                title={tooltipContent}
                style={itemStyle}
                className={`p-1 px-2 rounded text-sm flex items-center gap-1 cursor-default`}
              >
                <span className="text-lg">{displayEmoji}</span>
                <span>{item.name}</span>
                {item.type === 'derived' && (
                  <span
                    // Keep specific blue badge color logic for now
                    className={`text-xs font-semibold ${!item.color || getContrastYIQ(item.color) === 'black' ? 'text-blue-500' : 'text-blue-200'}`}
                  >
                    (🧪)
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
      {/* Keep red button colors */}
      <button
        onClick={onClearBowl}
        className="mt-2 p-2 bg-red-600 text-red-50 rounded hover:bg-red-700 disabled:opacity-50"
        disabled={ingredients.length === 0}
      >
        Clear Bowl
      </button>
    </div>
  );
}

// --- CookingSteps Component ---
interface CookingStepsProps {
  onApplyStep: (stepId: CookingStepId) => void;
  isProcessing: boolean; // To disable buttons during LLM call
}

function CookingSteps({ onApplyStep, isProcessing }: CookingStepsProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-2 overflow-y-auto pr-2">
        {cookingSteps.map((step) => (
          // Use primary button colors
          <button
            key={step.id}
            onClick={() => onApplyStep(step.id)}
            disabled={isProcessing}
            className="w-full p-2 bg-primary-600 text-primary-50 rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="text-xl">{step.icon}</span>
            <span>{step.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Helper Function for Ingredient Description ---
// Moved outside the hook to avoid being recreated unnecessarily
function getIngredientDescription(
  ingredient: Ingredient,
  allItemsMap: Map<string, Ingredient>, // Pass Map for efficient lookup
): string {
  if (ingredient.type === 'base' || !ingredient.recipe) {
    return ingredient.name;
  }

  const { inputIds, stepId } = ingredient.recipe;
  const inputNames = inputIds
    .map((id) => allItemsMap.get(id)?.name ?? 'Unknown')
    .filter((name) => name !== 'Unknown'); // Filter out potentially missing items
  const stepName = cookingSteps.find((s) => s.id === stepId)?.name || stepId;

  if (inputNames.length === 0) {
    // Handle edge case where input items might not be found (e.g., if state updates weirdly)
    return `${ingredient.name} (from Unknown + ${stepName})`;
  }

  return `${ingredient.name} (from ${inputNames.join(' + ')} + ${stepName})`;
}

// --- Load Confirmation Modal Component ---
interface LoadConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

// Basic modal structure, similar to IngredientDetailPanel
function LoadConfirmModal({ onConfirm, onCancel }: LoadConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      {/* Increased z-index */}
      <div className="relative rounded-lg shadow-xl p-6 w-full max-w-lg bg-base-100 dark:bg-base-800">
        {' '}
        {/* Adjusted max-width */}
        <h2 className="text-xl font-semibold mb-4">Load AI Model?</h2>
        <div className="space-y-3 mb-6 text-sm">
          <p>
            This cooking sandbox uses a local AI model (WebLLM) that runs
            entirely in your browser.
          </p>
          <p>
            <strong>Resource Usage:</strong> Loading the model will download
            approximately 1-2GB of data (cached for future visits) and may
            utilize your computer&apos;s GPU for processing, potentially
            impacting performance or battery life on some devices.
          </p>
          <p>
            Do you want to proceed and load the AI model to enable the cooking
            features?
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-base-300 hover:bg-base-400 text-sm font-medium"
          >
            Cancel (Keep AI Disabled)
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-primary-600 text-primary-50 hover:bg-primary-700 text-sm font-medium"
          >
            Load AI Model
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Custom Hook for WebLLM ---
function useWebLLM(
  setStatusMessage: (message: string) => void,
  modelLoadConfirmed: boolean, // Add confirmation flag
) {
  const engine = useRef<webllm.MLCEngineInterface | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Default to false until confirmed
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEngine() {
      if (engine.current) return; // Prevent multiple loads
      setStatusMessage('Status: Initializing AI engine...');
      setError(null);
      setIsLoading(true);
      try {
        engine.current = await webllm.CreateMLCEngine(MODEL_ID, {
          initProgressCallback: (report: webllm.InitProgressReport) => {
            // Update status based on loading progress
            setStatusMessage(`Status: ${report.text}`);
          },
        });
        setStatusMessage('Status: AI Ready!');
      } catch (err) {
        console.error('Error loading WebLLM engine:', err);
        setError(
          `Failed to load AI model: ${err instanceof Error ? err.message : String(err)}`,
        );
        setStatusMessage('Status: Error loading AI!');
      } finally {
        setIsLoading(false);
      }
    }

    // Only load if confirmed by the user and not already loaded/loading
    if (modelLoadConfirmed && !isLoading && !engine.current) {
      loadEngine();
    }

    // Cleanup function
    return () => {
      // Check if engine exists before trying to unload
      if (engine.current) {
        engine.current.unload();
        engine.current = null;
        console.log('WebLLM engine unloaded.');
      }
    };
    // Dependency includes the confirmation flag
  }, [setStatusMessage, modelLoadConfirmed]);

  // --- Generate Description Function ---
  const generateDescription = useCallback(
    async (
      ingredientsInBowl: Ingredient[], // Renamed for clarity
      stepId: CookingStepId,
      availableItems: Ingredient[], // Added parameter
    ): Promise<LLMResult> => {
      // Also check if model was confirmed before proceeding
      if (!engine.current || isLoading || !modelLoadConfirmed) {
        throw new Error(
          'AI engine is not ready, still loading, or loading was not confirmed.',
        );
      }

      // Create a Map for efficient lookups in getIngredientDescription
      const allItemsMap = new Map(
        availableItems.map((item) => [item.id, item]),
      );

      const stepName =
        cookingSteps.find((s) => s.id === stepId)?.name || stepId;

      // Use the helper function to generate descriptions for prompt
      const ingredientDescriptions =
        ingredientsInBowl
          .map((item) => getIngredientDescription(item, allItemsMap))
          .join(', ') || 'nothing';

      const prompt = PROMPT_TEMPLATE.replace(
        '{ingredients}',
        ingredientDescriptions,
      ) // Use the generated descriptions
        .replace('{step}', stepName);

      console.log('Generated Prompt:', prompt); // Log the generated prompt for debugging

      try {
        setStatusMessage(
          `Status: Thinking about ${stepName} ${ingredientDescriptions}...`,
        );
        const reply = await engine.current.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.5,
          max_tokens: 256,
        });

        const fullResponse = reply.choices[0]?.message?.content || '';
        console.log('Raw LLM Response:', fullResponse);

        let parsedResult: Partial<LLMResult> = {};
        try {
          const yamlMarkerStart = '```yaml';
          const yamlMarkerEnd = '```';
          const yamlStartIndex = fullResponse.indexOf(yamlMarkerStart);
          const yamlEndIndex = fullResponse.lastIndexOf(yamlMarkerEnd);

          if (yamlStartIndex !== -1 && yamlEndIndex > yamlStartIndex) {
            const yamlContent = fullResponse
              .substring(yamlStartIndex + yamlMarkerStart.length, yamlEndIndex)
              .trim();
            parsedResult = yaml.load(yamlContent) as Partial<LLMResult>;
            console.log('Parsed YAML:', parsedResult);
          } else {
            console.warn('YAML block not found in LLM response.');
          }
        } catch (e) {
          console.error('Failed to parse YAML from LLM response:', e);
        }

        const rawEmoji = parsedResult.emoji?.trim();
        let processedEmoji: string = rawEmoji || '🧪'; // Default value

        if (rawEmoji) {
          if (emoji.has(rawEmoji)) {
            // It's a direct unicode emoji, use it!
            processedEmoji = rawEmoji;
          } else {
            // It's not a direct emoji, try converting from name (e.g., :smile:)
            const potentialEmoji = emoji.get(rawEmoji);
            // Use if conversion was successful (potentialEmoji != rawEmoji)
            if (potentialEmoji && potentialEmoji !== rawEmoji) {
              processedEmoji = potentialEmoji;
            } else {
              // Couldn't convert name or it was just junk text
              console.warn(
                `LLM emoji '${rawEmoji}' is not a direct emoji or known name. Using default.`,
              );
              // Keep the default '🧪' assigned initially
            }
          }
        } // else: rawEmoji was empty or undefined, keep the default '🧪'

        const finalResult: LLMResult = {
          name: parsedResult.name || 'Mysterious Mixture',
          color: parsedResult.color || '#cccccc',
          emoji: processedEmoji,
          description:
            parsedResult.description ||
            "The LLM couldn't quite describe this one!",
          history: parsedResult.history || 'Its past is shrouded in mystery.',
          recipe:
            parsedResult.recipe ||
            '- Mix ingredients\n- Apply heat\n- Hope for the best!',
        };

        return finalResult;
      } catch (err) {
        console.error('Error during LLM generation:', err);
        setError(
          `AI generation failed: ${err instanceof Error ? err.message : String(err)}`,
        );
        setStatusMessage('Status: Error during AI generation!');
        throw err;
      }
    },
    [engine, isLoading, setStatusMessage, modelLoadConfirmed],
  );

  return { generateDescription, isLoading, error };
}

// --- Main LlmCookClient Component ---
export default function LlmCookClient() {
  // State for all available ingredients (base + derived)
  const [availableItems, setAvailableItems] = useState<Ingredient[]>(
    initialBaseIngredients,
  );

  // State for MixingBowl contents
  const [bowlContents, setBowlContents] = useState<Ingredient[]>([]);

  // NEW: State for the actively dragged ingredient
  const [activeDragItem, setActiveDragItem] = useState<Ingredient | null>(null);

  // State for CookingSteps selection - Handled via onApplyStep callback
  const [selectedStep, setSelectedStep] = useState<CookingStepId | null>(null); // Store the ID of the step clicked

  // State to track if LLM is processing (applies after loading)
  const [isProcessing, setIsProcessing] = useState(false);

  // State for OutputArea history
  const [outputHistory, setOutputHistory] = useState<string[]>([]);

  // State for StatusBar status/progress - Updated initial message
  const [statusMessage, setStatusMessage] = useState(
    'Status: Waiting for user confirmation to load AI model...',
  );

  // State for selected ingredient details modal
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    string | null
  >(null);

  // NEW: State for load confirmation modal
  const [showLoadConfirmModal, setShowLoadConfirmModal] = useState(true);
  const [modelLoadConfirmed, setModelLoadConfirmed] = useState(false);
  const [modelLoadCancelled, setModelLoadCancelled] = useState(false); // Track cancellation

  // Integrate the WebLLM hook, passing the confirmation flag
  const {
    generateDescription,
    isLoading: isLLMLoading,
    error: llmError,
  } = useWebLLM(setStatusMessage, modelLoadConfirmed);

  // Create the map once here and pass down
  const allItemsMap = new Map(availableItems.map((item) => [item.id, item]));

  // Find the selected ingredient object based on ID
  const selectedIngredient = selectedIngredientId
    ? allItemsMap.get(selectedIngredientId)
    : null;

  // Handler to add a new custom base ingredient
  const handleAddCustomIngredient = (name: string) => {
    const newIngredient: Ingredient = {
      id: uuidv4(), // Generate unique ID
      name: name,
      icon: '❓', // Default icon for custom
      type: 'base',
    };
    setAvailableItems((prevItems) => [...prevItems, newIngredient]);
  };

  // Handler to clear the mixing bowl
  const handleClearBowl = useCallback(() => setBowlContents([]), []);

  // --- Handler for Applying a Cooking Step ---
  const handleApplyStep = useCallback(
    async (stepId: CookingStepId) => {
      // Add check for model confirmation and cancellation
      if (!modelLoadConfirmed || modelLoadCancelled) {
        setOutputHistory((prev) => [
          ...prev,
          '⚠️ AI Model not loaded or loading was cancelled. Cooking steps are disabled.',
        ]);
        return;
      }
      if (bowlContents.length === 0) {
        setOutputHistory((prev) => [
          ...prev,
          '⚠️ Mixing bowl is empty! Add some ingredients first.',
        ]);
        return;
      }
      // isLLMLoading check remains important here
      if (isProcessing || isLLMLoading) {
        console.warn('Processing already in progress or LLM loading.');
        return;
      }

      setSelectedStep(stepId);
      setIsProcessing(true);
      setStatusMessage(`Status: Asking AI about ${stepId}...`);

      // Keep a copy of current bowl contents for recipe
      const currentInputs = [...bowlContents];

      try {
        // generateDescription will throw if not ready/confirmed
        const llmResult: LLMResult = await generateDescription(
          currentInputs,
          stepId,
          availableItems,
        );
        console.log('LLM Result Parsed:', llmResult);

        // Add derived item with LLM data
        const newDerivedIngredient: Ingredient = {
          id: uuidv4(),
          name: llmResult.name,
          icon: '🧪',
          type: 'derived',
          recipe: {
            inputIds: currentInputs.map((item) => item.id),
            stepId: stepId,
          },
          color: llmResult.color,
          emoji: llmResult.emoji,
          llmDescription: llmResult.description,
          llmHistory: llmResult.history,
          llmRecipe: llmResult.recipe,
        };
        setAvailableItems((prev) => [...prev, newDerivedIngredient]);
        console.log(`Added derived item: ${newDerivedIngredient.name}`);

        // Clear the bowl AFTER using its contents for the recipe
        handleClearBowl();

        // Update output history with LLM's description
        setOutputHistory([llmResult.description]);
        console.log('Output history updated with LLM description.');
      } catch (err) {
        console.error('Failed to get result from LLM:', err);
        const errorMessage = `Error generating result: ${err instanceof Error ? err.message : String(err)}`;
        setOutputHistory((prev) => [...prev, `❌ ${errorMessage}`]);
        // Set status based on error source
        if (!modelLoadConfirmed || modelLoadCancelled) {
          setStatusMessage('Status: AI Disabled');
        } else if (isLLMLoading) {
          setStatusMessage('Status: AI Still Loading...');
        } else {
          setStatusMessage('Status: Error during AI generation!');
        }
      } finally {
        // Update status only if no error occurred and not cancelled
        if (
          !llmError &&
          !isLLMLoading &&
          modelLoadConfirmed &&
          !modelLoadCancelled
        ) {
          setStatusMessage('Status: AI Ready!');
        } else if (modelLoadCancelled) {
          setStatusMessage('Status: AI Disabled');
        } else if (llmError) {
          // Keep the error status message set in the catch block
        } else if (isLLMLoading) {
          // Keep the loading status message
        }

        setSelectedStep(null);
      }
    },
    [
      bowlContents,
      generateDescription,
      isProcessing,
      isLLMLoading,
      llmError,
      setStatusMessage,
      handleClearBowl,
      availableItems,
      modelLoadConfirmed, // Add dependency
      modelLoadCancelled, // Add dependency
    ],
  );

  // --- Drag and Drop Handlers ---
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedIngredient = active.data.current?.ingredient as
      | Ingredient
      | undefined;
    if (draggedIngredient) {
      setActiveDragItem(draggedIngredient);
    }
  };

  // --- Drag and Drop Handler ---
  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (over && over.id === 'mixing-bowl-droppable') {
      const draggedIngredient = active.data.current?.ingredient as
        | Ingredient
        | undefined;

      // Ensure we have valid ingredient data
      if (draggedIngredient) {
        setBowlContents((prevContents) => {
          // Prevent adding duplicates
          if (!prevContents.some((item) => item.id === draggedIngredient.id)) {
            console.log(`Adding ${draggedIngredient.name} to bowl`);
            return [...prevContents, draggedIngredient];
          }
          console.log(`${draggedIngredient.name} is already in the bowl`);
          return prevContents;
        });
      } else {
        console.warn('Dragged item data missing ingredient.');
      }
    } else {
      console.log('Item dropped elsewhere or invalid drop target.');
    }

    // Clear the active drag item regardless of drop target
    setActiveDragItem(null);
  };

  // Display LLM Loading/Error state - Adjusted for confirmation state
  useEffect(() => {
    if (!modelLoadConfirmed && !modelLoadCancelled) {
      setStatusMessage(
        'Status: Waiting for user confirmation to load AI model...',
      );
    } else if (modelLoadCancelled) {
      setStatusMessage('Status: AI Disabled');
    } else if (isLLMLoading) {
      // Status message is handled by initProgressCallback
    } else if (llmError) {
      setStatusMessage(`Status: AI Error - ${llmError}`);
      setOutputHistory((prev) => [...prev, `❌ AI Error: ${llmError}`]);
    } else if (modelLoadConfirmed && !isLLMLoading && !llmError) {
      // Don't override "AI Ready!" if loading finished successfully
      // setStatusMessage('Status: AI Ready!'); // This might override intermediate step messages
    }
  }, [
    isLLMLoading,
    llmError,
    setStatusMessage,
    modelLoadConfirmed,
    modelLoadCancelled,
  ]); // Add dependencies

  const handleConfirmLoad = useCallback(() => {
    setModelLoadConfirmed(true);
    setShowLoadConfirmModal(false);
    setModelLoadCancelled(false);
    // Initial status message set within useWebLLM's loadEngine call
  }, []);

  const handleCancelLoad = useCallback(() => {
    setShowLoadConfirmModal(false);
    setModelLoadConfirmed(false);
    setModelLoadCancelled(true); // Set the cancelled flag
    setStatusMessage('Status: AI Disabled'); // Update status immediately
  }, []);

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      {/* Remove explicit bg/text from main container */}
      <div className="flex flex-col h-screen p-2">
        <h1 className="text-2xl font-bold mb-4 text-center">
          LLM Cooking Sandbox
        </h1>

        {/* Main Content Columns */}
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Column 1: Ingredients List - Remove explicit bg/text */}
          <div className="w-1/3 p-4 rounded shadow flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Ingredients</h2>
            <IngredientList
              availableItems={availableItems}
              onAddCustomIngredient={handleAddCustomIngredient}
              onSelectIngredient={setSelectedIngredientId}
            />
          </div>

          {/* Column 2: Mixing Bowl - Remove explicit bg/text */}
          <div className="w-1/3 p-4 rounded shadow flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Mixing Bowl</h2>
            <MixingBowl
              ingredients={bowlContents}
              onClearBowl={handleClearBowl}
              allItemsMap={allItemsMap}
            />
          </div>

          {/* Column 3: Cooking Steps - Remove explicit bg/text */}
          <div className="w-1/3 p-4 rounded shadow flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Cooking Steps</h2>
            <CookingSteps
              onApplyStep={handleApplyStep}
              // Disable if not confirmed, loading, processing, or cancelled
              isProcessing={
                !modelLoadConfirmed ||
                modelLoadCancelled ||
                isLLMLoading ||
                isProcessing
              }
            />
          </div>
        </div>

        {/* Output Area - Remove explicit bg/text */}
        <div className="mt-4 h-1/4 p-4 rounded shadow flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Output</h2>
          {/* Remove explicit bg from inner div, keep border */}
          <div
            className="flex-1 border border-dashed border-base-300 rounded p-2 overflow-y-auto scroll-smooth"
            ref={(outputAreaRef) => {
              if (outputAreaRef) {
                outputAreaRef.scrollTop = outputAreaRef.scrollHeight;
              }
            }}
          >
            {outputHistory.length === 0 ? (
              <p className="text-base-500 italic">
                LLM output will appear here...
              </p>
            ) : (
              outputHistory.map((line, index) => (
                <p key={index} className="text-sm mb-1 whitespace-pre-wrap">
                  {line}
                </p>
              ))
            )}
          </div>
        </div>

        {/* Status Bar - Remove explicit bg/text */}
        <div
          className="mt-2 h-8 p-1 rounded shadow text-sm text-center font-medium"
          // Update title logic
          title={
            modelLoadCancelled
              ? 'AI features disabled by user.'
              : (llmError ?? undefined)
          }
        >
          {statusMessage}
        </div>

        {/* Modal Rendering Area: Load Confirmation */}
        {showLoadConfirmModal && (
          <LoadConfirmModal
            onConfirm={handleConfirmLoad}
            onCancel={handleCancelLoad}
          />
        )}

        {/* Modal Rendering Area: Ingredient Details (Keep existing) */}
        {selectedIngredientId && allItemsMap.get(selectedIngredientId) && (
          <IngredientDetailPanel
            ingredient={allItemsMap.get(selectedIngredientId)!}
            allItemsMap={allItemsMap}
            onClose={() => setSelectedIngredientId(null)}
          />
        )}
      </div>

      {/* Drag Overlay: Renders the item being dragged */}
      <DragOverlay dropAnimation={null}>
        {activeDragItem ? (
          <IngredientItem
            ingredient={activeDragItem}
            allItemsMap={allItemsMap} // Ensure map is passed
            onClick={() => {}} // No action needed in overlay
            // Add a prop or style to indicate it's in the overlay if needed
            // For now, let's rely on the DndContext handling visual cues
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

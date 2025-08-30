// Generated leveling guide data for Path of Exile 2
import {
  ArrowDownIcon,
  ArrowDownLeftIcon,
  ArrowDownRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowTurnDownLeftIcon,
  ArrowTurnDownRightIcon,
  ArrowTurnLeftDownIcon,
  ArrowTurnLeftUpIcon,
  ArrowTurnRightDownIcon,
  ArrowTurnRightUpIcon,
  ArrowTurnUpLeftIcon,
  ArrowTurnUpRightIcon,
  ArrowUpIcon,
  ArrowUpLeftIcon,
  ArrowUpRightIcon,
  ArrowUturnLeftIcon,
  MapIcon,
} from '@heroicons/react/24/solid';
import React, { ReactNode } from 'react';

// Standard icon size class
const iconClass = 'h-5 w-5';

// Helper function to create composite direction indicators
const createCompositeDirection = (icons: React.ReactElement[]) => {
  return (
    <div className="flex items-center">
      {icons.map((icon, index) =>
        React.cloneElement(icon, { className: iconClass, key: index }),
      )}
    </div>
  );
};

// Simple direction icons with standard sizing
const directionalIcons = {
  up: <ArrowUpIcon className={iconClass} />,
  down: <ArrowDownIcon className={iconClass} />,
  left: <ArrowLeftIcon className={iconClass} />,
  right: <ArrowRightIcon className={iconClass} />,
  upLeft: <ArrowUpLeftIcon className={iconClass} />,
  upRight: <ArrowUpRightIcon className={iconClass} />,
  downLeft: <ArrowDownLeftIcon className={iconClass} />,
  downRight: <ArrowDownRightIcon className={iconClass} />,
  // Turn icons
  turnUpRight: <ArrowTurnUpRightIcon className={iconClass} />,
  turnUpLeft: <ArrowTurnUpLeftIcon className={iconClass} />,
  turnDownRight: <ArrowTurnDownRightIcon className={iconClass} />,
  turnDownLeft: <ArrowTurnDownLeftIcon className={iconClass} />,
  turnRightUp: <ArrowTurnRightUpIcon className={iconClass} />,
  turnRightDown: <ArrowTurnRightDownIcon className={iconClass} />,
  turnLeftUp: <ArrowTurnLeftUpIcon className={iconClass} />,
  turnLeftDown: <ArrowTurnLeftDownIcon className={iconClass} />,
  portal: <ArrowUturnLeftIcon className={iconClass} />,
  map: <MapIcon className={iconClass} />,
};

export const directionIcons: Record<string, ReactNode> = {
  // Primary directions
  north: directionalIcons.up,
  south: directionalIcons.down,
  east: directionalIcons.right,
  west: directionalIcons.left,
  'north-east': directionalIcons.upRight,
  'north-west': directionalIcons.upLeft,
  'south-east': directionalIcons.downRight,
  'south-west': directionalIcons.downLeft,

  // Two-step directions using turn icons
  'north-then-east': directionalIcons.turnUpRight,
  'north-then-west': directionalIcons.turnUpLeft,
  'south-then-east': directionalIcons.turnDownRight,
  'south-then-west': directionalIcons.turnDownLeft,
  'east-then-north': directionalIcons.turnRightUp,
  'east-then-south': directionalIcons.turnRightDown,
  'west-then-north': directionalIcons.turnLeftUp,
  'west-then-south': directionalIcons.turnLeftDown,

  // Complex multi-step directions
  'north-west-then-west': createCompositeDirection([
    directionalIcons.upLeft,
    directionalIcons.left,
  ]),
  'south-west-then-north-west': createCompositeDirection([
    directionalIcons.downLeft,
    directionalIcons.upLeft,
  ]),
  'south-east-then-north-east': createCompositeDirection([
    directionalIcons.downRight,
    directionalIcons.upRight,
  ]),
  'east-then-south-then-north-east': createCompositeDirection([
    directionalIcons.turnRightDown,
    directionalIcons.upRight,
  ]),
  'north-then-east-then-south-east': createCompositeDirection([
    directionalIcons.turnUpRight,
    directionalIcons.downLeft,
  ]),

  // Special icons
  portal: directionalIcons.portal,
  map: directionalIcons.map,
};

// Define the structure of a step in the leveling guide
export type Step = {
  // The main text of the step
  text: string;
  // Optional areas, npcs, and enemies associated with the step; extracted from the text
  areas?: string[];
  // Optional direction for the step; extracted from the text
  npcs?: string[];
  // Optional enemies associated with the step; extracted from the text
  enemies?: string[];
  // Optional direction for the step, using the defined icons
  direction?: keyof typeof directionIcons;
};

// Ensure all steps have default arrays for areas, npcs, and enemies
function normalizeSteps(raw: Step[]): Step[] {
  return raw.map((s) => ({
    text: s.text,
    areas: s.areas ?? [],
    npcs: s.npcs ?? [],
    enemies: s.enemies ?? [],
    direction: s.direction,
  }));
}

export const stepsAct1: Step[] = normalizeSteps([
  {
    text: 'The Riverbank: Talk to wounded man, kill Zombie, equip weapon & skill.',
    areas: ['The Riverbank'],
    enemies: ['Zombie'],
  },
  {
    text: 'The Riverbank: Kill Bloated Miller, then go to The Clearfell Encampment.',
    areas: ['The Riverbank', 'The Clearfell Encampment'],
    enemies: ['Bloated Miller'],
    direction: 'east',
  },
  {
    text: 'Clearfell: Enter from The Clearfell Encampment. Optional: Kill Beira of the Rotten Pack for +10% cold resistance.',
    areas: ['The Clearfell Encampment', 'Clearfell'],
    enemies: ['Beira of the Rotten Pack'],
    direction: 'east',
  },
  {
    text: 'Clearfell: Go to The Grelwood. Optional: Explore The Mud Burrow.',
    areas: ['Clearfell', 'The Grelwood', 'The Mud Burrow'],
    direction: 'north-east',
  },
  {
    text: 'The Grelwood: Find Tree of Souls or go to The Red Vale. Optional: Kill Areagne, Forgotten Witch.',
    areas: ['The Grelwood', 'The Red Vale'],
    enemies: ['Areagne, Forgotten Witch'],
  },
  {
    text: 'The Red Vale: Activate 3 Obelisks of Rust, kill The Rust King. Return to The Grelwood.',
    areas: ['The Red Vale', 'The Grelwood'],
    enemies: ['The Rust King'],
    direction: 'west',
  },
  {
    text: 'The Grelwood: Find Tree of Souls, then go to The Grim Tangle.',
    areas: ['The Grelwood', 'The Grim Tangle'],
  },
  {
    text: 'The Grim Tangle: Go to Cemetery of the Eternals.',
    areas: ['The Grim Tangle', 'Cemetery of the Eternals'],
  },
  {
    text: 'Cemetery of the Eternals: Find and clear Tomb of the Consort.',
    areas: ['Cemetery of the Eternals', 'Tomb of the Consort'],
    enemies: ['Asinia, Praetor Consort'],
  },
  {
    text: 'Cemetery of the Eternals: Find and clear Mausoleum of the Praetor.',
    areas: ['Cemetery of the Eternals', 'Mausoleum of the Praetor'],
    enemies: ['Draven, Eternal Praetor'],
  },
  {
    text: 'Cemetery of the Eternals: Open Memorial Gate, kill Lachlann of Endless Lament.',
    areas: ['Cemetery of the Eternals'],
    enemies: ['Lachlann of Endless Lament'],
  },
  {
    text: 'The Hunting Grounds: Enter from Cemetery of the Eternals. Optional: Kill The Crowbell.',
    areas: ['Cemetery of the Eternals', 'The Hunting Grounds'],
    enemies: ['The Crowbell'],
  },
  {
    text: 'The Hunting Grounds: Go to Freythorn to kill The King in the Mists for +30 spirit.',
    areas: ['The Hunting Grounds', 'Freythorn'],
    enemies: ['The King in the Mists'],
  },
  {
    text: 'The Hunting Grounds: Go to Ogham Farmlands.',
    areas: ['The Hunting Grounds', 'Ogham Farmlands'],
  },
  {
    text: 'Ogham Farmlands: Go to Ogham Village, kill The Executioner.',
    areas: ['Ogham Farmlands', 'Ogham Village'],
    enemies: ['The Executioner'],
  },
  {
    text: 'Ogham Village: Go to The Manor Ramparts.',
    areas: ['Ogham Village', 'The Manor Ramparts'],
  },
  {
    text: 'Oghman Manor: Kill Count Geonor to finish Act 1.',
    areas: ['Oghman Manor'],
    enemies: ['Count Geonor'],
  },
]);

export const stepsAct2: Step[] = normalizeSteps([
  {
    text: 'Vastiri Outskirts: Kill Rathbreaker to enter The Ardura Caravan.',
    areas: ['Vastiri Outskirts', 'The Ardura Caravan'],
    enemies: ['Rathbreaker'],
    direction: 'portal',
  },
  {
    text: 'The Ardura Caravan: Use Desert Map to go to Mawdun Quarry, then Mawdun Mine. Kill Rudja, the Dread Engineer.',
    areas: ['The Ardura Caravan', 'Mawdun Quarry', 'Mawdun Mine'],
    enemies: ['Rudja, the Dread Engineer'],
    direction: 'map',
  },
  {
    text: 'The Ardura Caravan: Use Desert Map to go to Traitor’s Passage. Optional: Kill Balbala, The Traitor.',
    areas: ['The Ardura Caravan', 'Traitor’s Passage'],
    enemies: ['Balbala, The Traitor'],
    direction: 'map',
  },
  {
    text: 'Traitor’s Passage: Go to The Halani Gates. Open gates, kill Jamanra, the Risen King.',
    areas: ['Traitor’s Passage', 'The Halani Gates'],
    enemies: ['Jamanra, the Risen King'],
  },
  {
    text: 'The Ardura Caravan: Use Desert Map to go to Mastodon Badlands, then The Bone Pits for Mastodon Tusks.',
    areas: ['The Ardura Caravan', 'Mastodon Badlands', 'The Bone Pits'],
    direction: 'map',
  },
  {
    text: 'The Ardura Caravan: Use Desert Map to go to Keth.',
    areas: ['The Ardura Caravan', 'Keth'],
    direction: 'map',
  },
  {
    text: 'Keth: Go to The Lost City, then Buried Shrines for The Essence of Water.',
    areas: ['Keth', 'The Lost City', 'Buried Shrines'],
  },
  {
    text: 'The Ardura Caravan: Use Desert Map to go to Valley of the Titans, then The Titan Grotto for Horn of the Vastiri.',
    areas: ['The Ardura Caravan', 'Valley of the Titans', 'The Titan Grotto'],
    direction: 'map',
  },
  {
    text: 'The Ardura Caravan: After getting all 3 items, use map to go to Deshar.',
    areas: ['The Ardura Caravan', 'Deshar'],
    direction: 'map',
  },
  {
    text: 'Deshar: Go to Path of Mourning, then Spires of Deshar. Kill Tor Gul.',
    areas: ['Deshar', 'Path of Mourning', 'The Spires of Deshar'],
    enemies: ['Tor Gul, the Defiler'],
  },
  {
    text: 'Spires of Deshar: Use map to go to The Dreadnought.',
    areas: ['Spires of Deshar', 'The Dreadnought'],
    direction: 'map',
  },
  {
    text: 'The Dreadnought: Go to Dreadnought Vanguard. Kill Jamanra, the Abomination to finish Act 2.',
    areas: ['The Dreadnought', 'Dreadnought Vanguard'],
    enemies: ['Jamanra, the Abomination'],
  },
]);

export const stepsAct3: Step[] = normalizeSteps([
  {
    text: 'Sandswept Marsh: Cross the marsh to find the Ziggurat Encampment.',
    areas: ['Sandswept Marsh', 'Ziggurat Encampment'],
  },
  {
    text: 'Ziggurat Encampment: Go to Jungle Ruins. Optional: Explore Venom Crypts for a buff.',
    areas: ['Ziggurat Encampment', 'Jungle Ruins', 'Venom Crypts'],
    direction: 'north',
  },
  {
    text: 'Jungle Ruins: Go to Infested Barrens.',
    areas: ['Jungle Ruins', 'Infested Barrens'],
  },
  {
    text: 'Infested Barrens: Find Matlan Waterways.',
    areas: ['Infested Barrens', 'The Matlan Waterways'],
  },
  {
    text: 'Infested Barrens: Optional: Go to Azak Bog.',
    areas: ['Infested Barrens', 'The Azak Bog'],
  },
  {
    text: 'Infested Barrens: Go to Chimeral Wetlands, kill Xyclucian, the Chimera to access Jiquani’s Machinarium.',
    areas: ['Infested Barrens', 'Chimeral Wetlands', 'Jiquani’s Machinarium'],
    enemies: ['Xyclucian, the Chimera'],
  },
  {
    text: 'Jiquani’s Machinarium: Solve puzzles.',
    areas: ['Jiquani’s Machinarium'],
  },
  {
    text: 'Jiquani’s Sanctum: Kill Zicoatl, Warden of the Core.',
    areas: ['Jiquani’s Sanctum'],
    enemies: ['Zicoatl, Warden of the Core'],
  },
  {
    text: 'Infested Barrens: Resurface Matlan Waterways, then go through them to The Drowned City.',
    areas: ['Infested Barrens', 'The Matlan Waterways', 'The Drowned City'],
    direction: 'portal',
  },
  {
    text: 'The Drowned City: Go to Apex of Filth.',
    areas: ['The Drowned City', 'Apex of Filth'],
  },
  {
    text: 'The Drowned City: Optional: Enter Molten Vault to unlock Reforging Bench.',
    areas: ['The Drowned City', 'The Molten Vault'],
    enemies: ['Mektul, the Forgemaster'],
  },
  {
    text: 'Apex of Filth: Kill Queen of Filth to enter Temple of Kopec.',
    areas: ['Apex of Filth', 'Temple of Kopec'],
    enemies: ['Queen of Filth'],
    direction: 'portal',
  },
  {
    text: 'Temple of Kopec: Kill Ketzuli, High Priest of the Sun, then travel to the past.',
    areas: ['Temple of Kopec'],
    enemies: ['Ketzuli, High Priest of the Sun'],
  },
  {
    text: 'Utzaal (Past): Kill Viper Napuatzi.',
    areas: ['Utzaal (Past)'],
    enemies: ['Viper Napuatzi'],
  },
  {
    text: 'Utzaal (Past): Go to Aggorat (Past).',
    areas: ['Utzaal (Past)', 'Aggorat (Past)'],
  },
  {
    text: 'Aggorat (Past): Go to The Black Chambers. Kill Doryani, Royal Thaumaturge to finish Act 3.',
    areas: ['Aggorat (Past)', 'The Black Chambers (Past)'],
    enemies: ['Doryani, Royal Thaumaturge'],
  },
]);

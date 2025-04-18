// Generated leveling guide data for Last Epoch
import React, { ReactNode } from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpLeftIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  ArrowDownRightIcon,
  ArrowTurnDownLeftIcon,
  ArrowTurnDownRightIcon,
  ArrowTurnUpLeftIcon,
  ArrowTurnUpRightIcon,
  ArrowTurnLeftDownIcon,
  ArrowTurnLeftUpIcon,
  ArrowTurnRightDownIcon,
  ArrowTurnRightUpIcon,
} from '@heroicons/react/24/solid';

// Standard icon size class
const iconClass = "h-5 w-5";

// Helper function to create composite direction indicators
const createCompositeDirection = (icons: React.ReactElement[]) => {
  return (
    <div className="flex items-center">
      {icons.map((icon, index) => 
        React.cloneElement(icon, { className: iconClass, key: index })
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
};

export const directionIcons: Record<string, ReactNode> = {
  // Primary directions
  'north': directionalIcons.up,
  'south': directionalIcons.down,
  'east': directionalIcons.right,
  'west': directionalIcons.left,
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
  // For these complex patterns, we'll keep using the composite approach
  'north-west-then-west': createCompositeDirection([directionalIcons.upLeft, directionalIcons.left]),
  'south-west-then-north-west': createCompositeDirection([directionalIcons.downLeft, directionalIcons.upLeft]),
  'south-east-then-north-east': createCompositeDirection([directionalIcons.downRight, directionalIcons.upRight]),
  'east-then-south-then-north-east': createCompositeDirection([
    directionalIcons.turnRightDown,
    directionalIcons.upRight
  ]),
  "north-then-east-then-south-east": createCompositeDirection([
    directionalIcons.turnUpRight,
    directionalIcons.downLeft
  ]),
};

export type Step = { text: string; areas?: string[]; npcs?: string[]; enemies?: string[]; direction?: keyof typeof directionIcons }

// Ensure all steps have default arrays for areas, npcs, and enemies
function normalizeSteps(raw: Step[]): Step[] {
  return raw.map(s => ({
    text: s.text,
    areas: s.areas ?? [],
    npcs: s.npcs ?? [],
    enemies: s.enemies ?? [],
    direction: s.direction,
  }));
}

export const stepsAct1: Step[] = normalizeSteps([
  { text: 'Group up all mobs to 2nd phoenix, kill them to get to lvl 2. Skip the rest.', npcs: [], enemies: ['Phoenix'] },
  { text: 'Talk to the NPC in The Burning Forest (top dialogue choices) to let him help you. Kill the end boss and go to town.', areas: ['The Burning Forest'], npcs: ['Forest NPC'], enemies: ['End Boss'] },
  { text: 'Skip all NPCs in The Keepers’ Camp and go to The Fortress Gardens', areas: ['The Keepers’ Camp', 'The Fortress Gardens'], npcs: [], enemies: [], direction: 'north-west' },
  { text: 'In The Fortress Walls enter The Storerooms to complete the side quest. After leaving, talk to the NPC and head to The Keepers’s Vault', areas: ['The Keepers’s Vault'], npcs: [], enemies: [], direction: 'north-east' },
  { text: 'Talk to Keeper Barthas and continue north immediately. Enter The Northern Road',areas:['The Northern Road'], npcs: ['Keeper Barthas'], enemies: [], direction: 'north-east' },
  { text: 'Speak with the Keeper Guard, portal to town and speak to NPC (main quest), head out east to Ulatri Highlands.', areas: ['Ulatri Highlands'], npcs: ['Keeper Guard'], enemies: [], direction: 'east' },
  { text: 'Optionally kill big rares to get exp. Continue to The Osprix Warcamp', areas: ['The Osprix Warcamp'], direction: 'north-east' },
  { text: 'Continue to The Summit', areas: ['The Summit'], direction: 'north' },
  { text: 'Kill Haruspex Orian (Act 1 boss). Portal to town and talk to the 2 NPCs to get to Act 2.', npcs: [], enemies: ['Haruspex Orian'] },
]);

export const stepsAct2: Step[] = normalizeSteps([
  { text: 'Talk to NPC to take the Shard of the Epoch and continue north. Skip the first NPC and continue to Last Refuge Outskirts', areas: ['Last Refuge Outskirts'], npcs: ['Shard Keeper NPC'], direction: 'north' },
  { text: 'Talk to the NPC to complete the quest, continue north, talk to the first side quest NPC, complete the side quest (south-east → north-west → north-east), then continue north-east to kill the Void Penance. Enter The Council of Chambers', areas: ['The Council of Chambers'], npcs: ['Council NPC'], enemies: ['Void Penance'], direction: 'north-east' },
  { text: 'Talk to the two NPCs to complete the quests and head north-west to The Last Archive', areas: ['The Last Archive'], direction: 'north-west' },
  { text: 'Enter Erza’s Library, complete the side quest, then go back to The Last Archive and continue north-east to Pannion’s Study', areas: ['Erza’s Library', 'The Last Archive', 'Pannion’s Study'], direction: 'north-east' },
  { text: 'Kill the Pannion’s Students. Portal back to town.', npcs: [], enemies: ['Pannion’s Students'] },
  { text: 'Talk to NPCs (side quest north-east, complete side quest west (unique gloves), complete main quest). Head north-east to The Precipice', areas: ['The Precipice'], direction: 'north-east' },
  { text: 'Kill the Idol of Ruin, go through the time rift, loop around to the next time rift.', npcs: [], enemies: ['Idol of Ruin'] },
  { text: 'Back in The Precipice, go east to The Armoury', areas: ['The Precipice','The Armoury'], direction: 'east' },
  { text: 'Clear the waves and kill the boss. Continue north-east, skip the side quest. Follow the main quest marker to The Lower District', areas: ['The Lower District'], direction: 'north-east', enemies: ['Wave Boss'] },
  { text: 'Kill the Elder Pannion. Talk to the NPC and enter the Time Rift to The End of Time', areas: ['The End of Time'], npcs: [], enemies: ['Elder Pannion'] },
  { text: 'Run directly up the stairs, talk to Elder Gaspar, choose Mastery, enter The Council Chamber', areas: ['The Council Chamber'], npcs: ['Elder Gaspar'], enemies: [] },
]);

export const stepsAct3: Step[] = normalizeSteps([
  { text: 'Talk to NPCs (main quest, respec NPC, dispel barrier) and enter The Sheltered Wood', areas: ['The Sheltered Wood'], npcs: ['Main Quest NPC', 'Respec NPC'], enemies: [], direction: 'south-east' },
  { text: 'Follow main quest marker to The Surface, The Forsaken Trail and Cultist Camp', areas: ['The Surface', 'The Forsaken Trail', 'Cultist Camp'], npcs: [], enemies: [] },
  { text: 'Directly head out north to The Ruins of Welryn', areas: ['The Ruins of Welryn'], direction: 'north' },
  { text: 'Spiral around to enter Welryn Undercity', areas: ['Welryn Undercity'], direction: 'south' },
  { text: 'Talk to NPC (main quest) and kill the three Soul Repositories (north → east → south-east). Talk to NPC again and portal to town', direction: 'north-then-east-then-south-east', npcs: ['Main Quest NPC'], enemies: ['Soul Repository'] },
  { text: 'Directly go south to Welryn Docks', areas: ['Welryn Docks'], direction: 'south' },
  { text: 'Follow main quest marker, kill the Void Centipede, take Symbol of Hope. Portal to town', enemies: ['Void Centipede'] },
  { text: 'Talk to NPC (main quest). Go east to The Ritual Site', areas: ['The Ritual Site'], direction: 'east', npcs: ['Main Quest NPC'] },
  { text: 'Talk to NPC (main quest) and kill the Void Amalgamation. Continue east to The Shattered Valley', areas: ['The Shattered Valley'], direction: 'east', npcs: ['Main Quest NPC'], enemies: ['Void Amalgamation'] },
  { text: 'Go directly north to The Abandoned Tunnel and follow quest marker to The Lost Refuge', areas: ['The Abandoned Tunnel'], direction: 'north-east' },
  { text: 'Follow quest marker (east), talk to the Old Tome to complete the side quest and take waypoint to The Shattered Valley', areas: ['The Shattered Valley'], direction: 'east', npcs: ['Old Tome'] },
  { text: 'Continue south-east, enter Time Rift to The Ancient Forest. Go north-east and kill the Primeval Dragon. Take waypoint to The Shattered Valley in the Ruined Era', areas: ['The Shattered Valley', 'The Ancient Forest'], direction: 'south-east', enemies: ['Primeval Dragon'] },
  { text: 'Go south-east again, pass the Time Rift towards north-east and enter The Courtyard', areas: ['The Courtyard'], direction: 'south-east' },
  { text: 'Turn south-east at waypoint and follow north to kill the Temple Guardian and enter The Temple of Eterra', areas: ['The Temple of Eterra'], direction: 'north-east', enemies: ['Temple Guardian'] },
  { text: 'Follow main quest marker and enter The Lotus Halls', areas: ['The Lotus Halls'], direction: 'north-east' },
  { text: 'Directly go north-west to get a Shard, then take waypoint to The Council Chambers', areas: ['The Council Chambers'], direction: 'north-west' },
  { text: 'Talk to NPC, take waypoint to The Lotus Halls, continue north-east to The Sanctum Bastille', areas: ['The Lotus Halls', 'The Sanctum Bastille'], direction: 'north-east' },
  { text: 'Follow main quest marker to enter The End of Ruin, kill the Emperor’s Remains, talk to NPC to portal to The End of Time', areas: ['The End of Ruin'], enemies: ['Emperor’s Remains'] },
  { text: 'Directly go upstairs to Elder Gaspar and enter portal to Imperial Era (The Outcast Camp)', areas: ['The Outcast Camp'], npcs: ['Elder Gaspar'] },
]);

export const stepsAct4: Step[] = normalizeSteps([
  { text: 'Optionally craft a bit, head south-west to Welryn Outskirts', areas: ['Welryn Outskirts'], direction: 'south-west' },
  { text: 'Follow quest marker west to enter Imperial Welryn', areas: ['Imperial Welryn'], direction: 'west' },
  { text: 'Ignore quest marker and go north-west to The Soul Wardens’ Road', areas: ['The Soul Wardens’ Road'], direction: 'north-west' },
  { text: 'Kill the zombie waves and continue west to enter The Risen Lake', areas: ['The Risen Lake'], direction: 'west' },
  { text: 'Enter Time Rift to The Corrupted Lake. Go west and spiral around clockwise until you kill the Prophet of Ruin/Idol of Ruin (side quest). Take waypoint to The Risen Lake.', areas: ['The Risen Lake', 'The Corrupted Lake'], enemies: ['Prophet of Ruin', 'Idol of Ruin'] },
  { text: 'Pass the Time Rift, click the stone for the bridge, ignore quest marker and continue north-east and north-west to enter The Fallen Tower', areas: ['The Fallen Tower'], direction: 'north-east' },
  { text: 'Follow quest marker north-west to enter Imperial Thetima', areas: ['Imperial Thetima'], direction: 'north-west' },
  { text: 'Follow quest marker west to enter The Darkling Pier', areas: ['The Darkling Pier'], direction: 'west' },
  { text: 'Continue east to enter The Imperial Dreadnought', areas: ['The Imperial Dreadnought'], direction: 'east' },
  { text: 'Follow quest marker east to enter The Dreadnought’s Deck', areas: ['The Dreadnought’s Deck'], direction: 'east' },
  { text: 'Follow quest marker north-west then west, kill Admiral Harton. Talk to NPCs (Alric) and interact with the Dreadnought’s Railing.', direction: 'north-west-then-west', enemies: ['Admiral Harton'], npcs: ['Alric'] },
]);

export const stepsAct5: Step[] = normalizeSteps([
  { text: 'Talk to NPC (Alric). Go north-east to enter The Majasan Desert', areas: ['The Majasan Desert'], direction: 'north-east', npcs: ['Alric'] },
  { text: 'Follow quest marker, talk to NPC (Rouj Zabat), enter The Wraith Dunes', areas: ['The Wraith Dunes'], direction: 'north-east', npcs: ['Rouj Zabat'] },
  { text: 'Go north and north-east to follow main quest marker and enter Maj’elka', areas: ['Maj’elka'], direction: 'north-east' },
  { text: 'Talk to NPC (Alric), go downstairs, continue south-east, kill Venator Ealos, talk to NPC (Rouj Zabat), continue north-east and kill the Bone Furnace before entering The Sapphire Quarter', areas: ['The Sapphire Quarter'], npcs: ['Alric', 'Rouj Zabat'], enemies: ['Venator Ealos', 'Bone Furnace'] },
  { text: 'Continue north, kill the Stygian Warden, talk to NPC (Alric), continue north-west and north, kill Praetor Vul’arta, talk to NPC (Alric) and enter portal to Maj’elka', areas: ['Maj’elka'], npcs: ['Alric'], enemies: ['Stygian Warden', 'Praetor Vul’arta'] },
  { text: 'Go east to The Oracle’s Abode, talk to NPC (Shrine Maiden), take waypoint to The Shining Cove', areas: ['The Oracle’s Abode'], direction: 'east', npcs: ['Shrine Maiden'] },
  { text: 'Go east into Time Rift to The Ruined Coast, kill Ortra’ek the Survivor, click the Sapphire Tablet, enter the Temporal Sanctum, take waypoint to The Oracle’s Abode (Imperial Era)', areas: ['The Ruined Coast'], direction: 'east', enemies: ['Ortra’ek the Survivor'] },
  { text: 'Talk to NPC (Shrine Maiden) and Oracle, continue north to The Maj’elkan Catacombs', areas: ['The Maj’elkan Catacombs'], direction: 'north', npcs: ['Shrine Maiden','Oracle'] },
  { text: 'Go east → south → north-east to enter Titan’s Canyon', areas: ['Titan’s Canyon'], direction: 'east-then-south-then-north-east', npcs: [] },
  { text: 'Follow main quest marker, kill Spymaster Zerrick, and enter The Maj’elka Waystation', areas: ['The Maj’elka Waystation'], enemies: ['Spymaster Zerrick'] },
  { text: 'Follow main quest marker and talk to NPC (Alric)', npcs: ['Alric'] },
]);

export const stepsAct6: Step[] = normalizeSteps([
  { text: 'Talk to NPC (Yulia), go north into The Rust Lands', areas: ['The Rust Lands'], direction: 'north', npcs: ['Yulia'] },
  { text: 'Follow main quest marker east to enter The Lower Sewers', areas: ['The Lower Sewers'], direction: 'east' },
  { text: 'Follow main quest marker north-west to enter The Barren Aqueduct', areas: ['The Barren Aqueduct'], direction: 'north-west' },
  { text: 'Follow main quest marker north, kill the rare mob, talk to NPC (Alric), and enter Necropolis of the Deep', areas: ['Necropolis of the Deep'], direction: 'north', npcs: ['Alric'] },
  { text: 'Follow main quest marker south-east to enter Yulia’s Haven', areas: ['Yulia’s Haven'], direction: 'south-east' },
  { text: 'Talk to both NPCs then continue north-west into Nests of the Fallen', areas: ['Nests of the Fallen'], direction: 'north-west', npcs: ['Resistance Leader', 'Survivor NPC'] },
  { text: 'Follow side quest marker, kill Ulaca Maggot Tongue, portal to town', enemies: ['Ulaca Maggot Tongue'] },
  { text: 'Talk to NPC (Alric), enter The Upper Necropolis', areas: ['The Upper Necropolis'], direction: 'south-east', npcs: ['Alric'] },
  { text: 'Follow main quest marker north-east to enter The Citadel Sewers', areas: ['The Citadel Sewers'], direction: 'north-east' },
  { text: 'Destroy the three Imperial Watchers, continue south-east to enter The Immortal Summit', areas: ['The Immortal Summit'], direction: 'south-east' },
  { text: 'Go south-east then north-east to enter The Immortal Citadel', areas: ['The Immortal Citadel'], direction: 'south-east-then-north-east', npcs: [] },
  { text: 'Talk to NPC (Yulia), kill Pontifex Yulia, Admiral Harton and Spymaster Zerrick, then talk to NPC (Yulia)', npcs: ['Yulia'], enemies: ['Pontifex Yulia','Admiral Harton','Spymaster Zerrick'] },
]);

export const stepsEndgame: Step[] = normalizeSteps([
  { text: 'Go south-west then north-west/west to enter The Burning Forest', areas: ['The Burning Forest'], direction: 'south-west-then-north-west', npcs: [] },
  { text: 'Follow main quest marker south-west to enter The Scorched Grove, help and talk to NPCs (Heorot and Yulia)', areas: ['The Scorched Grove'], direction: 'south-west', npcs: ['Heorot', 'Yulia'] },
  { text: 'In town, talk to NPCs (Chieftain Yulia and Medicine Man) then enter The Heoborean Forest', areas: ['The Heoborean Forest'], direction: 'west', npcs: ['Chieftain Yulia', 'Medicine Man'] },
  { text: 'Enter The Ice Caverns (north), acquire a Bitterwing fang (north-west), and take waypoint to The Heoborean Forest', areas: ['The Ice Caverns'], direction: 'north' },
  { text: 'Continue west to quest marker, enter The Nomad Camp, talk to NPC (Nomad Survivor), then enter The Wengari Fortress', areas: ['The Nomad Camp', 'The Wengari Fortress'], direction: 'west', npcs: ['Nomad Survivor'] },
  { text: 'Follow side quest markers to find the right camp (start north-east), kill Wengari Beastmaster, kill Wengari Matriarch and Patriarch, talk to NPC (Blessed Horn), continue south-west (side quest marker), then take waypoint to The Ice Caverns', areas: ['The Ice Caverns'], direction: 'south-west', enemies: ['Wengari Beastmaster','Wengari Matriarch','Wengari Patriarch'], npcs: ['Blessed Horn'] },
  { text: 'Go north-east or north to enter The Tundra', areas: ['The Tundra'], direction: 'north-east' },
  { text: 'Kill the Eber (north), continue north, talk to NPC (Cliff Edge) and enter The Temple of Heorot', areas: ['The Temple of Heorot'], direction: 'north', enemies: ['Eber'], npcs: ['Cliff Edge'] },
  { text: 'Follow main quest marker north to skip the Spreading Frost and enter Farwood', areas: ['Farwood'], direction: 'north' },
  { text: 'Continue north-east to enter The Frozen Roots', areas: ['The Frozen Roots'], direction: 'north-east' },
  { text: 'Talk to NPC (Grael), continue north-east to enter The Tomb of Morditas, kill the Frostroot Warden, talk to NPCs', areas: ['The Tomb of Morditas'], direction: 'north-east', npcs: ['Grael', 'Tomb Guardian', 'Ancient Spirit'], enemies: ['Frostroot Warden'] },
  { text: 'Hand in quests in town (side and main quests)' },
]);

// Generated leveling guide data for Last Epoch
export const directionEmojis: Record<string, string> = {
  'north': '⬆️',
  'south': '⬇️',
  'east': '➡️',
  'west': '⬅️',
  'north-east': '↗️',
  'north-west': '↖️',
  'south-east': '↘️',
  'south-west': '↙️',
}
export type Step = { text: string; areas?: string[]; npcs?: string[]; enemies?: string[]; direction?: keyof typeof directionEmojis }

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
  { text: 'Skip all NPCs in The Keepers’ Camp and go to The Fortress Gardens', areas: ['The Fortress Gardens'], npcs: [], enemies: [], direction: 'north-west' },
  { text: 'In The Fortress Walls enter The Storerooms to complete the side quest. After leaving, talk to the NPC and head to The Keepers’s Vault', areas: ['The Keepers’s Vault'], npcs: [], enemies: [], direction: 'north-east' },
  { text: 'Talk to Keeper Barthas and continue north immediately. Enter The Northern Road', npcs: ['Keeper Barthas'], enemies: [], direction: 'north-east' },
  { text: 'Speak with the Keeper Guard, portal to town and speak to NPC (main quest), head out east to Ulatri Highlands.', npcs: ['Keeper Guard'], enemies: [], direction: 'east' },
  { text: 'Optionally kill big rares to get exp. Continue to The Osprix Warcamp', direction: 'north-east' },
  { text: 'Continue to The Summit', areas: ['The Summit'], direction: 'north' },
  { text: 'Kill Haruspex Orian (Act 1 boss). Portal to town and talk to the 2 NPCs to get to Act 2.', npcs: [], enemies: ['Haruspex Orian'] },
]);

export const stepsAct2: Step[] = normalizeSteps([
  { text: 'Talk to NPC to take the Shard of the Epoch and continue north. Skip the first NPC and continue to Last Refuge Outskirts', areas: ['Last Refuge Outskirts'], direction: 'north' },
  { text: 'Talk to the NPC to complete the quest, continue north, talk to the first side quest NPC, complete the side quest (south-east → north-west → north-east), then continue north-east to kill the Void Penance. Enter The Council of Chambers', areas: ['The Council of Chambers'], npcs: ['Council NPC'], enemies: ['Void Penance'], direction: 'north-east' },
  { text: 'Talk to the two NPCs to complete the quests and head north-west to The Last Archive', areas: ['The Last Archive'], direction: 'north-west' },
  { text: 'Enter Erza’s Library, complete the side quest, then go back to The Last Archive and continue north-east to Pannion’s Study', areas: ['The Last Archive','Pannion’s Study'], direction: 'north-east' },
  { text: 'Kill the Pannion’s Students. Portal back to town.', npcs: [], enemies: ['Pannion’s Students'] },
  { text: 'Talk to NPCs (side quest north-east, complete side quest west (unique gloves), complete main quest). Head north-east to The Precipice', areas: ['The Precipice'], direction: 'north-east' },
  { text: 'Kill the Idol of Ruin, go through the time rift, loop around to the next time rift.', npcs: [], enemies: ['Idol of Ruin'] },
  { text: 'Back in The Precipice, go east to The Armoury', areas: ['The Precipice','The Armoury'], direction: 'east' },
  { text: 'Clear the waves and kill the boss. Continue north-east, skip the side quest. Follow the main quest marker to The Lower District', areas: ['The Lower District'], direction: 'north-east' },
  { text: 'Kill the Elder Pannion. Talk to the NPC and enter the Time Rift to The End of Time', areas: ['The End of Time'], npcs: [], enemies: ['Elder Pannion'] },
  { text: 'Run directly up the stairs, talk to Elder Gaspar, choose Mastery, enter The Council Chamber', areas: ['The Council Chamber'], npcs: ['Elder Gaspar'], enemies: [] },
]);

export const stepsAct3: Step[] = normalizeSteps([
  { text: 'Talk to NPCs (main quest, respec NPC, dispel barrier) and enter The Sheltered Wood', areas: ['The Sheltered Wood'], npcs: ['Main Quest NPC', 'Respec NPC'], enemies: [], direction: 'south-east' },
  { text: 'Follow main quest marker to The Surface, The Forsaken Trail and Cultist Camp', areas: ['The Surface', 'The Forsaken Trail', 'Cultist Camp'], npcs: [], enemies: [] },
  { text: 'Directly head out north to The Ruins of Welryn', areas: ['The Ruins of Welryn'], direction: 'north' },
  { text: 'Spiral around to enter Welryn Undercity', areas: ['Welryn Undercity'], direction: 'south' },
  { text: 'Talk to NPC (main quest) and kill the three Soul Repositories. Talk to NPC again and portal to town' },
  { text: 'Directly go south to Welryn Docks', areas: ['Welryn Docks'], direction: 'south' },
  { text: 'Follow main quest marker, kill the Void Centipede, take Symbol of Hope. Portal to town' },
  { text: 'Talk to NPC (main quest). Go east to The Ritual Site', areas: ['The Ritual Site'], direction: 'east' },
  { text: 'Talk to NPC (main quest) and kill the Void Amalgamation. Continue east to The Shattered Valley', areas: ['The Shattered Valley'], direction: 'east' },
  { text: 'Go directly north to The Abandoned Tunnel and follow quest marker to The Lost Refuge', areas: ['The Abandoned Tunnel'], direction: 'north-east' },
  { text: 'Follow quest marker (east), talk to the Old Tome to complete the side quest and take waypoint to The Shattered Valley', areas: ['The Shattered Valley'], direction: 'east' },
  { text: 'Continue south-east, enter Time Rift to The Ancient Forest. Go north-east and kill the Primeval Dragon. Take waypoint to The Shattered Valley in the Ruined Era', areas: ['The Shattered Valley'] },
  { text: 'Go south-east again, pass the Time Rift towards north-east and enter The Courtyard', areas: ['The Courtyard'], direction: 'south-east' },
  { text: 'Turn south-east at waypoint and follow north to kill the Temple Guardian and enter The Temple of Eterra', areas: ['The Temple of Eterra'], direction: 'north-east' },
  { text: 'Follow main quest marker and enter The Lotus Halls', areas: ['The Lotus Halls'], direction: 'north-east' },
  { text: 'Directly go north-west to get a Shard, then take waypoint to The Council Chambers', areas: ['The Council Chambers'], direction: 'north-west' },
  { text: 'Talk to NPC, take waypoint to The Lotus Halls, continue north-east to The Sanctum Bastille', areas: ['The Lotus Halls'], direction: 'north-east' },
  { text: 'Follow main quest marker to enter The End of Ruin, kill the Emperor’s Remains, talk to NPC to portal to The End of Time', areas: ['The End of Ruin'] },
  { text: 'Directly go upstairs to Elder Gaspar and enter portal to Imperial Era (The Outcast Camp)', areas: ['The Outcast Camp'] },
]);

export const stepsAct4: Step[] = normalizeSteps([
  { text: 'Optionally craft a bit, head south-west to Welryn Outskirts', areas: ['Welryn Outskirts'], direction: 'south-west' },
  { text: 'Follow quest marker west to enter Imperial Welryn', areas: ['Imperial Welryn'], direction: 'west' },
  { text: 'Ignore quest marker and go north-west to The Soul Wardens’ Road', areas: ['The Soul Wardens’ Road'], direction: 'north-west' },
  { text: 'Kill the zombie waves and continue west to enter The Risen Lake', areas: ['The Risen Lake'], direction: 'west' },
  { text: 'Enter Time Rift to The Corrupted Lake. Go west and spiral around clockwise until you kill the Prophet of Ruin/Idol of Ruin (side quest). Take waypoint to The Risen Lake.', areas: ['The Risen Lake'] },
  { text: 'Pass the Time Rift, click the stone for the bridge, ignore quest marker and continue north-east and north-west to enter The Fallen Tower', areas: ['The Fallen Tower'], direction: 'north-east' },
  { text: 'Follow quest marker north-west to enter Imperial Thetima', areas: ['Imperial Thetima'], direction: 'north-west' },
  { text: 'Follow quest marker west to enter The Darkling Pier', areas: ['The Darkling Pier'], direction: 'west' },
  { text: 'Continue east to enter The Imperial Dreadnought', areas: ['The Imperial Dreadnought'], direction: 'east' },
  { text: 'Follow quest marker east to enter The Dreadnought’s Deck', areas: ['The Dreadnought’s Deck'], direction: 'east' },
  { text: 'Follow quest marker north-west then west, kill Admiral Harton. Talk to NPCs (Alric) and the Dreadnought’s Railing.', direction: 'north-west, west' },
]);

export const stepsAct5: Step[] = normalizeSteps([
  { text: 'Talk to NPC (Alric). Go north-east to enter The Majasan Desert', areas: ['The Majasan Desert'], direction: 'north-east' },
  { text: 'Follow quest marker, talk to NPC (Rouj Zabat), enter The Wraith Dunes', areas: ['The Wraith Dunes'], direction: 'north-east' },
  { text: 'Go north and north-east to follow main quest marker and enter Maj’elka', areas: ['Maj’elka'], direction: 'north-east' },
  { text: 'Talk to NPC (Alric), go downstairs, continue south-east, kill Venator Ealos, talk to NPC, continue north-east and kill the Bone Furnace before entering The Sapphire Quarter' },
  { text: 'Continue north, kill the Stygian Warden, talk to NPC, continue north-west and north, kill Praetor Vul’arta, talk to NPC and enter portal to Maj’elka', areas: ['Maj’elka'] },
  { text: 'Go east to The Oracle’s Abode, talk to NPC (Shrine Maiden), take waypoint to The Shining Cove', areas: ['The Oracle’s Abode'], direction: 'east' },
  { text: 'Go east into Time Rift to The Ruined Coast, kill Ortra’ek the Survivor, click the Sapphire Tablet, enter the Temporal Sanctum, take waypoint to The Ruined Coast (Imperial Era)', areas: ['The Ruined Coast'], direction: 'east' },
  { text: 'Talk to NPC (Shrine Maiden) and Oracle, continue north to The Maj’elkan Catacombs', areas: ['The Maj’elkan Catacombs'], direction: 'north' },
  { text: 'Go east, south, then north-east to enter Titan’s Canyon', areas: ['Titan’s Canyon'], direction: 'north-east' },
  { text: 'Follow main quest marker, kill Spymaster Zerrick, and enter The Maj’elka Waystation', areas: ['The Maj’elka Waystation'] },
  { text: 'Follow main quest marker and talk to NPC (Alric)' },
]);

export const stepsAct6: Step[] = normalizeSteps([
  { text: 'Talk to NPC (Yulia), go north into The Rust Lands', areas: ['The Rust Lands'], direction: 'north' },
  { text: 'Follow main quest marker east to enter The Lower Sewers', areas: ['The Lower Sewers'], direction: 'east' },
  { text: 'Follow main quest marker north to enter The Barren Aqueduct', areas: ['The Barren Aqueduct'], direction: 'north' },
  { text: 'Follow main quest marker north, kill the rare mob, talk to NPC, and enter Necropolis of the Deep', areas: ['Necropolis of the Deep'], direction: 'north' },
  { text: 'Follow main quest marker south-east to enter Yulia’s Haven', areas: ['Yulia’s Haven'], direction: 'south-east' },
  { text: 'Talk to both NPCs then continue north-west into Nests of the Fallen', areas: ['Nests of the Fallen'], direction: 'north-west' },
  { text: 'Follow side quest marker, kill Ulaca Maggot Tongue, portal to town' },
  { text: 'Talk to NPC (Alric), enter The Upper Necropolis', areas: ['The Upper Necropolis'], direction: 'south-east' },
  { text: 'Follow main quest marker north-east to enter The Citadel Sewers', areas: ['The Citadel Sewers'], direction: 'north-east' },
  { text: 'Destroy the three Imperial Watchers, continue south-east to enter The Immortal Summit', areas: ['The Immortal Summit'], direction: 'south-east' },
  { text: 'Go south-east then north-east to enter The Immortal Citadel', areas: ['The Immortal Citadel'], direction: 'north-east' },
  { text: 'Talk to NPC (Yulia), kill Pontifex Yulia, Admiral Harton and Spymaster Zerrick, then talk to NPC (Yulia)' },
]);


export const stepsEndgame: Step[] = normalizeSteps([
  { text: 'Go south-west then north-west/west to enter The Burning Forest', areas: ['The Burning Forest'], direction: 'south-west' },
  { text: 'Follow main quest marker south-west to enter The Scorched Grove, help and talk to NPCs (Heorot and Yulia)', areas: ['The Scorched Grove'], direction: 'south-west' },
  { text: 'Talk to NPCs in town then enter The Heoborean Forest', areas: ['The Heoborean Forest'], direction: 'west' },
  { text: 'Enter The Ice Caverns, acquire a Bitterwing fang, and take waypoint to The Ice Caverns', areas: ['The Ice Caverns'], direction: 'north' },
  { text: 'Continue west to quest marker, enter The Nomad Camp, talk to NPC (Nomad Survivor), then enter The Nomad Camp', areas: ['The Nomad Camp'], direction: 'west' },
  { text: 'Follow side quest markers, kill Wengari Beastmaster, kill Wengari Matriarch and Patriarch, talk to NPC (Blessed Horn), then take waypoint to The Ice Caverns', areas: ['The Ice Caverns'] },
  { text: 'Go north-east to enter The Tundra', areas: ['The Tundra'], direction: 'north-east' },
  { text: 'Kill the Eber and continue north to enter The Temple of Heorot', areas: ['The Temple of Heorot'], direction: 'north' },
  { text: 'Follow main quest marker north to skip the Spreading Frost and enter Farwood', areas: ['Farwood'], direction: 'north' },
  { text: 'Continue north-east to enter The Frozen Roots', areas: ['The Frozen Roots'], direction: 'north-east' },
  { text: 'Talk to NPC (Grael), continue north-east to enter The Tomb of Morditas, kill the Frostroot Warden, talk to NPCs', areas: ['The Tomb of Morditas'], direction: 'north-east' },
  { text: 'Hand in quests in town (side and main quests)' },
]);

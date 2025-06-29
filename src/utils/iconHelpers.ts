// Import all icons as modules for proper Vite handling
import neutralIcon from "../assets/icons/Neutral.png";
import fireIcon from "../assets/icons/Fire.png";
import waterIcon from "../assets/icons/Water.png";
import grassIcon from "../assets/icons/Grass.png";
import electricIcon from "../assets/icons/Electric.png";
import iceIcon from "../assets/icons/Ice.png";
import groundIcon from "../assets/icons/Ground.png";
import dragonIcon from "../assets/icons/Dragon.png";
import darkIcon from "../assets/icons/Dark.png";

import handiworkIcon from "../assets/icons/handiwork.png";
import transportingIcon from "../assets/icons/transporting.png";
import farmingIcon from "../assets/icons/farming.png";
import gatheringIcon from "../assets/icons/gathering.png";
import miningIcon from "../assets/icons/mining.png";
import plantingIcon from "../assets/icons/planting.png";
import lumberingIcon from "../assets/icons/lumbering.png";
import medicineProductionIcon from "../assets/icons/medicine_production.png";
import kindlingIcon from "../assets/icons/kindling.png";
import wateringIcon from "../assets/icons/watering.png";
import coolingIcon from "../assets/icons/cooling.png";
import generatingElectricityIcon from "../assets/icons/generating_electricity.png";

// Mapping for element names to imported icons
const elementIconMap: Record<string, string> = {
  Neutral: neutralIcon,
  Fire: fireIcon,
  Water: waterIcon,
  Grass: grassIcon,
  Electric: electricIcon,
  Ice: iceIcon,
  Ground: groundIcon,
  Dragon: dragonIcon,
  Dark: darkIcon,
};

// Mapping for work skill names to imported icons
const workSkillIconMap: Record<string, string> = {
  handiwork: handiworkIcon,
  transporting: transportingIcon,
  farming: farmingIcon,
  gathering: gatheringIcon,
  mining: miningIcon,
  planting: plantingIcon,
  lumbering: lumberingIcon,
  medicine_production: medicineProductionIcon,
  kindling: kindlingIcon,
  watering: wateringIcon,
  cooling: coolingIcon,
  generating_electricity: generatingElectricityIcon,
};

/**
 * Gets the icon path for a given element
 * @param element - The element name (e.g., "Fire", "Water")
 * @returns The full path to the element icon
 */
export const getElementIcon = (element: string): string => {
  const iconPath = elementIconMap[element];
  if (!iconPath) {
    console.warn(`No icon found for element: ${element}`);
    return neutralIcon; // fallback to neutral
  }
  return iconPath;
};

/**
 * Gets the icon path for a given work skill
 * @param skill - The work skill name (e.g., "handiwork", "farming")
 * @returns The full path to the work skill icon
 */
export const getWorkSkillIcon = (skill: string): string => {
  const iconPath = workSkillIconMap[skill];
  if (!iconPath) {
    console.warn(`No icon found for work skill: ${skill}`);
    return handiworkIcon; // fallback to handiwork
  }
  return iconPath;
};

/**
 * Formats work skill name for display
 * @param skill - The work skill name (e.g., "medicine_production")
 * @returns Formatted skill name (e.g., "Medicine Production")
 */
export const formatWorkSkillName = (skill: string): string => {
  return skill.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Exercise Translation Utilities
 *
 * Translates English exercise data from ExerciseDB API to Portuguese
 */

// Body Parts Translation
export const bodyPartTranslations: Record<string, string> = {
  'back': 'costas',
  'cardio': 'cardio',
  'chest': 'peito',
  'lower arms': 'antebraços',
  'lower legs': 'panturrilhas',
  'neck': 'pescoço',
  'shoulders': 'ombros',
  'upper arms': 'bíceps/tríceps',
  'upper legs': 'coxas',
  'waist': 'abdômen',
};

// Equipment Translation
export const equipmentTranslations: Record<string, string> = {
  'assisted': 'assistido',
  'band': 'elástico',
  'barbell': 'barra',
  'body weight': 'peso corporal',
  'bosu ball': 'bola bosu',
  'cable': 'cabo',
  'dumbbell': 'halter',
  'elliptical machine': 'elíptico',
  'ez barbell': 'barra w',
  'hammer': 'martelo',
  'kettlebell': 'kettlebell',
  'leverage machine': 'máquina',
  'medicine ball': 'bola medicinal',
  'olympic barbell': 'barra olímpica',
  'resistance band': 'faixa elástica',
  'roller': 'rolo',
  'rope': 'corda',
  'skierg machine': 'simulador de esqui',
  'sled machine': 'trenó',
  'smith machine': 'smith machine',
  'stability ball': 'bola suíça',
  'stationary bike': 'bicicleta ergométrica',
  'stepmill machine': 'escada ergométrica',
  'tire': 'pneu',
  'trap bar': 'barra trap',
  'upper body ergometer': 'ergômetro de braço',
  'weighted': 'com peso',
  'wheel roller': 'roda abdominal',
};

// Target Muscle Translation
export const targetTranslations: Record<string, string> = {
  'abs': 'abdominais',
  'adductors': 'adutores',
  'abductors': 'abdutores',
  'biceps': 'bíceps',
  'calves': 'panturrilhas',
  'cardiovascular system': 'sistema cardiovascular',
  'delts': 'deltoides',
  'forearms': 'antebraços',
  'glutes': 'glúteos',
  'hamstrings': 'posteriores de coxa',
  'lats': 'dorsais',
  'levator scapulae': 'levantador da escápula',
  'pectorals': 'peitorais',
  'quads': 'quadríceps',
  'serratus anterior': 'serrátil anterior',
  'spine': 'coluna',
  'traps': 'trapézio',
  'triceps': 'tríceps',
  'upper back': 'costas superiores',
};

/**
 * Translates a body part name from English to Portuguese
 */
export function translateBodyPart(bodyPart: string): string {
  const lowercased = bodyPart.toLowerCase();
  return bodyPartTranslations[lowercased] || bodyPart;
}

/**
 * Translates equipment name from English to Portuguese
 */
export function translateEquipment(equipment: string): string {
  const lowercased = equipment.toLowerCase();
  return equipmentTranslations[lowercased] || equipment;
}

/**
 * Translates target muscle name from English to Portuguese
 */
export function translateTarget(target: string): string {
  const lowercased = target.toLowerCase();
  return targetTranslations[lowercased] || target;
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

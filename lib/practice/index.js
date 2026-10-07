import { CLASS10 } from './class10';

// Every chapter that has live question generators. Add a class by adding its chapters here.
export const ALL = [...CLASS10];

export const PRACTICE_CLASSES = [
  { key: 'class-10', label: 'Class 10' },
].filter(c => ALL.some(ch => ch.cls === c.key));

export const chaptersOf = cls => ALL.filter(ch => ch.cls === cls);

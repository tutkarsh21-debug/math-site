import { CLASS10 } from './class10';
import { CLASS9 } from './class9';
import { CLASS8 } from './class8';

// Every chapter that has live question generators. Add a class by adding its chapters here.
export const ALL = [...CLASS8, ...CLASS9, ...CLASS10];

export const PRACTICE_CLASSES = [
  { key: 'class-8', label: 'Class 8' },
  { key: 'class-9', label: 'Class 9' },
  { key: 'class-10', label: 'Class 10' },
].filter(c => ALL.some(ch => ch.cls === c.key));

export const chaptersOf = cls => ALL.filter(ch => ch.cls === cls);

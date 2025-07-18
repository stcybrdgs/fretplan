import type { PracticeArea, ProjectArea } from '@/types'

export const initialPracticeAreas: PracticeArea[] = [
  {
    id: 'demo-daily-practice',
    name: 'Demo: Daily Practice',
    color: 'purple',
    createdAtUTC: new Date(),
    taskCards: [
      {
        id: 'demo-scales-card',
        name: 'Demo: Major Scales Practice',
        isExpanded: true,
        color: 'green',
        createdAtUTC: new Date(),
        todos: [
          {
            id: 'demo-c-major-scale',
            name: 'Demo: C Major Scale - 2 octaves',
            completed: false,
            createdAtUTC: new Date(),
          },
          {
            id: 'demo-g-major-scale',
            name: 'Demo: G Major Scale - practice timing',
            completed: true,
            createdAtUTC: new Date(),
          },
        ],
      },
      {
        id: 'demo-chord-progressions',
        name: 'Demo: Chord Progressions',
        isExpanded: false,
        color: 'blue',
        createdAtUTC: new Date(),
        todos: [
          {
            id: 'demo-ii-v-i-progression',
            name: 'Demo: ii-V-I in C Major',
            completed: false,
            createdAtUTC: new Date(),
          },
          {
            id: 'demo-circle-of-fifths',
            name: 'Demo: Circle of Fifths practice',
            completed: false,
            createdAtUTC: new Date(),
          },
        ],
      },
    ],
  },
]

export const initialProjects: ProjectArea[] = [
  {
    id: 'demo-original-song-1',
    name: 'Demo: Original Song #1',
    color: 'orange',
    createdAtUTC: new Date(),
    taskCards: [
      {
        id: 'demo-song-structure',
        name: 'Demo: Song Structure',
        isExpanded: true,
        color: 'purple',
        createdAtUTC: new Date(),
        todos: [
          {
            id: 'demo-verse-melody',
            name: 'Demo: Finalize verse melody',
            completed: false,
            createdAtUTC: new Date(),
          },
          {
            id: 'demo-chorus-chords',
            name: 'Demo: Choose chorus chord progression',
            completed: false,
            createdAtUTC: new Date(),
          },
        ],
      },
      {
        id: 'demo-recording-prep',
        name: 'Demo: Recording Preparation',
        isExpanded: false,
        color: 'teal',
        createdAtUTC: new Date(),
        todos: [
          {
            id: 'demo-practice-timing',
            name: 'Demo: Practice with metronome',
            completed: true,
            createdAtUTC: new Date(),
          },
          {
            id: 'demo-arrange-parts',
            name: 'Demo: Arrange all instrument parts',
            completed: false,
            createdAtUTC: new Date(),
          },
        ],
      },
    ],
  },
]


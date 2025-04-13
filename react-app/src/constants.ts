// import data files
import { ARTISTS } from "./data/artists";
import { EXHIBITIONS } from "./data/exhibitions";
import { PROJECTS } from "./data/projects";

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  links?: string[];
  projects?: string[];
}

export interface Exhibition {
  id: string;
  name: string;
  img: string;
  desc: string;
  footer: string;
  startDate: string;
  endDate: string;
  projects: string[];
  mediaGallery: string[];
  isFeatured?: boolean;
}

export interface Project {
  id: string;
  name: string;
  img: string;
  desc: string;
  artists: string[];
  medium?: string;
  exhibitions: string[];
  mediaGallery: string[];
  links?: string[];
}


export const PLACEHOLDER_IMAGE_LG = '/600x600.png'
export const PLACEHOLDER_IMAGE_MD = '/300x300.png'
export const PLACEHOLDER_IMAGE_SM = '/150x150.png'

export const UNKNOWN_ARTIST: Artist = {
  id: 'Unknown',
  name: 'Unknown Artist',
}

export const PLACEHOLDER_ARTISTS: Artist[] = [
  {
    id: 'Maddy_Gillis',
    name: 'Madeline Gillis',
  },
  {
    id: 'Angelina_Almanza',
    name: 'Angelina Almanza',
  },
  {
    id: 'Marko_Cindric',
    name: 'Marko Cindric',
  },
  {
    id: 'Mary_Frances_Howard',
    name: 'Mary Frances Howard',
  },
  {
    id: 'CJ_Luukkonen',
    name: 'CJ Luukkonen',
  },
  {
    id: 'Nicholas_Pienczak',
    name: 'Nicholas Pienczak',
  },
  {
    id: 'Tyler_Nguyen',
    name: 'Tyler Nguyen',
  },
  {
    id: 'Mad_Holl',
    name: 'Mad Holl',
  },
  {
    id: 'Sara_Abruelish',
    name: 'Sara Abruelish',
  },
  {
    id: 'Natalie_Shupe',
    name: 'Natlie Shupe',
  },
]

export const PLACEHOLDER_PROJECTS: Project[] = [
  {
    id: 'Project1',
    name: 'Project 1',
    img: PLACEHOLDER_IMAGE_LG,
    desc: '<p><em>Tabletop Minigolf</em> is an invitation to connect, play, and rediscover the simple pleasure of a shared game.</p><p>Two players face off, each using a putter and a ball to navigate a dynamic course filled with moving obstacles. These shifting elements are all powered by technology and code connected to an Arduino UNO device. The goal is simple: complete the course with fewer hits than your partner.</p><p>Inspired by gaming experiences that offer breaks from the everyday, I set out to create an experience that momentarily draws people out of their routines, sparking spontaneous engagement and connection with fellow participants.</p><p>What sets <em>Tabletop Minigolf</em> apart is the emphasis on movement and unpredictability. A portion of the course is decorated with traps and decisions the player must make to proceed. Unlike most traditional tabletop games, this experience incorporates dynamic shifting technological elements that require players to think critically and adjust real-time strategies.</p> <p>But It’s more than just the game itself; it’s about the shared experience between two players. In an era where digital interactions often replace face-to-face engagement, this project is a reminder of the joy found in real-world play. Whether competing against a friend or a stranger, <em>Tabletop Minigolf</em> invites players to let down their guard, share a moment of friendly competition, and step away from the demands of daily life if only for a moment.</p>',
    artists: [
      PLACEHOLDER_ARTISTS[0].id,
      PLACEHOLDER_ARTISTS[1].id,
      PLACEHOLDER_ARTISTS[2].id,
      PLACEHOLDER_ARTISTS[3].id,
      PLACEHOLDER_ARTISTS[4].id,
      PLACEHOLDER_ARTISTS[5].id,
    ],
    exhibitions: [
      'Fragments2024',
    ],
    mediaGallery: [
    ]
  },
  {
    id: 'Project2',
    name: 'Super Long Project Name Two',
    img: PLACEHOLDER_IMAGE_LG,
    desc: 'Description for Project 2',
    artists: [
      PLACEHOLDER_ARTISTS[8].id,
    ],
    exhibitions: [
      'Fragments2024',
    ],
    mediaGallery: [
    ]
  },
  {
    id: 'Project3',
    name: 'Project 3',
    img: PLACEHOLDER_IMAGE_LG,
    desc: 'Description for Project 3',
    artists: [
      PLACEHOLDER_ARTISTS[6].id,
      PLACEHOLDER_ARTISTS[7].id,
    ],
    exhibitions: [
      'Fragments2024',
    ],
    mediaGallery: [
    ]
  },
]

export const PLACEHOLDER_EXHIBITIONS: Exhibition[] = [
  {
    isFeatured: true,
    id: 'Fragments2024',
    name: 'NM24: Fragments',
    img: PLACEHOLDER_IMAGE_LG,
    desc: 'Fragments showcases the work of artists who explore the concept of fragmentation in their work.',
    footer: 'The Fragments exhibition ran from April 17th 2024 to April 23rd 2024.',
    startDate: '2024-04-17',
    endDate: '2024-04-23',
    projects: [
      PLACEHOLDER_PROJECTS[0].id,
      PLACEHOLDER_PROJECTS[1].id,
      PLACEHOLDER_PROJECTS[2].id
    ],
    mediaGallery: [
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
    ],
  },
  {
    id: 'Exhibition2',
    name: 'Exhibition 2',
    img: PLACEHOLDER_IMAGE_LG,
    desc: 'Description for Exhibition 2',
    footer: 'The Exhibition 2 ran from April 24th 2024 to April 30th 2024.',
    startDate: '2024-04-24',
    endDate: '2024-04-30',
    projects: [
      PLACEHOLDER_PROJECTS[0].id,
      PLACEHOLDER_PROJECTS[1].id,
      PLACEHOLDER_PROJECTS[2].id
    ],
    mediaGallery: [
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
    ],

  },
  {
    id: 'Exhibition3',
    name: 'Exhibition 3',
    img: PLACEHOLDER_IMAGE_LG,
    desc: 'Description for Exhibition 3',
    footer: 'The Exhibition 3 ran from May 1st 2024 to May 7th 2024.',
    startDate: '2024-05-01',
    endDate: '2024-05-07',
    projects: [
      PLACEHOLDER_PROJECTS[0].id,
      PLACEHOLDER_PROJECTS[1].id,
      PLACEHOLDER_PROJECTS[2].id
    ],
    mediaGallery: [
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
      PLACEHOLDER_IMAGE_SM,
    ],
  },
]

export const PLACEHOLDER_DATA = {
  exhibitions: PLACEHOLDER_EXHIBITIONS,
  artists: PLACEHOLDER_ARTISTS,
  projects: PLACEHOLDER_PROJECTS,
}

export const SITE_DATA = {
  exhibitions: EXHIBITIONS,
  artists: ARTISTS,
  projects: PROJECTS,
}

export {}
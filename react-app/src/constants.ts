
export interface Artist {
  id: string;
  name: string;
}

export interface Exhibition {
  id: string;
  name: string;
  img: string;
  desc: string;
  footer: string;
  startDate: string;
  endDate: string;
  artists: Artist[];
  mediaGallery: string[];
  isFeatured?: boolean;
}

export interface Project {
  id: string;
  name: string;
  desc: string;
  startDate: string;
  endDate: string;
  artists: Artist[];
  mediaGallery: string[];
}


export const PLACEHOLDER_IMAGE_LG = '/600x600.png'
export const PLACEHOLDER_IMAGE_MD = '/300x300.png'
export const PLACEHOLDER_IMAGE_SM = '/150x150.png'

export const PLACEHOLDER_ARTISTS: Artist[] = [
  {
    id: 'Artist1',
    name: 'Artist 1',
  },
  {
    id: 'Artist2',
    name: 'Artist 2',
  },
  {
    id: 'Artist3',
    name: 'Artist 3',
  },
  {
    id: 'Artist4',
    name: 'Artist 4',
  },
  {
    id: 'Artist5',
    name: 'Artist 5',
  },
  {
    id: 'Artist6',
    name: 'Artist 6',
  },
  {
    id: 'Artist7',
    name: 'Artist 7',
  },
  {
    id: 'Artist8',
    name: 'Artist 8',
  },
  {
    id: 'Artist9',
    name: 'Artist 9',
  },
  {
    id: 'Artist10',
    name: 'Artist 10',
  },
]

export const PLACEHOLDER_PROJECTS: Project[] = [
]

export const PLACEHOLDER_EXHIBITIONS: Exhibition[] = [
  {
    isFeatured: true,
    id: 'Fragments2024',
    name: 'Fragments (NM24)',
    img: PLACEHOLDER_IMAGE_LG,
    desc: 'Fragments showcases the work of artists who explore the concept of fragmentation in their work.',
    footer: 'The Fragments exhibition ran from April 17th 2024 to April 23rd 2024.',
    startDate: '2024-04-17',
    endDate: '2024-04-23',
    artists: [
      PLACEHOLDER_ARTISTS[0],
      PLACEHOLDER_ARTISTS[1],
      PLACEHOLDER_ARTISTS[2],
      PLACEHOLDER_ARTISTS[3],
      PLACEHOLDER_ARTISTS[4],
      PLACEHOLDER_ARTISTS[5],

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
    artists: [
      PLACEHOLDER_ARTISTS[0],
      PLACEHOLDER_ARTISTS[1],
      PLACEHOLDER_ARTISTS[2],
      PLACEHOLDER_ARTISTS[3],
      PLACEHOLDER_ARTISTS[4],
      PLACEHOLDER_ARTISTS[5],

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
    artists: [
      PLACEHOLDER_ARTISTS[0],
      PLACEHOLDER_ARTISTS[1],
      PLACEHOLDER_ARTISTS[2],
      PLACEHOLDER_ARTISTS[3],
      PLACEHOLDER_ARTISTS[4],
      PLACEHOLDER_ARTISTS[5],

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

export {}
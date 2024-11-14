
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
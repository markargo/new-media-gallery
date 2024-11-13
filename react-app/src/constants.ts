
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

export const PLACEHOLDER_EXHIBITIONS: Exhibition[] = [
  {
    id: 'Fragments2024',
    name: 'Fragments (NM24)',
    img: '/600x600.png',
    desc: 'Fragments showcases the work of artists who explore the concept of fragmentation in their work.',
    footer: 'The Fragments exhibition ran from April 17th 2024 to April 23rd 2024.',
    startDate: '2024-04-17',
    endDate: '2024-04-23',
    artists: [
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
    ],
    mediaGallery: [
      '/150x150.png',
      '/150x150.png',
      '/150x150.png',
      '/150x150.png',
      '/150x150.png',
      '/150x150.png',
      '/150x150.png',
    ],
  },
  {
    id: 'Exhibition2',
    name: 'Exhibition 2',
    img: 'https://placeholder.co/600x600',
    desc: 'Description for Exhibition 2',
    footer: 'The Exhibition 2 ran from April 24th 2024 to April 30th 2024.',
    startDate: '2024-04-24',
    endDate: '2024-04-30',
    artists: [
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
    ],
    mediaGallery: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
  },
  {
    id: 'Exhibition3',
    name: 'Exhibition 3',
    img: 'https://placeholder.co/600x600',
    desc: 'Description for Exhibition 3',
    footer: 'The Exhibition 3 ran from May 1st 2024 to May 7th 2024.',
    startDate: '2024-05-01',
    endDate: '2024-05-07',
    artists: [
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
    ],
    mediaGallery: [
      'https://placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
  },
]

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


export {}
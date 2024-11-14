
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
  img: string;
  desc: string;
  startDate: string;
  endDate: string;
  artists: string[];
  exhibitions: string[];
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
  {
    id: 'Project1',
    name: 'Project 1',
    img: PLACEHOLDER_IMAGE_LG,
    desc: '<p><b>Project 1</b> is a collaborative effort that brings together a diverse group of artists, each contributing their unique perspectives and skills to create a multifaceted experience. The project explores themes of identity, community, and transformation, using a variety of media including painting, sculpture, digital art, and performance.</p><p>Through this project, the artists aim to challenge conventional notions of art and push the boundaries of their respective disciplines. The exhibition invites viewers to engage with the artworks on a deeper level, encouraging them to reflect on their own experiences and perceptions.</p><p>By fostering a dialogue between the artists and the audience, <b>Project 1</b> seeks to create a space for meaningful exchange and connection. The project is not only a showcase of individual talent but also a testament to the power of collaboration and the potential for art to inspire change. Each piece in the exhibition is a testament to the artists dedication and passion, offering a glimpse into their creative processes and the stories behind their work. <b>Project 1</b> is a celebration of artistic expression and a reminder of the importance of creativity in our lives.</p>',
    startDate: '2024-04-17',
    endDate: '2024-04-23',
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
    startDate: '2024-04-24',
    endDate: '2024-04-30',
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
    startDate: '2024-05-01',
    endDate: '2024-05-07',
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
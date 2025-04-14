import { PROJECTS } from './projects'; // Assuming projects is an array of project objects
import { ARTISTS } from './artists'; // Assuming artists is an array of artist objects
import { EXHIBITIONS } from './exhibitions'; // Assuming exhibitions is an array of exhibition objects
import { Artist, Project } from '../constants';

class Data {
  private static instance: Data;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  // Method to get the singleton instance
  public static data(): Data {
    if (!Data.instance) {
      Data.instance = new Data();
    }
    return Data.instance;
  }

  // Static method to fetch all projects
  public static allProjects(): any[] {
    return PROJECTS; // Assuming `projects` is imported or defined elsewhere
  }

  // Static method to fetch a project by ID
  public static project(id: string): any | undefined {
    return PROJECTS.find(project => project.id === id); // Assuming `projects` is an array
  }

  public static projects(ids: string[]): any | undefined {
    if (!ids || ids.length === 0) {
      return [];
    }
    return ids.map(id => Data.project(id)).filter(project => project !== undefined);
  }

  // create accessors for artists and exhibitions
  public static allArtists(): any[] {
    return ARTISTS; // Assuming `artists` is imported or defined elsewhere
  }

  public static artist(id: string): any | undefined {
    return ARTISTS.find(artist => artist.id === id); // Assuming `artists` is an array
  }

  public static artists(ids: string[]): any | undefined {
    if (!ids || ids.length === 0) {
      return [];
    }
    return ids.map(id => Data.artist(id)).filter(artist => artist !== undefined);
  }

  public static artistsFromProjectId(projectId: string): Artist[] {
    const project = Data.project(projectId);
    if (!project) {
      return [];
    }
    return Data.artistsFromProject(project);
  };

  public static artistsFromProject(project: Project): Artist[] {
    const artists: Artist[] = [];
    if (!project || !project.artists) {
      return artists;
    }
    project.artists.forEach(artistId => {
      const artist = Data.artist(artistId);
      if (artist) {
        artists.push(artist);
      }
    });
    return artists;
  }

  public static artistsFromProjectIds(projectIds: string[]): Artist[] {
    const artists: Artist[] = [];
    if (!projectIds || projectIds.length === 0) {
      return artists;
    }
    projectIds.forEach(projectId => {
      const project = Data.project(projectId);
      if (project) {
        const projectArtists = Data.artistsFromProject(project);
        artists.push(...projectArtists);
      }
    });
    return artists;
  }

  public static artistsFromProjects(projects: Project[]): Artist[] {
    const artists: Artist[] = [];
    return artists;
  }

  public static allExhibitions(): any[] {
    return EXHIBITIONS; // Assuming `exhibitions` is imported or defined elsewhere
  }

  public static exhibition(id: string): any | undefined {
    return EXHIBITIONS.find(exhibition => exhibition.id === id); // Assuming `exhibitions` is an array
  }

  public static exhibitions(ids: string[]): any | undefined {
    if (!ids || ids.length === 0) {
      return [];
    }
    return ids.map(id => Data.exhibition(id)).filter(exhibition => exhibition !== undefined);
  }

}

// Example usage:
// const allProjects = DataService.getProjects();
// const singleProject = DataService.getProjectById('META25-tabletop-minigolf');

export default Data;



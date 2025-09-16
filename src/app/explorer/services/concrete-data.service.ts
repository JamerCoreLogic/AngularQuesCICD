import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, Subscriber } from 'rxjs';
import { IDataService, NodeContent } from '../shared/types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from '../../StaticVariable';
import { NgxSpinnerService } from 'ngx-spinner';


let MOCK_FOLDERS = [
  { id: 1, name: 'Music', path: 'music' },
  { id: 2, name: 'Movies', path: 'movies' },
  { id: 3, name: 'Books', path: 'books' },
  { id: 4, name: 'Games', path: 'games' },
  { id: 5, name: 'Rock', path: 'music/rock' },
  { id: 6, name: 'Jazz', path: 'music/jazz' },
  { id: 7, name: 'Classical', path: 'music/classical' },
  { id: 15, name: 'Aerosmith', path: 'music/rock/aerosmith' },
  { id: 16, name: 'AC/DC', path: 'music/rock/acdc' },
  { id: 17, name: 'Led Zeppelin', path: 'music/rock/ledzeppelin' },
  { id: 18, name: 'The Beatles', path: 'music/rock/thebeatles' },
];

let MOCK_FILES = [
  { id: 428, name: 'PDF.txt', path: '', content: 'hi, this is an example', fileType: "application/pdf" },
  { id: 4281, name: 'TXT.txt', path: '', content: 'hi, this is an example', fileType: "txt" },
  { id: 28, name: 'aaaaaThriller.txt', path: 'music/rock/thebeatles/thriller', content: 'hi, this is an example' },
  { id: 29, name: 'Back in the U.S.S.R.txt', path: 'music/rock/thebeatles', content: 'hi, this is an example' },
  { id: 30, name: 'All You Need Is Love.txt', path: 'music/rock/thebeatles', content: 'hi, this is an example' },
  { id: 31, name: 'Hey Jude.txt', path: 'music/rock/ledzeppelin/heyjude', content: 'hi, this is an example' },
  { id: 32, name: 'Rock And Roll All Nite.txt', path: 'music/rock/ledzeppelin/rockandrollallnight', content: 'hi, this is an example' },
];

interface ExampleNode {
  name?: string;
  path?: string;
  content?: string;
  id: number | string;
}

@Injectable({
  providedIn: 'root'
})
export class ConcreteDataService implements IDataService<ExampleNode> {
  apiUrl: string = '';
  videoApiUrl: string = '';
  fileApiUrl: string = '';

  constructor(private http:HttpClient,private spinner: NgxSpinnerService) { 
  }

  private id = 0;
  private folderId = 20;

  getCurrentPath(path: string): Observable<any> {
    // console.log(path);
    return of({});
  }

  rightClick(node: ExampleNode): Observable<any> {
    return of({});
  }

  leftClick(node: ExampleNode): Observable<any> {
    return of({});
  }

  emptyClick() {
    return of({});
  }

  download(node: ExampleNode): Observable<any> {
    return new Observable(observer => {
      const a = document.createElement('a');
      a.href = `${AppSettings.API_ENDPOINT}${AppSettings.Downloadfile}?filename=${node.path}`;
      a.download = node.name || '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      observer.next({ success: true });
      observer.complete();
    });
  }

  uploadFiles(node: ExampleNode, files: File[]): Observable<any> {
   
    const results = [];

    for (const file of files) {
      const obs = new Observable((observer: Subscriber<any>): void => {
        const reader = new FileReader();

        const id = ++this.id;

        reader.onload = () => {
          const nodePath = node ? (MOCK_FOLDERS.find(f => f.id === node.id)?.path || '') : '';
          const newFile = { id, name: file.name, path: nodePath + '/' + file.name, content: reader.result as string };
          MOCK_FILES.push(newFile);
          observer.next(reader.result);
          observer.complete();
        };
        reader.readAsText(file);
      });
      results.push(obs);
    }

    return forkJoin(results);
  }

  open(node: ExampleNode): Observable<any> {
    // console.log("concreate service",node.name);
    return new Observable<any>();
  }

  share(node: ExampleNode): Observable<any> {
    // console.log(node.name);
    return new Observable<any>();
  }

  refresh() {
    // console.log('EZ');
  }

  deleteNodes(nodes: ExampleNode[]): Observable<any> {
    const results = nodes.map(node => {
      const path = node.path + '/';
      MOCK_FILES = MOCK_FILES.filter(f => !f.path.startsWith(path));
      MOCK_FOLDERS = MOCK_FOLDERS.filter(f => !f.path.startsWith(path));
      MOCK_FOLDERS = MOCK_FOLDERS.filter(f => f.id !== node.id);
      return of({});
    });
    return forkJoin(results);
  }

  deleteLeafs(nodes: ExampleNode[]): Observable<any> {
    const results = nodes.map(node => {
      const leaf = MOCK_FILES.find(f => f.id === node.id);
      if (leaf) {
        const index = MOCK_FILES.indexOf(leaf);
        MOCK_FILES.splice(index, 1);
      }
      return of({});
    });
    return forkJoin(results);
  }

  createNode(node: ExampleNode, name: string): Observable<any> {
    const path = (node?.path ? node.path + '/' : '') + name.replace(/[\W_]+/g, ' ');
    const id = ++this.folderId;
    const newFolder = { path, id, name };
    MOCK_FOLDERS.push(newFolder);
    return of(newFolder);
  }

  getNodeChildren(node: any): Observable<NodeContent<any>> {
    let params = new HttpParams();

    if (node && node.path) {
      // Append the foldername query parameter if a folder is selected
      // console.log(node);
      params = params.set('foldername', node.filename);
    }
    this.spinner.show();
    // Making a GET request to fetch data from the API
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.Getresources;
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => {
        this.spinner.hide();
        if (response.success) {
          // Divide resources into folders (nodes) and files (leafs) based on fileType
          const nodes = response.data.filter((item: any) => item.fileType === 'folder');
          const leafs = response.data.filter((item: any) => item.fileType !== 'folder');
          return { nodes, leafs };
        } else {
          this.spinner.hide();
          throw new Error(response.message || 'Failed to load resources');
        }
      }),
      catchError((error) => {
        this.spinner.hide();
        throw error;
      })
    );
  }

  renameNode(nodeInfo: ExampleNode, newName: string): Observable<ExampleNode> {
    return of({ ...nodeInfo, name: 'Renamed Folder' });
  }

  renameLeaf(leafInfo: ExampleNode, newName: string): Observable<ExampleNode> {
    return of({ ...leafInfo, name: 'renamed.txt' });
  }

  streamVideo(filename: string): string {
    // Return the URL for streaming video
    this.videoApiUrl = AppSettings.API_ENDPOINT + AppSettings.Streamvideo;
    return `${this.videoApiUrl}?fileName=${filename}`;
  }

  downloadVideoFile(filePath: string): Observable<Blob> {
    const url = `${AppSettings.API_ENDPOINT + AppSettings.Downloadfile}?filename=${filePath}`;
    return this.http.get(url, { responseType: 'blob' }); // Set responseType to 'blob' to get binary data
  }

  getFile(filename: string): Observable<any> {
    this.fileApiUrl = AppSettings.API_ENDPOINT + AppSettings.Getfile;
  
    // Show the spinner
    this.spinner.show();
  
    return this.http.get(`${this.fileApiUrl}`, {
      params: { filename },
      responseType: 'text' // Set response type as text to handle base64 response properly
    }).pipe(
      map(response => {
        this.spinner.hide(); // Hide the spinner on success
        return response;
      }),
      catchError((error) => {
        this.spinner.hide(); // Hide the spinner in case of error
        throw error;
      })
    );
  }
  updateResources(data: any): Observable<any> {
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.Updateresources;
    return this.http.post<any>(this.apiUrl, data).pipe(
      map(response => {
        if (response.success) {
          return response;
        } else {
          throw new Error(response.message || 'Failed to update resources');
        }
      }),
      catchError((error) => {
        throw error;
      })
    );
  }
}
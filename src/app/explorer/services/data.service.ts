import { Injectable } from '@angular/core';
import { IDataService } from '../shared/types';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export abstract class DataService implements IDataService<any> {
    abstract getNodeChildren(node: any): any;
    abstract createNode(parentNode: any, name: any): any;
    abstract renameNode(node: any, newName: string): any;
    abstract renameLeaf(node: any, newName: string): any;
    abstract deleteNodes(nodes: any[]): any;
    abstract deleteLeafs(nodes: any[]): any;
    abstract uploadFiles(node: any, files: File[]): any;
    abstract download(node: any): any; // TODO multple download. should be configurable in settings
    abstract openLeaf(node:any): any;
    abstract open(node:any): any;
    abstract share(node:any): any;
    abstract rightClick(node:any): any;
    abstract leftClick(node:any): any;
    abstract emptyClick(): any;
    abstract getCurrentPath(path:string): any;
    // move(from to) // TODO: on/off in settings
    // copyPaste(from to) // TODO: on/off in settings
    // cutPaste(from to) // TODO: on/off in settings
}

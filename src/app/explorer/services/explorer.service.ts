import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { INode, Dictionary, NodeContent } from '../shared/types';
import { Utils } from '../shared/utils';
import { ConcreteDataService } from './concrete-data.service';
import { SecureViewerComponent } from '../components/secure-viewer/secure-viewer.component';
import * as CryptoJS from 'crypto-js';
import {MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class ExplorerService {
    private internalTree = Utils.createNode();
    private flatPointers: Dictionary<INode> = { [this.internalTree.id]: this.internalTree };

    private readonly selectedNodes$ = new BehaviorSubject<INode[]>([]);
    private readonly openedNode$ = new BehaviorSubject<INode>(this.internalTree);
    private readonly breadcrumbs$ = new BehaviorSubject<INode[]>([]);
    private readonly tree$ = new BehaviorSubject<INode>(this.internalTree);

    public readonly selectedNodes = this.selectedNodes$.asObservable();
    public readonly openedNode = this.openedNode$.asObservable();
    public readonly breadcrumbs = this.breadcrumbs$.asObservable();
    public readonly tree = this.tree$.asObservable();
    public readonly secureView$ = new BehaviorSubject<{ type: 'video' | 'pdf' | 'image', url: string } | null>(null);
    encryptionKey = '3da195a3267845968f16cb95f26f6f46';
    private selectedItems: INode[] = [];
    public selectableItems$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public selectableItems = this.selectableItems$.asObservable();
    private changedItems: INode[] = [];

    constructor(private dataService: ConcreteDataService, private dialog: MatDialog) {
        this.internalTree = Utils.createNode();
        this.flatPointers = { [this.internalTree.id]: this.internalTree };
        this.openNode(this.internalTree.id);
    }

    public selectNodes(nodes: INode[]) {
        this.selectedNodes$.next(nodes);
    }

    public openNode(id: number) {
        this.getNodeChildren(id).subscribe(() => {
            const parent = this.flatPointers[id];
          this.openedNode$.next(parent);
          const breadcrumbs = Utils.buildBreadcrumbs(this.flatPointers, parent);
          this.breadcrumbs$.next(breadcrumbs);
          this.selectedNodes$.next([]);
        });
      }

    public dbClick(target: INode) {
        this.dataService.rightClick(target);
    }

    public dbSelect(target: INode) {
        this.dataService.leftClick(target);
    }

    public emptyClick() {
        this.dataService.emptyClick();
    }

    public openLeaf(target: INode) {
        this.dataService.open(target.data).subscribe(() => {
            this.refresh();
        })
    }

    public expandNode(id: number) {
        const parent = this.flatPointers[id];
        if (!parent) {
            console.error('Node not found:', id);
            return;
        }
        this.getNodeChildren(id).subscribe();
    }

    public createNode(name: string) {
        const parent = this.openedNode$.value;
        this.dataService.createNode(parent.data, name).subscribe(() => {
            this.refresh();
        });
    }

    public refresh() {
        this.openNode(this.openedNode$.value.id);
    }

    public rename(name: string) {
        const nodes = this.selectedNodes$.value;
        if (nodes.length > 1) {
            throw new Error('Multiple selection rename not supported');
        }
        if (nodes.length === 0) {
            throw new Error('Nothing selected to rename');
        }

        const node = nodes[0];
        if (node.isLeaf) {
            this.dataService.renameLeaf(node.data, name).subscribe(() => {
                this.refresh();
            });
        } else {
            this.dataService.renameNode(node.data, name).subscribe(() => {
                this.refresh();
            });
        }
    }

    public remove() {
        const selection = this.selectedNodes$.value;
        if (selection.length === 0) {
            throw new Error('Nothing selected to remove');
        }

        const targets = selection.filter(node => node && this.flatPointers[node.id]);
        const nodes = targets.filter(t => !t.isLeaf).map(t => t.data);
        const leafs = targets.filter(t => t.isLeaf).map(t => t.data);

        const sub1 = nodes.length ? this.dataService.deleteNodes(nodes) : of([]);
        const sub2 = leafs.length ? this.dataService.deleteLeafs(leafs) : of([]);

        forkJoin([sub1, sub2]).subscribe(() => {
            this.refresh();
        });
    }

    public upload(files: File[]) {
        const node = this.openedNode$.value;
        this.dataService.uploadFiles(node.data, files).subscribe(() => {
            this.refresh();
        });
    }

    public download() {
        const target = this.selectedNodes$.value[0];
        this.dataService.download(target.data).subscribe(() => {
            this.refresh();
        });
    }

    public open() {
        const target = this.selectedNodes$.value[0];
        // debugger
        this.dataService.open(target.data).subscribe(() => {
            this.refresh();
        })
    }

    public share() {
        const target = this.selectedNodes$.value[0];
        this.dataService.share(target.data).subscribe(() => {
            this.refresh();
        })
    }

    private getNodeChildren(id: number) {
        const parent = this.flatPointers[id];
        if (parent.isLeaf) {
            throw new Error('Cannot open leaf node');
        }

        return this.dataService
            .getNodeChildren(parent.data)
            .pipe(tap(({ leafs, nodes }: NodeContent<any>) => {
                const newNodes = nodes.map(data => Utils.createNode(id, false, data));
                const newLeafs = leafs.map(data => Utils.createNode(id, true, data));
                const newChildren = newNodes.concat(newLeafs);
                const added = newChildren.filter(c => !parent.children.find(o => Utils.compareObjects(o.data, c.data)));
                const removed = parent.children.filter(o => !newChildren.find(c => Utils.compareObjects(o.data, c.data)));

                removed.forEach(c => {
                    const index = parent.children.findIndex(o => o.id === c.id);
                    parent.children.splice(index, 1);
                    delete this.flatPointers[c.id];
                });

                added.forEach(c => {
                    parent.children.push(c);
                    this.flatPointers[c.id] = c;
                });

                parent.children.sort((a, b) => a.data.name.localeCompare(b.data.name));
                const nodeChildren = parent.children.filter(c => !c.isLeaf);
                const leafChildren = parent.children.filter(c => c.isLeaf);
                parent.children = nodeChildren.concat(leafChildren);

                this.tree$.next(this.internalTree);
            }));
    }

    public getCurrentPath() {
        let res = 'Home';
        const path: any = this.openedNode;
        if (path.source?._value?.data?.path != undefined) {
            res = path.source._value.data.path;
            this.dataService.getCurrentPath(res);
            return;
        } else {
            res = 'Home';
            this.dataService.getCurrentPath(res);
            return;
        }
    }
    public openFile(node: any) {
    //   console.log('ExplorerService openFile:', node);
  
      if (!node || !node.data) {
          console.error('Invalid node or missing data in node:', node);
          return;
      }
  
      if (node.data.externalURL && node.data.externalURL.length > 0) {
          window.open(node.data.externalURL, '_blank');
          return;
      }
  
      // Define a type-to-viewer map for documents and images
      const viewerConfig = {
          'pdf': { type: 'pdf', method: 'getFile', mimeType: 'application/pdf' },
          'image': { type: 'image', method: 'getFile', mimeType: 'image/jpeg' },
          'image/png': { type: 'image', method: 'getFile', mimeType: 'image/png' },
          'doc': { type: 'doc', method: 'getFile', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { type: 'docx', method: 'getFile', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
          'xlsx': { type: 'xlsx', method: 'getFile', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
          'xls': { type: 'xls', method: 'getFile', mimeType: 'application/vnd.ms-excel' },
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { type: 'xlsx', method: 'getFile', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
          'pptx': { type: 'pptx', method: 'getFile', mimeType: 'application/vnd.ms-powerpoint' },
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': { type: 'pptx', method: 'getFile', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
          'txt': { type: 'txt', method: 'getFile', mimeType: 'text/plain' },
      };
  
      // Handle video files separately since they do not use subscribe
      if (node.data.fileType === 'video') {
          const url = this.dataService.streamVideo(node.data.path);
          if (url) {
            // console.log("open video url ",node.data)
              this.openSecureViewer({ type: 'video', url, name: node.data.name, isDownloadable: node.data.isDownloadable ,path:node.data.path});
          } else {
              console.error('Failed to get stream URL for video:', node.data.name);
          }
          return;
      }
  
      // Get the configuration for other file types
      const config = viewerConfig[node.data.fileType as keyof typeof viewerConfig] || viewerConfig[node.data.mimeType as keyof typeof viewerConfig];
      
      if (config) {
          // Handle other file types with async subscribe
          (this.dataService[config.method as keyof ConcreteDataService] as (path: string) => Observable<any>)(node.data.path).subscribe((response: any) => {
              if (response) {
                // console.log("open response ",response)
                // console.log("open node.data.fileType ",node.data.fileType)
                // console.log("open config type ",config.type)
                if (node.data.fileType === 'xlsx' || node.data.fileType==='xls' || node.data.fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                  const decryptedData = this.decryptFile(response, this.encryptionKey);
                  this.openSecureViewer({ type: config.type, url: decryptedData, name: node.data.name, isDownloadable: node.data.isDownloadable });
                } else {
                    const decryptedData = this.decryptFile(response, this.encryptionKey);
                  const base64Data = `data:${config.mimeType};base64,${decryptedData}`;
                  this.openSecureViewer({ type: config.type, url: base64Data, name: node.data.name, isDownloadable: node.data.isDownloadable });
                }
              } else {
                  console.error('Failed to get file data for:', node.data.path);
              }
          }, (error: any) => {
              console.error('Error occurred while fetching file:', error);
          });
      } else {
          console.error('Unsupported file type:', node.data.fileType);
      }
  }
  
  
    
      private openSecureViewer(data: { type: string, url: string ,name:string ,isDownloadable?:boolean ,path?:string}) {
        this.dialog.open(SecureViewerComponent, {
          panelClass: 'folder-dialog-class',
          width: '80%',
          height: '90%',
          data
        });
      }

      clearView() {
        this.secureView$.next(null);
      }

      decryptFile(ciphertextB64:string ,keyValue:string) {                              // Base64 encoded ciphertext, 32 bytes string as key
        var key = CryptoJS.enc.Utf8.parse(keyValue);                             // Convert into WordArray (using Utf8)
        var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);   // Use zero vector as IV
        var decrypted = CryptoJS.AES.decrypt(ciphertextB64, key, {iv: iv}); // By default: CBC, PKCS7 
        return decrypted.toString(CryptoJS.enc.Utf8);                       // Convert into string (using Utf8)
      }

      public addItemToSelection(item: INode) {
        if (!this.selectedItems.includes(item)) {
            this.selectedItems.push(item);
            this.selectedNodes$.next([...this.selectedItems]);
        }
    }

    // Remove item from selection
    public removeItemFromSelection(item: INode) {
        this.selectedItems = this.selectedItems.filter(selected => selected.id !== item.id);
        this.selectedNodes$.next([...this.selectedItems]);
    }

    // Select/Deselect all items
    public selectAllItems(items: INode[], select: boolean) {
        this.selectedItems = select ? items : [];
        this.selectedNodes$.next([...this.selectedItems]);
    }

    // Check if item is selected
    public isSelected(item: INode): boolean {
        return this.selectedItems.some(selected => selected.id === item.id);
    }

    public manageDownloadAble() {
        this.selectableItems$.next(!this.selectableItems$.value);
        if (!this.selectableItems$.value) {
            this.selectedItems = [];
            this.changedItems = [];
        }
    }

    public onCheckboxChange(item: INode) {
        if (!item.data) {
            return;
        }

        // Toggle downloadable status
        item.data.isDownloadable = !item.data.isDownloadable;

        // Add to changedItems if not already present
        if (!this.changedItems.includes(item)) {
            this.changedItems.push(item);
        }

        // Update selection
        if (item.data.isDownloadable) {
            this.addItemToSelection(item);
        } else {
            this.removeItemFromSelection(item);
        }
        // console.log('Changed Items:', this.changedItems);
    }

    saveSelected() {
        const userID = localStorage.getItem('LoggeduserId');
        // before updating resources, check if any item is selected
        if (!this.changedItems.length) {
            this.messageHandler({ success: false, message: 'No Changes Made.' });
            return 
        }
    
        const data = this.changedItems.map(item => ({
            id: item.data.id,
            isDownloadable: item.data.isDownloadable,
        }));
        // console.log('Selected Items:', data);
    
        this.dataService.updateResources(data).subscribe({
            next: (response: any) => {
                // console.log('Updated Resources:', response);
                this.messageHandler(response).then(() => {
                    // Reset selected items and refresh data
                    this.selectedNodes$.next([]);
                    this.changedItems = [];
                    this.refresh();
                });
            },
            error: (error) => {
                console.error('Error updating resources:', error);
                this.messageHandler({ success: false, message: 'Failed to update resources.' });
            }
        });
    
        
    }


    messageHandler(response: any) {
        const alertType = response.success ? 'success' : 'error';
        return Swal.fire({
            icon: alertType as SweetAlertIcon,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
            title: response.success ? 'Success' : 'Error',
            text: response.message || 'No additional details provided.'
        });
    }
    
    public clear() {
        this.selectedItems = [];
        this.selectedNodes$.next([]);
        this.selectableItems$.next(false);
    }

}

import { Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { INode } from '../../shared/types';
import { ExplorerService } from '../../services/explorer.service';
import { HelperService } from '../../services/helper.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MenuBarComponent implements OnDestroy {
    @ViewChild('uploader', { static: true }) uploader!: ElementRef;

    canDownload = false;
    manageDownloads = false;
    buttonLable = 'Manage Downloads';
    canDelete = false;
    canRename = false;
    canOpen = false;
    canShare = false;
    title = 'Resources';

    private sub = new Subscription();
    private selection: INode[] = [];

    constructor(private explorerService: ExplorerService, private helperService: HelperService ,private authService: AuthService) {
        this.sub.add(this.explorerService.selectedNodes.subscribe(n => {
            this.selection = n;
            // console.log("selection",this.selection)
            this.canDownload = n.filter(x => x.isLeaf).length === 1 && n[0].data.isDownloadable;
            this.canDelete = n.length > 0;
            this.canOpen = n.filter(x => x.isLeaf).length === 1;
            this.canShare = n.filter(x => x.isLeaf).length === 1;
            this.canRename = n.length === 1;
        }));
        this.checkUserAllowed()
    }

    open(){
        this.explorerService.open();
    }

    share(){
        this.explorerService.share();
    }

    createFolder() {
        const name = prompt('Enter new folder name');
        if (name) {
            this.explorerService.createNode(name);
        }
    }

    refresh() {
        this.explorerService.refresh();
        this.explorerService.getCurrentPath();
    }

    rename() {
        if (this.selection.length === 1) {
            const oldName = this.helperService.getName(this.selection[0].data);
            const newName = prompt('Enter new name', oldName);
            if (newName) {
                this.explorerService.rename(newName);
            }
        }
    }

    remove() {
        if (confirm('Are you sure you want to delete the selected files?')) {
            this.explorerService.remove();
        }
    }

    openUploader() {
        this.uploader.nativeElement.click();
    }


    handleFiles(event: Event) {

      const input = event.target as HTMLInputElement;
  
      if (input && input.files) {
  
          const files = input.files;
  
          // handle files
          this.explorerService.upload(Array.from(files));
          this.uploader.nativeElement.value = '';
  
      }
  
  }

    download() {
        this.explorerService.download();
    }

    manageDownloadAble(){
        this.explorerService.manageDownloadAble();
        this.explorerService.selectableItems.subscribe((items) => {
            // console.log('selectableItems managae', items)
            if (items){
                this.title = 'Manage Downloads';
                this.buttonLable = 'Back to Resources';

            }else{
                this.title = 'Resources';
                this.buttonLable = 'Manage Downloads';
            }

            
        }
        );
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    backBtn(){
        window.history.back();
    }


    checkUserAllowed(){
        // check if user is allowed to manage downloads
        // i have to allow only super admin and admin to manage downloads
        // if user is super admin or admin then manageDownloads will be true
        
        const currentUserData = localStorage.getItem('currentUser');
        if (currentUserData) {
            const roles = JSON.parse(currentUserData).data.role;
            let data= roles.some((role: any) => role.roleName === 'Super Admin' || role.roleName === 'Admin');
            if(data){
              this.manageDownloads = true;
            }
        }
     
    }

        

}

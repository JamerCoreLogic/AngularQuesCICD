import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { INode } from '../../shared/types';
import { ExplorerService } from '../../services/explorer.service';
import { HelperService } from '../../services/helper.service';
import { ConfigProvider } from '../../services/config.provider';
import { AuthService } from 'src/app/services/auth.service';

interface Breadcrumb {
    node: INode;
    name: string;
}

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbsComponent implements OnDestroy {
    public breadcrumbs: Breadcrumb[] = [];
    private sub = new Subscription();
    manageSave = false;

    constructor(private explorerService: ExplorerService, private helperService: HelperService, private config: ConfigProvider,
        private authService: AuthService
    ) {
        this.sub.add(this.explorerService.breadcrumbs.subscribe(n => this.buildBreadcrumbs(n)));
        this.checkUserAllowed()
    }

    private buildBreadcrumbs(nodes: INode[]) {
      // Add a "Home" breadcrumb if we are at the root level
      this.breadcrumbs = [{ name: 'Home', node: nodes[0] }];

      // Add the rest of the breadcrumbs from the node list
      this.breadcrumbs.push(...nodes.map(n => ({ name: this.helperService.getName(n.data) || this.config.config.homeNodeName, node: n })));   
    }

    public click(crumb: Breadcrumb) {
        this.explorerService.openNode(crumb.node.id);
        this.explorerService.getCurrentPath();
    }

    public ngOnDestroy() {
        this.sub.unsubscribe();
    }

    saveSelected() {
        this.explorerService.saveSelected();
    }

    checkUserAllowed(){
        // check if user is allowed to manage downloads
        // i have to allow only super admin and admin to manage downloads
        // if user is super admin or admin then manageDownloads will be true
    const currentUserData = localStorage.getItem('currentUser');
    if (currentUserData) {
        const roles = JSON.parse(currentUserData).data.role;
        let data= roles.some((role: any) => role.roleName === 'Super Admin' || role.roleName === 'Admin');
        this.explorerService.selectableItems.subscribe((items) => {
        if(data && items){
          this.manageSave = true;
        }else{
            this.manageSave = false;
            }
        });
    }
     
    }

}

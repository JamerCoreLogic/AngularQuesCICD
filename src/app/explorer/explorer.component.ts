import { Component, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AvialableView } from './shared/types';
import { CURRENT_VIEW } from './injection-tokens/tokens';
import { ExplorerService } from './services/explorer.service';


@Component({
    selector: 'app-explorer',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ExplorerComponent implements OnDestroy {

    public avialableView = AvialableView;
    public view!: string;
    private sub = new Subscription();
    public secureView: { type: 'video' | 'pdf' | 'image', url: string } | null = null;

    constructor(@Inject(CURRENT_VIEW) private currentView: BehaviorSubject<AvialableView>,
                private explorerService: ExplorerService) {
        this.sub.add(this.currentView.subscribe(view => {
            this.view = view;
        }));
        this.sub.add(this.explorerService.secureView$.subscribe(view => {
          this.secureView = view;
      }));
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.explorerService.clear();
    }

}

import { Component, Inject, ViewEncapsulation , OnDestroy} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FILTER_STRING } from '../../injection-tokens/tokens';
import { ExplorerService } from '../../services/explorer.service';
import { HelperService } from '../../services/helper.service';
import { BaseView } from '../base-view/base-view.directive';
import { INode } from '../../shared/types';

@Component({
    selector: 'app-icons',
    templateUrl: './icons.component.html',
    styleUrls: ['./icons.component.scss'],
    
})
export class IconsComponent extends BaseView  { 

    public readonly icons = {
        node: 'nxe-folder',
        leaf: 'txt',
        pdf: 'pdf',
        audio: 'audio',
        code: 'code',
        doc: 'doc',
        exe: 'exe',
        odp: 'odp',
        img: 'photo',
        pptx: 'pptx',
        vector: 'vector',
        video: 'video',
        xlsx: 'xlsx',
        zip: 'zip',
        link: 'link',
    };

    constructor(explorerService: ExplorerService, helperService: HelperService, @Inject(FILTER_STRING) filter: BehaviorSubject<string>) {
        super(explorerService, helperService, filter);
    }

    openner(event: MouseEvent, item: any) {
      // console.log('openner', item)
        if (item.isLeaf) {
            this.openLeaf(event, item);
            this.explorerService.openFile(item);
        } else {
            this.open(event, item);
            
        }
    }

    rightClick(event: MouseEvent, item: INode) {
        super.select(event, item)
        this.dbClick(item);
    }

    override select(event: MouseEvent, item: INode) {
        super.select(event, item)
        this.dbSelect(item)
    }

    override emptySpaceClick() {
        // console.log('emptySpaceClick')
        super.emptySpaceClick()
        this.emptyClick()
    }

    getIcons(item: any): string {
        return item.isLeaf ? this.getIconByFileType(item.data) : this.icons.node;
    }

    getIconByFileType(data: any): string {
        let fileType = this.getFileType(data)
        const photoName = this.photoMap[fileType as keyof typeof this.photoMap] || 'txt';
        return photoName;
    }

    onCheckboxChange(item: INode) {
       this.explorerService.onCheckboxChange(item);
    }

    isSelectedItem(item: INode): boolean {
        return this.explorerService.isSelected(item);
    }

    isFolder(item: INode): boolean {
        return !item.isLeaf || !!item.data.externalURL;
    }

    isDownloadable(item: INode): boolean {
        return item.isLeaf && item.data.isDownloadable;
    }

    photoMap = {
        'application/pdf': 'pdf',
        'pdf': 'pdf',
        'doc': 'doc',
        'docx': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'doc',
        'application/vnd.oasis.opendocument.presentation': 'odp',
        'application/vnd.oasis.opendocument.spreadsheet': 'ods',
        'pptx': 'pptx',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
        'txt': 'txt',
        'video/mp4': 'video',
        'video': 'video',
        'xlsx': 'xlsx',
        'xls': 'xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'image/jpeg': 'photo',
        'image/png': 'photo',
        'image': 'photo',
        'audio/x-ms-wma': 'audio',
        'audio/mpeg': 'audio',
        'audio/webm': 'audio.',
        'audio/ogg': 'audio',
        'audio/wav': 'audio',
        'application/x-msdownload': 'exe',
        'application/zip': 'zip',
        'image/svg+xml': 'vector',
        'link': 'link',
    };
}


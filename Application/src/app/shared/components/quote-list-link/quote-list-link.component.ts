import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AQUserInfo, AQRoleInfo } from '@agenciiq/login';
import { CheckRoleService } from '../../services/check-role/check-role.service';
import { Roles } from 'src/app/global-settings/roles';
import { AQSession } from 'src/app/global-settings/session-storage';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quote-list-link',
  templateUrl: './quote-list-link.component.html',
  styleUrls: ['./quote-list-link.component.sass'],
  standalone: false
})
export class QuoteListLinkComponent implements OnInit {

  inneritem: any;
  item: any;
  IsUnderWriterGroupUser: boolean = false;
  environment = environment;

  @Output() TransferViewPolicyParam = new EventEmitter<any>();
  identifier: string = "";



  @Input('inneritem') set innerItem(inneritem: any) {
    if (inneritem !== undefined) {
      this.inneritem = inneritem;
    }
  }

  @Input('item') set Item(item: any) {
    if (item !== undefined) {
      this.item = item;


    }
  }

  setViewPolicyData(quoteId: number, formId: number, item, actionName: string) {
    this._session.removeSession('IsNavigationFromFQ');
    this._session.removeSession('IsNavigationFrom');
    this.TransferViewPolicyParam.emit({ 'quoteId': quoteId, 'formId': formId, 'actionName': actionName, quoteDetails: item })
  }


  constructor(
    private _roleInfo: AQRoleInfo,
    private _checkRoleService: CheckRoleService,
    private _session: AQSession
  ) {
    if (this._checkRoleService.isRoleCodeAvailable(Roles.Underwriter.roleCode, this._roleInfo.Roles())) {
      this.IsUnderWriterGroupUser = true;
    } else if (this._checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, this._roleInfo.Roles())) {
      this.IsUnderWriterGroupUser = true;
    } else if (this._checkRoleService.isRoleCodeAvailable(Roles.UWManager.roleCode, this._roleInfo.Roles())) {
      this.IsUnderWriterGroupUser = true;
    } else if (this._checkRoleService.isRoleCodeAvailable(Roles.UWSupervisior.roleCode, this._roleInfo.Roles())) {
      this.IsUnderWriterGroupUser = true;
    }
  }

  ngOnInit() {
    let host = window.location.host;
    if (host.includes('localhost')) {
      host = 'convelo.agenciiq.net';
    }
    this.identifier = host;
  }


  IsStageAvailable(status: string) {

    return this.item.data.filter(stage => stage.status.toLowerCase() == status.toLowerCase()).length > 0;
  }

  StageCount(status: string): number {
    return this.item.data.filter(stage => stage.status.toLowerCase() == status.toLowerCase()).length;
  }


}

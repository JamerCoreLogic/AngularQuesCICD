import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { LoginInfoComponent } from 'src/app/auth/login/login-info/login-info.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName: any
  userEmail: any
  userType: any
  userProfilePic: any
  loggedUserRes: any
  loggedUserType: any
  loggedUserTypeCheck = Number((localStorage.getItem('LoggedUserType')));
  
  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loggedUserRes = localStorage.getItem('currentUser');
    this.loggedUserType = localStorage.getItem('LoggedUserType');
   // console.log("loggedusertype",this.loggedUserType)
    if (this.loggedUserRes) {
      this.loggedUserRes = JSON.parse(this.loggedUserRes);
      this.userProfilePic=this.loggedUserRes.data.profilePic
      // //console.log("USER RESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS", this.loggedUserRes);
    }

    this.userName = localStorage.getItem('LoggedUserName');
    this.userType = localStorage.getItem('LoggedUserRole');
    this.userEmail = localStorage.getItem('LoggeduserEmail');
    // this.userProfilePic = localStorage.getItem('LoggeduserPic');
  }
  hasUserRole(moduleName: string): boolean {
    return this.loggedUserRes?.data?.role && this.loggedUserRes.data?.role.some((role: any) => role.userPageList.some((userPage: any) => userPage.moduleName === moduleName));
  }
  shouldShowReports(): boolean {
    const roles = this.loggedUserRes?.data?.role?.map((r:any) => r.roleName) || [];
    const isOnlyAdjuster = roles.length === 1 && roles.includes('Adjuster');
    return (
      (isOnlyAdjuster) // loggedUserTypeCheck must be 1
    );
  }
  shouldShowViewUser(): boolean {
    const roles = this.loggedUserRes?.data?.role?.map((r:any) => r.roleName) || [];
    const isOnlyEmployee = roles.length === 1 && roles.includes('Employee');
  
    return (
      (isOnlyEmployee) // loggedUserTypeCheck must be 1
    );
  }

  hasPage(pageName: string): boolean {
    return this.loggedUserRes?.data?.role && this.loggedUserRes.data?.role.some((role: any) => role.userPageList.some((userPage: any) => userPage.pageDetailsData.some((page: any) => page.pageName === pageName)));
  }

  imageTransform() {
    // //console.log("Prifile pic is", this.userProfilePic)
    const x = "data:image/png;base64,"
    var src
    if (this.userProfilePic && this.userProfilePic.length > 50) {
      src = this.userProfilePic
      ////console.log("If block executed");
    }
    return src
  }
  checkBase64Validity(base64Text: string): boolean {
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
    return base64Regex.test(base64Text);
  }

  logout() {
     
    this.userEmail = null
    localStorage.clear()
    localStorage.clear()
    //console.log(this.userName, " logged out successfully, and routed to login")
    this.router.navigate(['/login'])
  }
  afterlogin(): void {
    const dialogRef = this.dialog.open(LoginInfoComponent, {
      data: { },
      panelClass: 'afterlogin_info',
    });
  
    dialogRef.afterClosed().subscribe((result:any) => {
      //console.log('The dialog was closed');
     
    });
  }
  navigateFAQ(){
    if(this.loggedUserType == '1'){
      window.open('https://fpdirect.sharepoint.com/:f:/s/intranet/ElR7tra71i1GlBnP_wb4x7sBrPixFa6SE0RMyITgYDNYPw', '_blank');

    }
    else{
      window.open('https://www.fieldprosdirect.com/myfpdportal-faqs', '_blank');
    }
  }
  isAdminMenuActive(): boolean {
    const adminRoutes = ['/main/admin', '/main/admin/clients', '/main/admin/assignment', '/main/admin/tasks'];
    return adminRoutes.some((route) => this.router.url.startsWith(route));
  }
  
}


import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2'
import { NgxSpinnerService } from 'ngx-spinner';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ChangePassAtFirstloginComponent } from './change-pass-at-firstlogin/change-pass-at-firstlogin.component';
import { LoginInfoComponent } from './login-info/login-info.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // public showPassword: boolean | undefined;
  // public showPasswordOnPress: boolean | undefined;
  hide = true;
  LoginForm!: FormGroup
  submit: boolean = false
  versionData: any
  currentYear: any;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService,
    public dialog: MatDialog, private SpinnerService: NgxSpinnerService) {
     
    this.authService.logout();
    this.createLoginForm();
  }

  showPassword: boolean = false;
  showHidePassword() {
    this.showPassword = !this.showPassword;
  }


  createLoginForm() {
    this.LoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.versionDetails()
    this.currentYear=(new Date()).getFullYear()
  }

  async login() {

    this.SpinnerService.show();
    this.submit = true
    //console.log("Email:", this.LoginForm.controls['email'].value);
    if (this.LoginForm.invalid) {
      this.SpinnerService.hide();
    }
    else {
      let objData = {
        emailAddress: this.LoginForm.getRawValue().email,
        password: this.LoginForm.getRawValue().password
      }
      let model = JSON.stringify(objData);
      this.authService.login(objData).pipe(
        catchError(error => {
          this.SpinnerService.hide();
          if (error.status == 0) {
            Swal.fire({
              text: 'Please check the connection. Unable to communicate with server via HTTP(s).',
              icon: 'warning',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            })
          }
          else if (error.status) {
            Swal.fire({
              title: 'Status code: ' + error.status,
              text: 'Sorry! Something went wrong. Your request could not be completed, Please try again later.',
              icon: 'warning',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            })
          }
          return throwError(error);
        })
      )
        .subscribe(async (res: any) => {
          this.SpinnerService.hide();
          if (res.success == true) {
             
            if (res.data.isFirstTimeLogin == true) {
              //console.log("this is a new user,", 'LoggeduserId', res["data"].userId);
              localStorage.setItem('LoggeduserId', res["data"].userId)
              localStorage.setItem('token', res["data"].token)

              const dialogRef = this.dialog.open(ChangePassAtFirstloginComponent, {
                data: null,
                panelClass: 'change_pass_Atfirst',
                
              });

              dialogRef.afterClosed().subscribe(result => {
                //console.log('The dialog was closed');
                this.router.navigate(['login'])
              });
            }
            else {
                if (res.data.profilePic) {
                  // Compress the profilePic and update the response
                  try {
                    const compressedPic = await this.authService.compressProfilePic(res.data.profilePic);
                    res.data.profilePic = compressedPic; // Update the response with the compressed image
                  } catch (error) {
                    console.error('Error compressing profile picture:', error);
                    // Handle the error, decide whether to proceed or not
                  }
                }

              //console.log(res.data)
              localStorage.setItem('currentUser', JSON.stringify(res))
              localStorage.setItem('LoggedUserName', res.data.userName)
              localStorage.setItem('LoggedUserRole', res.data.role[0].roleId)
              localStorage.setItem('LoggedUserType', res.data.userTypeId)
              localStorage.setItem('LoggeduserEmail', res.data.emailAddress)
              localStorage.setItem('LoggeduserId', res["data"].userId)
              // localStorage.setItem('LoggeduserPic', res["data"].profilePic)
              localStorage.setItem('token', res["data"].token)
              //based on role id navigate to the respective page
              // if (res.data.role[0].roleId == 1) {
              //   this.router.navigate(['main/admin'])
              // }
              // else if (res.data.role[0].roleId == 2) {
              //   this.router.navigate(['main/admin'])
              // }
              // else if (res.data.role[0].roleId == 3 || res.data.role[0].roleId == 4) {
              //   this.router.navigate(['main/dashboard'])
              // }
              const currentURL = window.location.href;
               
              var urlArray: any[] = []
              const currentUrlObj = new URL(currentURL);
              //console.log("urlobj for Current Url", currentUrlObj)
              var isfirstelement = true;
              for (var element of res.data.role[0].userPageList) {
                if (element.isSingle) {
                  urlArray.push(element.pageURL)
                  if (isfirstelement) {
                     
                    isfirstelement = false;
                    const urlObject = new URL(element.pageURL);
                    currentUrlObj.pathname = urlObject.pathname;
                    //console.log("if bloack executed", currentUrlObj);
                  }
                }
                else {
                  //console.log("Route user in foreach is", element.pageDetailsData)
                  for (var ele of element.pageDetailsData) {
                     
                    urlArray.push(ele.pageURL)
                    if (isfirstelement) {
                       
                      isfirstelement = false;
                      const urlObject = new URL(ele.pageURL);
                      currentUrlObj.pathname = urlObject.pathname;
                    }
                  }
                  //console.log("else bloack executed", currentUrlObj);
                }
              };
              var result = this.authService.postUserAllowedUrls(urlArray);  
              localStorage.setItem('urlArray', JSON.stringify(urlArray));
              this.router.navigate([currentUrlObj.pathname]);
              // //console.log("Route Url:", currentUrlObj.pathname, ",  Allowed Url list:", urlArray, " Is User allowed url saved in service:", result)
            }
          }
          else {
            Swal.fire({
              // title: 'Invalid credentials!',
              html:res.message,
              icon: 'warning',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            })
          }
        })
    }
  }
  // .....after login

   
  
  route() {
    this.router.navigate(['forgot-password'])
  }
  routeToRegister() {
    this.router.navigate(['register'])
  }
  versionDetails() {
    this.authService.getHeartbeat().subscribe((res: any) => {

      // console.log("Version Data", res[11])
      this.versionData =res[11]
    })
  }
 
}

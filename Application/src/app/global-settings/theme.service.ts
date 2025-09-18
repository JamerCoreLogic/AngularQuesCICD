import { Injectable, Inject } from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { stream } from 'xlsx/types';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    static themeColor: IThemeColor;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private http: HttpClient
    ) { }

    loadThemeColor() {
        let styleUrl = "acme.agenciiq.net";
        if (environment.production) {
            let path = window.location.host;

            if (path.includes('acme')) {
                styleUrl = 'acme.agenciiq.net';
            } else if (path.includes('united')) {
                styleUrl = 'united.agenciiq.net';
            } else if (path.includes('insur')) {
                styleUrl = 'insur.agenciiq.net';
            } else if (path.includes('federal')) {
                styleUrl = 'federal.agenciiq.net';
            } else if (path.includes('convelo')) {
                styleUrl = 'convelo.agenciiq.net';
            } else if (path.includes('10.151.0.43')) {
                styleUrl = 'convelo.agenciiq.net';
            } else if (path.includes('agenciiquat.lambis.com')) {
                styleUrl = 'convelo.agenciiq.net';
            }
            else if (path.includes('demo')) {
                styleUrl = 'demo.agenciiq.net';
            }
            /* 
                        if (path == 'acme.agenciiq.net' || path == 'united.agenciiq.net' || path == "insur.agenciiq.net") {
                            styleUrl = window.location.host;                
                        } */
        } else {
            styleUrl = "convelo.agenciiq.net";
        }

        const jsonFile = `assets/master-theme/color/${styleUrl}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: IThemeColor) => {
                ThemeService.themeColor = <IThemeColor>response;
                this.applyThemeColor()
                resolve();
            }).catch((response: any) => {
                reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }


    applyThemeColor() {
        for (let property in ThemeService.themeColor) {
            document.documentElement.style.setProperty('--' + property, ThemeService.themeColor[property]);
        }
    }

    apply() {
        let styleUrl = "acme.agenciiq.net";
        if (environment.production) {
            let path = window.location.host;
            if (path == 'acme.agenciiq.net' || path == 'united.agenciiq.net' || path == "insur.agenciiq.net"
                || path == "federal.agenciiq.net") {
                styleUrl = window.location.host;
                //styleUrl = "acme.agenciiq.net";
            }
        } else {
            styleUrl = "federal.agenciiq.net";
        }
        // return new Promise((resolve, reject) => {
        //    // this.loadStyle('client-theme', 'stylesheet', `assets/${styleUrl}/css/styles.css`);
        //     resolve();
        // })
        return new Promise<void>((resolve, reject) => {
            resolve();
        });

    }

    loadStyle(id: string, rel: string, styleName: string) {

        const head = this.document.getElementsByTagName('head')[0];
        let themeLink = this.document.getElementById(
            id
        ) as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = styleName;
        } else {
            const style = this.document.createElement('link');
            style.id = id;
            style.rel = rel;
            style.href = `${styleName}`;
            head.appendChild(style);
        }
    }
}



export interface IThemeColor {
    "application-bg-color": string;
    "primary-color": string;
    "primary-hover-color": string;
    "primary-text-color": string;
    "section-bg-color": string;
    "section-hover-color": string;
    "footer-bg-color": string;
    "footer-text-color": string;
    "dashboard-header-bg": string;
    "dashboard-header-bg-hover": string;
    "primary-error-color": string;
}

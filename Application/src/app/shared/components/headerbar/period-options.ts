import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PeriodOption {

    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    getMonthName(month: number) {

        // let index = this.months.indexOf("month");
        // alert(index);
        return this.months[month];
    }

    getQuarterName(month: number) {
        if (month == 3 || month == 4 || month == 5) {
            return 1;
        } else if (month == 6 || month == 7 || month == 8) {
            return 2;
        } else if (month == 9 || month == 10 || month == 11) {
            return 3;
        } else if (month == 0 || month == 1 || month == 2) {
            return 4;
        }
    }

    QuarterOptions(quarter: number) {
        let resp: any;
        let quarterStartMonth: any = null;
        let quarterEndMonth: any = null;
        let startDate: any = null;
        let endDate: any = null;
        let year: any = new Date().getFullYear();

        if (quarter == 1) {
            quarterStartMonth = this._monthName(3);
            quarterEndMonth = this._monthName(5);
        } else if (quarter == 2) {
            quarterStartMonth = this._monthName(6);
            quarterEndMonth = this._monthName(8);
        } else if (quarter == 3) {
            quarterStartMonth = this._monthName(9);
            quarterEndMonth = this._monthName(11);
        } else if (quarter == 4) {
            quarterStartMonth = this._monthName(0);
            quarterEndMonth = this._monthName(2);
        }

        resp = {
            "DisplayText": `${quarterStartMonth} ${year} - ${quarterEndMonth} ${year}`,
            "StartDate": new Date(),
            "EndDate": new Date()
        }

        return resp;
    }


    YearOptions(year) {
        return `${this.months[0]} ${year} - ${this.months[11]} ${year}`;
    }




    // private functions

    private _monthName(month: number) {
        if (month >= 0 && month <= 11) {
            return this.months[month];
        } else if (month < 0) {
            return this.months[11 - (month - 1)];
        } else if (month > 11) {
            return this.months[month - (11 + 1)];
        }
    }




}
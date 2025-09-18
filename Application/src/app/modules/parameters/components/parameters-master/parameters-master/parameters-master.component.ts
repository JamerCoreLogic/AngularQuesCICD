import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parameters-master',
  templateUrl: './parameters-master.component.html',
  styleUrls: ['./parameters-master.component.sass'],
  standalone: false
})
export class ParametersMasterComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

}

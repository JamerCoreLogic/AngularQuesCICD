import { Component, Input, OnInit, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-progress-card',
  imports: [],
  templateUrl: './progress-card.component.html',
  styleUrl: './progress-card.component.sass'
})
export class ProgressCardComponent {
  @Input() title: string = '';
  @Input() percentageChange: number = 0;
  @Input() value: number = 0;
  @Input() mainNumber: number = 0;
  @Input() total: number = 1000;
  @Input() progressColor: string = '#16C8C7';


  svgSize = 120;
  strokeWidth = 8;
  radius = 52;
  center = 60;

  circumference: number;
  animatedOffset: number;
  constructor(private elementRef: ElementRef) {
    this.circumference = 2 * Math.PI * this.radius;
    this.animatedOffset = this.circumference;
  }
  ngOnInit(): void {
    this.updateSvgSize();
  }

  ngAfterViewInit() {
    // Start animation after view initializes
    setTimeout(() => {
      this.animateProgress();
    }, 200);

    // Listen for window resize to update SVG size
    window.addEventListener('resize', () => {
      this.updateSvgSize();
    });
  }

  private updateSvgSize() {
    const cardWidth = this.elementRef.nativeElement.querySelector('.progress-card')?.offsetWidth || 300;

    if (cardWidth < 300) {
      this.svgSize = 100;
      this.strokeWidth = 6;
      this.radius = 42;
      this.center = 50;
    } else if (cardWidth < 400) {
      this.svgSize = 110;
      this.strokeWidth = 7;
      this.radius = 47;
      this.center = 55;
    } else {
      this.svgSize = 120;
      this.strokeWidth = 8;
      this.radius = 52;
      this.center = 60;
    }

    this.circumference = 2 * Math.PI * this.radius;
    this.animateProgress();
  }

  private animateProgress() {
    const progress = this.value / 100;
    this.animatedOffset = this.circumference - (progress * this.circumference);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  }
}


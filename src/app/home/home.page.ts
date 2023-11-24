import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { animate as PopmotionAnimate } from 'popmotion';
import styler, { Styler } from 'stylefire';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('50ms', [
            animate(
              '400ms cubic-bezier(0.17, 0.89, 0.24, 1.11)',
              style({ opacity: 1, transform: 'translateY(0)' }),
            )
          ])
        ])
      ])
    ]),

  ]
})
export class HomePage {

  @ViewChild('dynamicIsland') dynamicIsland!: ElementRef;
  dynamicIslandIsOpen = false;

  private styler!: Styler;
  private defaultDimensions:any;

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    this.styler = styler(this.dynamicIsland.nativeElement);
    this.defaultDimensions = {
      borderRadius: this.styler.get('borderRadius'),
      width: this.styler.get('width'),
      height: this.styler.get('height'),
    }
  }

  toggleDynamicIsland(): void {
    if (this.dynamicIslandIsOpen) {
      this.dynamicIslandIsOpen = false
      this.closeDynamicIsland().then(() => {
      })
    } else {
      this.openDynamicIsland().then(() => {
        this.dynamicIslandIsOpen = true
      })
    }
  }

  openDynamicIsland(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.ngZone.runOutsideAngular(() => {
        PopmotionAnimate({
          from: JSON.stringify(this.defaultDimensions),
          to: JSON.stringify({ borderRadius: 25, width: 400, height: 150 }),
          duration: 600,
          type: 'spring',
          onUpdate: (latest) => {
            const latestFormatted = JSON.parse(latest);
            this.styler.set('borderRadius', `${latestFormatted.borderRadius}px`);
            this.styler.set('width', `${latestFormatted.width}px`);
            this.styler.set('height', `${latestFormatted.height}px`);
          },
          onComplete: () => {
            resolve();
          }
        });
      });
    })
  }

  closeDynamicIsland(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.ngZone.runOutsideAngular(() => {
        PopmotionAnimate({
          from: JSON.stringify(
            {
              borderRadius: this.styler.get('borderRadius'),
              width: this.styler.get('width'),
              height: this.styler.get('height'),
            }
          ),
          to: JSON.stringify(this.defaultDimensions),
          duration: 600,
          type: 'spring',
          onUpdate: (latest) => {
            const latestFormatted = JSON.parse(latest);
            this.styler.set('borderRadius', `${latestFormatted.borderRadius}px`);
            this.styler.set('width', `${latestFormatted.width}px`);
            this.styler.set('height', `${latestFormatted.height}px`);
          },
          onComplete: () => {
            resolve();
          }
        });
      });
    })
  }

}

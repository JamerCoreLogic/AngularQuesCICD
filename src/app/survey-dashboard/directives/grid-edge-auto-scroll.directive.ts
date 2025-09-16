import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy } from '@angular/core';

/**
 * GridEdgeAutoScrollDirective
 * Adds horizontal auto-scroll when dragging a Kendo Grid column header near the left/right edges.
 * Implementation relies on presence of Kendo drag clue `.k-drag-clue` and scrolls header/content wraps.
 */
@Directive({
  selector: '[appGridEdgeAutoScroll]'
})
export class GridEdgeAutoScrollDirective implements AfterViewInit, OnDestroy {
  private rootEl: HTMLElement;
  private rafId: number | null = null;
  private isDragging = false;
  private lastPointerX = 0;
  private scrollVelocity = 0; // pixels per frame
  private readonly edgeThreshold = 56; // px from left/right to trigger
  private readonly maxVelocity = 25; // px per frame
  private readonly acceleration = 10; // velocity step per frame while in hotzone
  private pointerDownInHeader = false;

  private mouseMoveHandler = (e: MouseEvent) => this.onPointerMove(e.clientX);
  private touchMoveHandler = (e: TouchEvent) => {
    if (e.touches && e.touches.length > 0) {
      // this.onPointerMove(e.touches[0].clientX);
    }
  };
  private pointerMoveHandler = (e: PointerEvent) => this.onPointerMove(e.clientX);
  private mouseDownListener?: (e: Event) => void;
  private mouseUpListener?: (e: Event) => void;
  private pointerDownListener?: (e: PointerEvent) => void;
  private pointerUpListener?: (e: PointerEvent) => void;
  private dragStartCheckId: number | null = null;

  constructor(private host: ElementRef<HTMLElement>, private ngZone: NgZone) {
    this.rootEl = host.nativeElement;
  }

  ngAfterViewInit(): void {
    // Bind global listeners outside Angular for perf
    this.ngZone.runOutsideAngular(() => {
      // eslint-disable-next-line no-console
      //console.log('[GridEdgeAutoScroll] init');
      document.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
      document.addEventListener('touchmove', this.touchMoveHandler, { passive: true });
      document.addEventListener('pointermove', this.pointerMoveHandler, { passive: true });

      // Track drag lifecycle by polling for presence of Kendo drag clue
      const onMouseDown = (e: Event) => {
        const headerWrap = this.findHeaderWrap();
        const target = e.target as Node | null;
        this.pointerDownInHeader = !!(headerWrap && target && headerWrap.contains(target));
        // seed pointer X for immediate header area checks
        if ((e as MouseEvent).clientX != null) {
          this.lastPointerX = (e as MouseEvent).clientX;
        } else if ((e as TouchEvent).touches && (e as TouchEvent).touches.length > 0) {
          this.lastPointerX = (e as TouchEvent).touches[0].clientX;
        }
        // eslint-disable-next-line no-console
        //console.log('[GridEdgeAutoScroll] pointer down', { pointerDownInHeader: this.pointerDownInHeader });
        // Do not mark dragging on press; wait for Kendo drag clue
        this.scheduleDragStateCheck(true);
      };
      const onMouseUp = (e: Event) => {
        this.pointerDownInHeader = false;
        // eslint-disable-next-line no-console
        //console.log('[GridEdgeAutoScroll] pointer up');
        this.isDragging = false;
        this.scrollVelocity = 0;
      };
      this.mouseDownListener = onMouseDown;
      this.mouseUpListener = onMouseUp;
      document.addEventListener('mousedown', onMouseDown, { passive: true });
      document.addEventListener('touchstart', onMouseDown, { passive: true });
      document.addEventListener('mouseup', onMouseUp, { passive: true });
      document.addEventListener('touchend', onMouseUp, { passive: true });
      // Pointer events for trackpads/pen/touch
      this.pointerDownListener = (pe: PointerEvent) => {
        const headerWrap = this.findHeaderWrap();
        const target = pe.target as Node | null;
        this.pointerDownInHeader = !!(headerWrap && target && headerWrap.contains(target));
        this.lastPointerX = pe.clientX;
        // eslint-disable-next-line no-console
        //console.log('[GridEdgeAutoScroll] pointerdown(pe)', { pointerDownInHeader: this.pointerDownInHeader });
        this.scheduleDragStateCheck(true);
      };
      this.pointerUpListener = (_pe: PointerEvent) => {
        this.pointerDownInHeader = false;
        this.isDragging = false;
        this.scrollVelocity = 0;
        // eslint-disable-next-line no-console
        //console.log('[GridEdgeAutoScroll] pointerup(pe)');
      };
      document.addEventListener('pointerdown', this.pointerDownListener, { passive: true });
      document.addEventListener('pointerup', this.pointerUpListener, { passive: true });
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.mouseMoveHandler as any);
    document.removeEventListener('touchmove', this.touchMoveHandler as any);
    if (this.mouseDownListener) {
      document.removeEventListener('mousedown', this.mouseDownListener as any);
      document.removeEventListener('touchstart', this.mouseDownListener as any);
    }
    if (this.mouseUpListener) {
      document.removeEventListener('mouseup', this.mouseUpListener as any);
      document.removeEventListener('touchend', this.mouseUpListener as any);
    }
    if (this.pointerMoveHandler) {
      document.removeEventListener('pointermove', this.pointerMoveHandler as any);
    }
    if (this.pointerDownListener) {
      document.removeEventListener('pointerdown', this.pointerDownListener as any);
    }
    if (this.pointerUpListener) {
      document.removeEventListener('pointerup', this.pointerUpListener as any);
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.dragStartCheckId !== null) {
      cancelAnimationFrame(this.dragStartCheckId);
      this.dragStartCheckId = null;
    }
  }

  private scheduleDragStateCheck(expectDrag: boolean): void {
    if (this.dragStartCheckId !== null) {
      cancelAnimationFrame(this.dragStartCheckId);
      this.dragStartCheckId = null;
    }
    const check = () => {
      const hasClue = !!document.querySelector('.k-drag-clue, .k-reorder-clue');
      // Only treat as dragging if Kendo drag clue is present AND we initiated from header
      this.isDragging = hasClue && this.pointerDownInHeader;
      // eslint-disable-next-line no-console
      // console.log('[GridEdgeAutoScroll] check', { hasClue, pointerDownInHeader: this.pointerDownInHeader, isDragging: this.isDragging, lastPointerX: this.lastPointerX });
      if (!this.isDragging) {
        this.scrollVelocity = 0;
      }
      // If expectation mismatches current detection, re-check shortly
      if (expectDrag !== this.isDragging) {
        this.dragStartCheckId = requestAnimationFrame(check);
      } else {
        this.dragStartCheckId = null;
      }
    };
    this.dragStartCheckId = requestAnimationFrame(check);
  }

  private onPointerMove(clientX: number): void {
    this.lastPointerX = clientX;
    if (!this.isDragging) {
      // Late detection: if Kendo drag clue appears while moving, start dragging
      const hasClue = !!document.querySelector('.k-drag-clue, .k-reorder-clue');
      if (hasClue) {
        this.isDragging = true;
        // eslint-disable-next-line no-console
        //console.log('[GridEdgeAutoScroll] late-detect drag', { clientX });
      } else {
        // eslint-disable-next-line no-console
        // console.log('[GridEdgeAutoScroll] move (ignored)', { x: clientX });
        return;
      }
    }
    const headerWrap = this.findHeaderWrap();
    if (!headerWrap) { return; }

    const rect = headerWrap.getBoundingClientRect();
    const withinLeft = clientX - rect.left;
    const withinRight = rect.right - clientX;

    if (withinLeft <= this.edgeThreshold) {
      // accelerate left
      this.scrollVelocity = Math.max(-this.maxVelocity, this.scrollVelocity - this.acceleration);
      // eslint-disable-next-line no-console
      //console.log('[GridEdgeAutoScroll] hotzone LEFT', { withinLeft, velocity: this.scrollVelocity });
      this.ensureTicking();
    } else if (withinRight <= this.edgeThreshold) {
      // accelerate right
      this.scrollVelocity = Math.min(this.maxVelocity, this.scrollVelocity + this.acceleration);
      // eslint-disable-next-line no-console
      //console.log('[GridEdgeAutoScroll] hotzone RIGHT', { withinRight, velocity: this.scrollVelocity });
      this.ensureTicking();
    } else {
      // decelerate to stop when outside hotzone
      if (this.scrollVelocity !== 0) {
        this.scrollVelocity = this.scrollVelocity > 0 ? Math.max(0, this.scrollVelocity - this.acceleration)
                                                      : Math.min(0, this.scrollVelocity + this.acceleration);
        // eslint-disable-next-line no-console
        //console.log('[GridEdgeAutoScroll] decel', { velocity: this.scrollVelocity });
        this.ensureTicking();
      }
    }
  }

  private ensureTicking(): void {
    if (this.rafId !== null) { return; }
    const tick = () => {
      this.rafId = null;
      // Stop immediately if Kendo drag clue is no longer present (drop occurred)
      const hasClue = !!document.querySelector('.k-drag-clue, .k-reorder-clue');
      if (!hasClue) {
        this.isDragging = false;
        this.scrollVelocity = 0;
        return;
      }
      if (!this.isDragging || this.scrollVelocity === 0) { return; }
      const headerWrap = this.findHeaderWrap();
      const contentWrap = this.findContentWrap();
      if (headerWrap) {
        headerWrap.scrollLeft += this.scrollVelocity;
      }
      if (contentWrap) {
        contentWrap.scrollLeft += this.scrollVelocity;
      }
      // eslint-disable-next-line no-console
      //console.log('[GridEdgeAutoScroll] tick', { velocity: this.scrollVelocity, headerScroll: headerWrap?.scrollLeft, contentScroll: contentWrap?.scrollLeft });
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private isPointerInHeaderArea(): boolean {
    const headerWrap = this.findHeaderWrap();
    if (!headerWrap) { return true; }
    const rect = headerWrap.getBoundingClientRect();
    return this.lastPointerX >= rect.left && this.lastPointerX <= rect.right;
  }

  private findHeaderWrap(): HTMLElement | null {
    // Try within host grid first
    const fromHost = this.rootEl.querySelector<HTMLElement>('.k-grid-header-wrap, .k-grid-header');
    if (fromHost) { return fromHost; }
    // Fallback: nearest grid container sibling hierarchy
    return document.querySelector<HTMLElement>('.k-grid .k-grid-header-wrap, .k-grid .k-grid-header');
  }

  private findContentWrap(): HTMLElement | null {
    const fromHost = this.rootEl.querySelector<HTMLElement>('.k-grid-content');
    if (fromHost) { return fromHost; }
    return document.querySelector<HTMLElement>('.k-grid .k-grid-content');
  }
}



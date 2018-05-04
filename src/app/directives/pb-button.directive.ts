import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({ selector: '[pb-button]' })
export class PBButtonDirective {
  timeout;

  constructor(private elem: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('click', ['$event']) onClick($event) {
    this.renderer.addClass(this.elem.nativeElement, 'active');
    if (this.timeout) { clearTimeout(this.timeout); }
    this.timeout = setTimeout(() => this.renderer.removeClass(this.elem.nativeElement, 'active'), 200);
  }


}

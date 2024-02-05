import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dynamicComponent]',
  standalone: true
})

export class DynamicHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

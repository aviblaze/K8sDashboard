import { AfterViewInit, Component, Input, ViewChildren, ViewContainerRef,QueryList,Output,EventEmitter,ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { componentdetails, screendetails,componentconfig } from '../../Interfaces/screensplitter';
import { NumericalmetricComponent } from '../numericalmetric/numericalmetric.component';
import { DisplaygraphComponent } from '../displaygraph/displaygraph.component';
import { DisplaytabulardataComponent } from '../displaytabulardata/displaytabulardata.component';

@Component({
  selector: 'app-splitscreen',
  standalone: true,
  imports: [NumericalmetricComponent, DisplaygraphComponent, DisplaytabulardataComponent, CommonModule],
  templateUrl: './splitscreen.component.html',
  styleUrl: './splitscreen.component.scss'
})

export class SplitscreenComponent implements AfterViewInit {

  @Input('splitContent') public splitContent!: screendetails;
  @ViewChildren('dynamicComponentRef', { read: ViewContainerRef }) dynamicComponentRefs!: QueryList<ViewContainerRef>;
  @Output() splitscreenEvent = new EventEmitter<{ title: any, componentName: any }>();

  ngAfterViewInit(): void {
    this.dynamicComponentRefs.changes.subscribe((components: QueryList<ViewContainerRef>) => {
      this.loadDynamicComponents(components);
    });
    this.loadDynamicComponents(this.dynamicComponentRefs);
  }

  isComponentDetails(value: any): value is componentdetails {
    return value && typeof value === 'object' && 'name' in value;
  }

  objectKeys = Object.keys;

  parseIntKey(key: string): number {
    return parseInt(key, 10);
  }

  isScreendetails(value: any): value is screendetails {
    return value && typeof value === 'object' && 'split' in value;
  }

  getContainerClass(overrideflexdirection:boolean,splitType: string): string {

    if(overrideflexdirection){
      return splitType === 'horizontal' ? 'horizontal-container-inverse' : 'vertical-container-inverse';
    }
    return splitType === 'horizontal' ? 'horizontal-container' : 'vertical-container';
  }
  
  getSplitStyle(overrideflexdirection:boolean,splitType: string, ratio: number): any {
    
    if(overrideflexdirection){
      return splitType === 'horizontal'
      ? { 'width': `${ratio}%`, 'height': '100%' }
      : { 'height': `${ratio}%`, 'width': '100%' };
    }
    
    return splitType === 'horizontal'
      ? { 'height': `${ratio}%`, 'width': '100%' }
      : { 'width': `${ratio}%`, 'height': '100%' };
  }

  getComponentSplitStyle(overrideflexdirection:boolean,splitType: string, data: (screendetails | componentdetails)[]): any {
    if(overrideflexdirection){
      return splitType === 'horizontal' ? { 'height': (100/Object.keys(data).length).toString() + '%', 'width': '100%' } : { 'width': (100/Object.keys(data).length).toString() + '%','height':'100%' };
    }

    return splitType === 'horizontal' ? { 'width': (100/Object.keys(data).length).toString() + '%', 'height': '100%' } : { 'height': (100/Object.keys(data).length).toString() + '%','width':'100%' };
  }

  private loadDynamicComponents(components: QueryList<ViewContainerRef>) {
    let componentRefIndex = 0;
  
    Object.keys(this.splitContent.data).forEach(key => {
      const currentData = this.splitContent.data[parseInt(key)];
      currentData.forEach((componentDetail: componentdetails | screendetails) => {
        if (this.isComponentDetails(componentDetail)) {
          const viewContainerRef = components.toArray()[componentRefIndex++];
          if (viewContainerRef) {
            this.loadItem(componentDetail, viewContainerRef);
          }
        }
      });
    });
  }

  handleNestedEvent(event: any){
    this.splitscreenEvent.emit(event);
  }
  
  private loadItem(itemDetails: componentdetails, viewContainerRef: ViewContainerRef) {
    const componentRef = viewContainerRef.createComponent(itemDetails.name);
    componentRef.instance.inputs =  itemDetails.inputs;

    componentRef.instance.dynamicEvent?.subscribe((event:any) => {
      if("title" in event){
        this.handleNestedEvent(event);
      }
    });
  }
}

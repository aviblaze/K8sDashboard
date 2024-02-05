import { Component,Input,OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-horizontalcontainer',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './horizontalcontainer.component.html',
  styleUrl: './horizontalcontainer.component.scss'
})
export class HorizontalcontainerComponent implements OnInit{
  @Input() items: { image: string; title: string; description: string; }[] = [];
  currentIndex = 0;
  intervalId: any;

  ngOnInit() {
    this.startTransition();
  }

  startTransition() {
    this.intervalId = setInterval(() => {
      this.currentIndex = this.currentIndex + 1 > this.items.length - 1 ? 0 : this.currentIndex + 1 ;
    }, 20000); // 10 seconds
  }

  onArrowClick(direction: 'left' | 'right') {
    clearInterval(this.intervalId);
    if (direction === 'right') {
      this.currentIndex = this.currentIndex + 1 > this.items.length - 1 ? 0 : this.currentIndex + 1 ;
    } else {
      this.currentIndex = this.currentIndex - 1 < 0 ? this.items.length - 1 : this.currentIndex - 1;
    }
    this.startTransition();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}


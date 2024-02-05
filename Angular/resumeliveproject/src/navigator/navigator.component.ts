import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { PlaygroundComponent } from '../playground/playground.component';
import { ProjectsComponent } from '../projects/projects.component';


@Component({
  selector: 'app-navigator',
  standalone: true,
  imports: [HomeComponent, AboutComponent, DashboardComponent, PlaygroundComponent, ProjectsComponent, MatToolbarModule,
            RouterModule,MatIconModule],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.scss'
})
export class NavigatorComponent {

}

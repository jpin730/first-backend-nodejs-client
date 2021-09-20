import { Component, OnInit } from '@angular/core';
import { Project } from './interfaces/project.interface';
import { ProjectsService } from './services/project.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectsService: ProjectsService) {}

  ngOnInit() {
    this.projectsService.getProjects().subscribe((projects) => {
      this.projects = [...projects];
    });
  }
}

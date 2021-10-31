import { Component, OnInit } from '@angular/core';
import { Project } from './interfaces/project.interface';
import { ProjectsService } from './services/project.service';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  projects: Project[] = [];

  constructor(
    private projectsService: ProjectsService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.spinnerService.show();
    this.projectsService.getProjects().subscribe((projects) => {
      this.projects = [...projects];
      this.spinnerService.hide();
    });
  }
}

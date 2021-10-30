import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
  showSpinner$!: Observable<boolean>;

  constructor(
    private projectsService: ProjectsService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.showSpinner$ = this.spinnerService.show$;
    this.spinnerService.show();
    this.projectsService.getProjects().subscribe((projects) => {
      this.projects = [...projects];
      this.spinnerService.hide();
    });
  }
}

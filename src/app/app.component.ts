import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  ProjectEditorComponent,
  ProjectEditorDialogData,
} from './components/project-editor/project-editor.component';
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
    private matDialog: MatDialog,
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

  editProject(id: string) {
    const matDialogConfig: MatDialogConfig<ProjectEditorDialogData> = {
      data: { id, editMode: true },
      disableClose: true,
      width: '80vw',
      maxWidth: '350px',
    };
    this.matDialog.open(ProjectEditorComponent, matDialogConfig);
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
  maxProjects = 6;
  btnMessage!: string;

  constructor(
    private projectsService: ProjectsService,
    private spinnerService: SpinnerService,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.spinnerService.show();
    this.projectsService.getProjects().subscribe((projects) => {
      this.projects = [...projects];
      this.setBtnMessage();
      this.spinnerService.hide();
    });
  }

  setBtnMessage() {
    this.btnMessage =
      this.projects.length >= this.maxProjects
        ? `Max. Project Quantity: ${this.maxProjects}`
        : 'Add New Project';
  }

  addProject() {
    const matDialogConfig: MatDialogConfig<ProjectEditorDialogData> = {
      data: { id: '', editMode: false },
      disableClose: true,
      width: '80vw',
      maxWidth: '350px',
      maxHeight: '90vh',
    };
    const dialogRef = this.matDialog.open<
      ProjectEditorComponent,
      MatDialogConfig,
      Project
    >(ProjectEditorComponent, matDialogConfig);
    dialogRef.afterClosed().subscribe((project) => {
      if (project) {
        this.projects.push(project);
      }
    });
  }
}

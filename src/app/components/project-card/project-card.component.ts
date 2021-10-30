import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Project } from 'src/app/interfaces/project.interface';
import {
  ProjectEditorComponent,
  ProjectEditorDialogData,
} from '../project-editor/project-editor.component';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent {
  @Input() project!: Project;
  langs = this.project?.langs.split(',');

  constructor(private matDialog: MatDialog) {}

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

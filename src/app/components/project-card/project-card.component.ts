import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  _project!: Project;
  langs!: string[];
  @Input() set project(project: Project) {
    this._project = project;
    this.langs = project.langs.split(',');
  }
  get project() {
    return this._project;
  }

  constructor(
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  editProject(id: string) {
    const matDialogConfig: MatDialogConfig<ProjectEditorDialogData> = {
      data: { id, editMode: true },
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
        this.project = project;
        this.changeDetectorRef.markForCheck();
      }
    });
  }
}

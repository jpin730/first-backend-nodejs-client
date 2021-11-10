import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Project } from 'src/app/interfaces/project.interface';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../confirm-dialog/confirm-dialog.component';
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

  @Output() deleted = new EventEmitter<string>();

  constructor(
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  editProject(id: string) {
    const matDialogConfig: MatDialogConfig<ProjectEditorDialogData> = {
      data: { id, editMode: true },
      disableClose: true,
      width: '90%',
      maxWidth: '420px',
      maxHeight: '80vh',
    };
    const dialogRef = this.matDialog.open<
      ProjectEditorComponent,
      ProjectEditorDialogData,
      Project
    >(ProjectEditorComponent, matDialogConfig);
    dialogRef.afterClosed().subscribe((project) => {
      if (project) {
        this.project = project;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  deleteProject(id: string) {
    const matDialogConfig: MatDialogConfig<ConfirmDialogData> = {
      data: { message: `Do you want to delete "${this.project.name}"?` },
      disableClose: true,
      maxWidth: '350px',
    };
    const dialogRef = this.matDialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData,
      boolean
    >(ConfirmDialogComponent, matDialogConfig);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.deleted.emit(id);
      }
    });
  }
}

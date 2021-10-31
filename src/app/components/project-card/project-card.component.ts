import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
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
export class ProjectCardComponent implements OnInit {
  @Input() project!: Project;
  langs!: string[];

  constructor(private matDialog: MatDialog) {}

  ngOnInit() {
    this.langs = this.project.langs.split(',');
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

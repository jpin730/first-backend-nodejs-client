import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/interfaces/project.interface';
import { ProjectsService } from 'src/app/services/project.service';

export interface ProjectEditorDialogData {
  id: string;
  editMode: boolean;
}

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss'],
})
export class ProjectEditorComponent implements OnInit {
  projectForm = this.fb.group({
    name: ['', Validators.required],
  });

  get name() {
    return this.projectForm.get('name') as FormControl;
  }

  constructor(
    private projectsService: ProjectsService,
    @Inject(MAT_DIALOG_DATA) private dialogData: ProjectEditorDialogData,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.projectsService
      .getProject(this.dialogData.id)
      .subscribe((project: Project) => {
        this.name.patchValue(project.name);
      });
  }

  onSubmit() {}
}

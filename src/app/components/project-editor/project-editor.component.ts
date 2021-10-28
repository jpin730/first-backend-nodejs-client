import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/interfaces/project.interface';
import { ProjectsService } from 'src/app/services/project.service';
import { SpinnerService } from 'src/app/services/spinner.service';

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
    description: ['', Validators.required],
    category: ['', Validators.required],
    year: ['', Validators.required],
    langs: ['', Validators.required],
    image: [''],
  });

  get minYear() {
    return new Date(1990, 0);
  }

  get maxYear() {
    const todayYear = new Date().getFullYear();
    return new Date(todayYear, 0);
  }

  get name() {
    return this.projectForm.get('name') as FormControl;
  }

  get description() {
    return this.projectForm.get('description') as FormControl;
  }

  get category() {
    return this.projectForm.get('category') as FormControl;
  }

  get year() {
    return this.projectForm.get('year') as FormControl;
  }

  get langs() {
    return this.projectForm.get('langs') as FormControl;
  }

  get image() {
    return this.projectForm.get('image') as FormControl;
  }

  constructor(
    private projectsService: ProjectsService,
    @Inject(MAT_DIALOG_DATA) private dialogData: ProjectEditorDialogData,
    private fb: FormBuilder,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    if (this.dialogData.editMode) {
      setTimeout(this.getProject.bind(this));
    }
  }

  getProject() {
    this.spinnerService.show();
    this.projectsService
      .getProject(this.dialogData.id)
      .subscribe((project: Project) => {
        const { name, description, category, year, langs, image } = project;
        this.projectForm.patchValue({
          name,
          description,
          category,
          year: new Date(year, 0),
          langs,
          image,
        });
        this.spinnerService.hide();
      });
  }

  yearSelected(chosenDate: Date, datepicker: MatDatepicker<any>) {
    this.year.setValue(chosenDate);
    datepicker.close();
  }

  onSubmit() {}
}

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/interfaces/project.interface';
import { ProjectsService } from 'src/app/services/project.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export interface ProjectEditorDialogData {
  id: string;
  editMode: boolean;
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ProjectEditorComponent implements OnInit {
  @ViewChild('chipList')
  chipList!: MatChipList;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  projectForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    year: ['', Validators.required],
    langs: ['', Validators.required],
    image: [''],
  });
  imageFile: File | null | undefined;
  imagePreview!: string;
  imageMaxSizeMB = 2;
  imageError = false;
  langList: string[] = [];

  get minYear() {
    return moment('1990');
  }

  get maxYear() {
    return moment(moment().year().toString());
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
    @Inject(MAT_DIALOG_DATA) public dialogData: ProjectEditorDialogData,
    private fb: FormBuilder,
    private spinnerService: SpinnerService,
    public dialogRef: MatDialogRef<ProjectEditorComponent>
  ) {}

  ngOnInit() {
    if (this.dialogData.editMode) {
      setTimeout(this.getProject.bind(this));
    }
  }

  getProject() {
    this.spinnerService.show();
    this.projectsService.getProject(this.dialogData.id).subscribe(
      (project: Project) => {
        const { name, description, category, year, langs, image } = project;
        this.projectForm.patchValue({
          name,
          description,
          category,
          year: moment(year.toString()),
          langs,
          image,
        });
        this.imagePreview = image || '';
        this.setLangList(langs);
        this.spinnerService.hide();
      },
      () => this.dialogRef.close(undefined)
    );
  }

  yearSelected(chosenDate: Date, datepicker: MatDatepicker<any>) {
    this.year.setValue(chosenDate);
    this.year.markAsDirty();
    datepicker.close();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0);

    if (
      file?.type.match(/image\/(jpeg|png)/) === null ||
      (file?.size as number) > this.imageMaxSizeMB * 1e6
    ) {
      this.imageError = true;
      return;
    }

    this.imageError = false;
    this.imageFile = file;
    this.image.markAsDirty();

    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);
    reader.onload = () => {
      this.imagePreview = reader.result?.toString() || this.imagePreview;
    };
  }

  onSubmit() {
    this.spinnerService.show();
    const { name, description, category, year, langs } = this.projectForm.value;
    const project: Project = {
      _id: this.dialogData.id || '',
      name,
      description,
      category,
      year: (year as moment.Moment).year(),
      langs,
    };

    if (this.dialogData.editMode) {
      this.projectsService
        .putProject(project)
        .pipe(switchMap((projectUpdated) => this.uploadImage(projectUpdated)))
        .subscribe((projectUpdated) => {
          this.dialogRef.close(projectUpdated);
          this.spinnerService.hide();
        });
    } else {
      this.projectsService
        .postProject(project)
        .pipe(switchMap((projectUpdated) => this.uploadImage(projectUpdated)))

        .subscribe((projectUpdated) => {
          this.dialogRef.close(projectUpdated);
          this.spinnerService.hide();
        });
    }
  }

  addChip(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) {
      this.langList.push(value);
      this.patchLangsValue();
    }
    this.chipList.errorState = this.langList.length === 0;
    event.chipInput!.clear();
  }

  removeChip(lang: string) {
    const index = this.langList.indexOf(lang);
    if (index >= 0) {
      this.langList.splice(index, 1);
      this.patchLangsValue();
    }
    this.chipList.errorState = this.langList.length === 0;
  }

  private setLangList(langs: string) {
    this.langList = langs.split(',');
  }

  private patchLangsValue() {
    const value = this.langList.length === 0 ? '' : this.langList.join(',');
    this.langs.patchValue(value);
    this.langs.markAsDirty();
  }

  private uploadImage(projectUpdated: Project) {
    return this.image.dirty && this.imageFile
      ? this.projectsService.putProjectImage(projectUpdated._id, this.imageFile)
      : of(projectUpdated);
  }
}

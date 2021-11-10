import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Project } from '../interfaces/project.interface';
import { environment } from '../../environments/environment';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { catchError, last, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { SpinnerService } from './spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  endpoint = 'projects';

  constructor(
    private httpClient: HttpClient,
    private angularFireStorage: AngularFireStorage,
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar
  ) {}

  getProjects(): Observable<Project[]> {
    return this.httpClient
      .get<Project[]>(`${environment.baseApiUrl}/${this.endpoint}`)
      .pipe(catchError((err: HttpErrorResponse) => this.errorHandler(err)));
  }

  getProject(id: string): Observable<Project> {
    return this.httpClient
      .get<Project>(`${environment.baseApiUrl}/${this.endpoint}/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => this.errorHandler(err)));
  }

  postProject(project: Project): Observable<Project> {
    return this.httpClient
      .post<Project>(
        `${environment.baseApiUrl}/${this.endpoint}/${project._id}`,
        project
      )
      .pipe(catchError((err: HttpErrorResponse) => this.errorHandler(err)));
  }

  putProject(project: Project): Observable<Project> {
    return this.httpClient
      .put<Project>(
        `${environment.baseApiUrl}/${this.endpoint}/${project._id}`,
        project
      )
      .pipe(catchError((err: HttpErrorResponse) => this.errorHandler(err)));
  }

  putProjectImage(id: string, imageFile: File): Observable<Project> {
    return this.angularFireStorage
      .upload(id, imageFile)
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => this.angularFireStorage.ref(id).getDownloadURL()),
        switchMap((image: string) =>
          this.httpClient.put<Project>(
            `${environment.baseApiUrl}/${this.endpoint}/${id}/image`,
            { image }
          )
        ),
        catchError((err: HttpErrorResponse) => this.errorHandler(err))
      );
  }

  deleteProject(id: string): Observable<Project> {
    return this.angularFireStorage
      .ref(id)
      .delete()
      .pipe(
        switchMap((params) => {
          console.log(params);
          return this.httpClient.delete<Project>(
            `${environment.baseApiUrl}/${this.endpoint}/${id}`
          );
        }),
        catchError((err: HttpErrorResponse) => this.errorHandler(err))
      );
  }

  private errorHandler(err: HttpErrorResponse): Observable<never> {
    console.log(err);
    this.spinnerService.hide();
    this.snackBar.open('Something is wrong. Try again.', 'Close');
    return throwError(err);
  }
}

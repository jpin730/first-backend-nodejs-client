import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../interfaces/project.interface';
import { environment } from '../../environments/environment';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { last, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  endpoint = 'projects';

  constructor(
    private httpClient: HttpClient,
    private angularFireStorage: AngularFireStorage
  ) {}

  getProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(
      `${environment.baseApiUrl}/${this.endpoint}`
    );
  }

  getProject(id: string): Observable<Project> {
    return this.httpClient.get<Project>(
      `${environment.baseApiUrl}/${this.endpoint}/${id}`
    );
  }

  postProject(project: Project): Observable<Project> {
    return this.httpClient.post<Project>(
      `${environment.baseApiUrl}/${this.endpoint}/${project._id}`,
      project
    );
  }

  putProject(project: Project): Observable<Project> {
    return this.httpClient.put<Project>(
      `${environment.baseApiUrl}/${this.endpoint}/${project._id}`,
      project
    );
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
        )
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
        })
      );
  }
}

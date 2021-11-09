import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../interfaces/project.interface';
import { environment } from '../../environments/environment';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { last, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  endpoint = 'projects';

  constructor(
    private httpClient: HttpClient,
    private angularFireStorage: AngularFireStorage
  ) {}

  getProjects() {
    return this.httpClient.get<Project[]>(
      `${environment.baseApiUrl}/${this.endpoint}`
    );
  }

  getProject(id: string) {
    return this.httpClient.get<Project>(
      `${environment.baseApiUrl}/${this.endpoint}/${id}`
    );
  }

  postProject(project: Project) {
    return this.httpClient.post<Project>(
      `${environment.baseApiUrl}/${this.endpoint}/${project._id}`,
      project
    );
  }

  putProject(project: Project) {
    return this.httpClient.put<Project>(
      `${environment.baseApiUrl}/${this.endpoint}/${project._id}`,
      project
    );
  }

  putProjectImage(id: string, imageFile: File) {
    const task = this.angularFireStorage.upload(id, imageFile);
    return task.snapshotChanges().pipe(
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
}

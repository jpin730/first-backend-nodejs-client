import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../interfaces/project.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  endpoint = 'projects';

  constructor(private httpClient: HttpClient) {}

  getProjects() {
    return this.httpClient.get<Project[]>(
      `${environment.baseApiUrl}/${this.endpoint}`
    );
  }
}

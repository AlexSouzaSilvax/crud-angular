import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../model/course';
import { first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  //private readonly API = '/assets/courses.json';
  private readonly API = 'api/courses';

  constructor(private httpClient: HttpClient) {}

  list() {
    return this.httpClient.get<Course[]>(this.API).pipe(
      first()
      //delay(1500),
      //tap((courses) => console.log(courses))
    );
  }

  save(record: Course) {
    if (record._id) {
      return this.httpClient
        .post<Course>(`${this.API}/update`, record)
        .pipe(first());
    } else {
      return this.httpClient
        .post<Course>(`${this.API}/create`, record)
        .pipe(first());
    }
  }

  delete(id: string) {
    return this.httpClient.post<Course>(`${this.API}/delete`, id).pipe(first());
  }
}

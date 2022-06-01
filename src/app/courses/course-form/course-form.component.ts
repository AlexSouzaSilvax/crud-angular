import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private service: CoursesService,
    private snackbar: MatSnackBar,
    private location: Location
  ) {
    this.form = this.formBuilder.group({
      name: [null],
      category: [null],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.service.save(this.form.value).subscribe(
      (result) => this.onSuccess(result),
      (error) => this.onError()
    );
  }

  onCancel() {
    this.location.back();
  }

  private onSuccess(result: Course) {
    if (result._id != null) {
      this.snackbar.open(`${result._id} Salvo com sucesso`, '', {
        duration: 5000,
      });
      this.onCancel();
    }
  }

  private onError() {
    this.snackbar.open('Erro ao salvar curso', '', { duration: 5000 });
  }
}

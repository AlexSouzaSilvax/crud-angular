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
  courseSelected: Course | undefined;
  actionMessage!: String;

  constructor(
    private formBuilder: FormBuilder,
    private service: CoursesService,
    private snackbar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      name: [null],
      category: [null],
    });
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.courseSelected = JSON.parse(routeParams.get('course'));
    this.form = this.formBuilder.group({
      _id: [this.courseSelected?._id],
      name: [this.courseSelected?.name],
      category: [this.courseSelected?.category],
    });
  }

  onSubmit() {
    this.actionMessage = 'save';
    if (this.courseSelected?._id != null) {
      this.actionMessage = 'update';
    }

    this.service.save(this.form.value).subscribe(
      (result) => this.onSuccess(result, this.actionMessage),
      (error) => this.onError(this.actionMessage)
    );
  }

  onCancel() {
    this.location.back();
  }

  private onSuccess(result: Course, actionMessage: String) {
    if (result._id != null) {
      this.snackbar.open(`${result._id} ${actionMessage} success`, '', {
        duration: 5000,
      });
      this.onCancel();
    }
  }

  private onError(actionMessage: String) {
    this.snackbar.open(`error ${actionMessage}`, '', { duration: 5000 });
  }
}

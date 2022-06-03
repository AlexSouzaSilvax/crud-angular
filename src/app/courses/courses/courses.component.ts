import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  courses$!: Observable<Course[]>;
  displayedColumns = ['_id', 'name', 'category', 'actions'];

  constructor(
    private coursesService: CoursesService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private service: CoursesService,
    private snackbar: MatSnackBar,
    private location: Location
  ) {
    this.onCourses();
  }

  onCourses() {
    this.courses$ = this.coursesService.list().pipe(
      catchError((error) => {
        this.onError('Erro ao carregar cursos');
        return of([]);
      })
    );
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg,
    });
  }

  //criar um shared
  onCancel() {
    this.location.back();
  }

  private onSuccess(actionMessage: string) {
    this.snackbar.open(actionMessage, '', {
      duration: 5000,
    });
    this.onCourses();
  }

  ngOnInit(): void {}

  onAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEdit(pCourse: Course) {
    this.router.navigate(['new', { course: JSON.stringify(pCourse) }], {
      relativeTo: this.route,
    });
  }

  onClickDelete(_id: string) {
    this.openDialog(
      'Deseja realmente apagar ?',
      'Esta ação não poderá ser revertida',
      async () => this.onDelete(_id)
    );
  }

  onDelete(id: string) {
    this.service.delete(id).subscribe(
      (result) => this.onSuccess('delete success'),
      (error) => this.onError('delete error')
    );
  }

  openDialog(pTitle: string, pDescription: string, pOnConfirm: () => {}) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: pTitle,
        description: pDescription,
        onConfirm: pOnConfirm,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log('The dialog was closed');
    });
  }
}

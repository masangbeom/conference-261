import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {User} from './user.model';
import {AppService} from './app.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  users: User[];
  applyForm: FormGroup;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.applyForm = this.formBuilder.group({
      type: ['', Validators.required],
      user_id: ['', Validators.required],
      user_name: [''],
      phone_number: [''],
      company_name: [''],
    });
    this.appService.onUsersChanged.subscribe(users => {
      this.users = users;
    });
  }

  submit(): void {
    const newUser = this.applyForm.getRawValue();
    this.appService.postUser(newUser).then((createdUser) => {
      this.matSnackBar.open(
        `${createdUser.user_id} 님 ${createdUser.type}에 신청되었습니다.`,
        '확인',
        {
          duration: 2000,
        });
      this.applyForm.reset();
    });
  }

  openPrintDialog(user: User): void {
    const {user_id, user_name, type} = user;
    this.matDialog.open(PrintDialogComponent, {
      width: '400px',
      data: {user_id, user_name, type},
    });
  }
}

@Component({
  selector: 'app-print-dialog',
  templateUrl: 'print-dialog.html',
})
export class PrintDialogComponent {
  cfUrl = 'https://d1layc7nbewq7l.cloudfront.net';
  qrImgUrl = `${this.cfUrl}/qrcodes/${this.data.user_id}/${this.data.type}/qrcode.jpg`;
  constructor(
    public dialogRef: MatDialogRef<PrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { NgFor, NgIf } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DetailComponent } from '../detail/detail.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatGridListModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

  matcher!: ErrorStateMatcher;

  employeeForm = new FormGroup({
    firstname: new FormControl('',[Validators.minLength(3), Validators.required]),
    lastname: new FormControl('', [Validators.minLength(3), Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    age: new FormControl(null, Validators.min(18)),
    image: new FormControl('')
  });

  constructor(private empService: EmployeeService, public dialog: MatDialog) { }

  @ViewChild('delete') deleteDialog!: TemplateRef<any>;

  employees: Employee[] = [];
  employee = {} as Employee;
  child!: DetailComponent;
  file!: File;
  url!: string | ArrayBuffer | null;
  base64textString: string = "";

  ngOnInit() {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.empService.getEmployees().subscribe(employees => this.employees = employees);
  }

  add(image: string) {
    const emp = {} as Employee;

    emp.firstname = this.employeeForm.value.firstname as string;
    emp.lastname = this.employeeForm.value.lastname as string;
    emp.email = this.employeeForm.value.email as string;
    if (this.employeeForm.value.age != null)
    {
      emp.age = this.employeeForm.value.age as number;
    }
    emp.image = this.url?.toString();

    this.empService.addEmployee(emp).subscribe(emplo => {
      this.empService.getEmployees().subscribe(employees => this.employees = employees);
      this.employees.push(emp);
    });
  }

  openDialog(emp: Employee) {
    if(confirm("Are you sure to delete " + emp.firstname)) {
      this.employees = this.employees.filter(h => h !== emp);
      this.empService.deleteEmployee(emp.emp_id).subscribe();
      // console.log("Implement delete functionality here");
    }
    else {
      this.dialog.closeAll();
    }
  }

  readUrl(event: any) {
    this.file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var displayImg = new FileReader();

      displayImg.onload = (event: any) => {
        this.url = event.target.result;
      };
      displayImg.readAsDataURL(event.target.files[0]);

      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.file);
    }
  }

  _handleReaderLoaded(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    // console.log(btoa(binaryString));
  }

  removeImage() {
    this.url = null;
    this.base64textString = '';
  }
}

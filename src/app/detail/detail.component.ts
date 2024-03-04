import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../employee/employee';
import { Location, NgIf, NgStyle, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgIf, UpperCasePipe, FormsModule, NgStyle, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatGridListModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {

  @ViewChild('delete') deleteDialog!: TemplateRef<any>;
  @ViewChild('employeeImage') empImg!: ElementRef<HTMLInputElement>;

  employee!: Employee;
  file!: File;
  newStr!: string[] | undefined;
  newUrl = '' as string;
  imageSource: any;
  width = 100;
  height = 100;
  url!: string | ArrayBuffer | null;

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private empService: EmployeeService, private location: Location) { }

  id = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void {
    this.getEmployee();
  }

  getEmployee(): void {
    this.empService.getEmployee(this.id).subscribe(emp => this.employee = emp);
    this.imageSource = this.sanitizer.bypassSecurityTrustUrl(`${this.employee.image}`);
  }

  save(emp: Employee) {
    this.empService.updateEmployee(this.id, emp).subscribe();
    this.imageSource = this.sanitizer.bypassSecurityTrustUrl(`${this.employee.image}`);
    this.removeImage();
  }

  goBack(): void {
    this.location.back();
  }

  readUrl(event: any) {
    this.file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var displayImg = new FileReader();

      displayImg.onload = (event: any) => {
        this.url = event.target.result;
        this.employee.image = this.url?.toString();
        console.log("Base64: " + this.url);
      }
      displayImg.readAsDataURL(event.target.files[0]);
    }
  }

  removeImage() {
    this.url = null;
    this.empImg.nativeElement.value = '';
  }
}

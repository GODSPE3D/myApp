import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { DetailComponent } from './detail/detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/employee/emp', pathMatch: 'full' },
  { path: 'employee/emp', component: EmployeeComponent },
  { path: 'detail/:id', component: DetailComponent }
];

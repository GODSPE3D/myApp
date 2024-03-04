import { Employee } from './employee';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private employeeURL = 'http://127.0.0.1:5000/employee';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient, private messageService: MessageService) { }

  getEmployees(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(this.employeeURL).pipe(
      tap(_ => this.log('fetched employees')),
      catchError(this.handleError<Employee[]>('getEmployees', [])));;
  }

  getEmployee(id: number): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.employeeURL}/detail/${id}`);
  }

  addEmployee(emp: Employee): Observable<Employee> {
    return this.httpClient.post<Employee>(`${this.employeeURL}/add`, emp, this.httpOptions);
  }

  updateEmployee(id: number, emp: Employee): Observable<Employee> {
    return this.httpClient.put<Employee>(`${this.employeeURL}/update/${id}`, emp, this.httpOptions);
  }

  deleteEmployee(id: number) {
    return this.httpClient.delete(`${this.employeeURL}/delete/${id}`, this.httpOptions);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`EmployeeService: ${message}`);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpParams } from "@angular/common/http";
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  constructor(private http: HttpClient,private router:Router) {
    // const dateTime = new Date()
  }


  // Authorization functions

  storeToken(token: any) {
    localStorage.setItem('authToken', token);
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
    console.log('User logged out');
  }

  employee_login(loginForm: FormGroup) {
    const loginparams = {
      username: loginForm.value.username,
      password: loginForm.value.password
    };
    console.log("Loginparams", loginparams)

    return this.http.post<{ token: string }>('http://127.0.0.1:8000/employee/login', loginparams);

  }

  manager_login(loginForm: FormGroup) {
    const loginparams = {
      username: loginForm.value.username,
      password: loginForm.value.password
    };
    console.log("Loginparams", loginparams)

    return this.http.post<{ token: string }>('http://127.0.0.1:8000/manager/login', loginparams);

  }

  admin_login(loginForm: FormGroup) {
    const loginparams = {
      username: loginForm.value.username,
      password: loginForm.value.password
    };
    console.log("Loginparams", loginparams)

    return this.http.post<{ token: string }>('http://127.0.0.1:8000/admin/login', loginparams);

  }

  addRequest(newRequest: any): Observable<any> {
    const token = this.getToken();
  
    if (!token) {
      console.error('User not authenticated');
      return throwError(() => new Error('User not authenticated'));
    }
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json' // Ensure JSON content type
      })
    };
  
    const requestBody = {
      from_location: newRequest.value.from,
      to_location: newRequest.value.to,
      departure_date: newRequest.value.departureDate,
      return_date: newRequest.value.returnDate,
      accomodation: newRequest.value.accommodation_loc,
      travel_mode: newRequest.value.travelMode,
      purpose: newRequest.value.purpose,
      additional_note: newRequest.value.additionalNote
    };
  
    console.log("Trying to log new request", requestBody);
  
    return this.http.post<any>(
      'http://127.0.0.1:8000/employee/new_request',
      requestBody,  // ✅ Sending data in body, not headers
      httpOptions
    );
  }
  

  listRequests(sortBy = '', filterFrom = '',
    filterTo = '', filterStatus = ''): Observable<any[]> {

    const token = this.getToken();

    if (!token) {
      console.error('User not authenticated');
      
      return throwError(() => new Error('User not authenticated'));

    }

    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    let params = new HttpParams();

    if (sortBy) {
      params = params.set('date_sort', sortBy);
    }
    if (filterFrom) {
      params = params.set('from', filterFrom);
    }
    if (filterTo) {
      params = params.set('to', filterTo);
    }
    if (filterStatus) {
      params = params.set('status', filterStatus);
      console.log(params)
    }

    return this.http.get<any[]>('http://127.0.0.1:8000/employee/list', { params,headers },);

  }

  listRequestsManager(sortBy = '', filterFrom = '',
    filterTo = '', filterStatus = '',filterEmployee=''): Observable<any[]> {

    const token = this.getToken();

    if (!token) {
      console.error('User not authenticated');
      
      return throwError(() => new Error('User not authenticated'));

    }

    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    let params = new HttpParams();

    if (sortBy) {
      params = params.set('date_sort', sortBy);
    }
    if (filterFrom) {
      params = params.set('from', filterFrom);
    }
    if (filterTo) {
      params = params.set('to', filterTo);
    }
    if (filterStatus) {
      params = params.set('status', filterStatus);
      console.log(params)
    }

    if(filterEmployee){
      params = params.set('search',filterEmployee)
    }


    return this.http.get<any[]>('http://127.0.0.1:8000/manager/list', { params,headers },);

  }

  listRequestsAdmin(sortBy = '', filterFrom = '',
    filterTo = '', filterStatus = '',filterEmployee=''): Observable<any[]> {

    const token = this.getToken();

    if (!token) {
      console.error('User not authenticated');
      
      return throwError(() => new Error('User not authenticated'));

    }
    
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    let params = new HttpParams();

    if (sortBy) {
      params = params.set('date_sort', sortBy);
    }
    if (filterFrom) {
      params = params.set('from', filterFrom);
    }
    if (filterTo) {
      params = params.set('to', filterTo);
    }
    if (filterStatus) {
      params = params.set('status', filterStatus);
      console.log(params)
    }

    if(filterEmployee){
      params = params.set('search',filterEmployee)
    }


    return this.http.get<any[]>('http://127.0.0.1:8000/admin/list', { params,headers },);

  }

  viewRequest(requestId: number) {

    let stringRequest = requestId as unknown
    stringRequest = stringRequest as number
    console.log("Navigate to Request_id",stringRequest)
    const url = 'http://127.0.0.1:8000/employee/request/' + stringRequest
    console.log(url)

    const token = this.getToken();
    if (!token) {
      console.error('User not authenticated');
      return throwError(() => new Error('User not authenticated'));
    }
    
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    
    return this.http.get<any[]>(url,{headers});

  }

  viewRequestManager(requestId: number) {

    let stringRequest = requestId as unknown
    stringRequest = stringRequest as number
    console.log("Navigate to Request_id",stringRequest)
    const url = 'http://127.0.0.1:8000/manager/request/' + stringRequest
    console.log(url)

    const token = this.getToken();
    if (!token) {
      console.error('User not authenticated');
      return throwError(() => new Error('User not authenticated'));
    }
    
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    
    return this.http.get<any[]>(url,{headers});

  }

  viewRequestAdmin(requestId: number) {

    let stringRequest = requestId as unknown
    stringRequest = stringRequest as number
    console.log("Navigate to Request_id",stringRequest)
    const url = 'http://127.0.0.1:8000/admin/request/' + stringRequest
    console.log(url)

    const token = this.getToken();
    if (!token) {
      console.error('User not authenticated');
      return throwError(() => new Error('User not authenticated'));
    }
    
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    
    return this.http.get<any[]>(url,{headers});

  }

  storeManager(managerName: any) {
    localStorage.setItem('manager', managerName);
    console.log("Manager is ",managerName)
  }

  getManager():string | null {
    return localStorage.getItem('manager');
  }

  updateRequest(requestId: number, requestData: any='') {
    const url = `http://127.0.0.1:8000/manager/request/${requestId}/edit`;
    const token = this.getToken();
    if (!token) {
      console.error('User  not authenticated');
      return throwError(() => new Error('User  not authenticated'));
    }
    
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.patch<any>(url, requestData, { headers });
  }
  deleteRequest(requestId: number) {
    const url = `http://127.0.0.1:8000/employee/request/${requestId}/edit`;
    const token = this.getToken();
    if (!token) {
      console.error('User  not authenticated');
      return throwError(() => new Error('User  not authenticated'));
    }
    
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.delete<any>(url, { headers });
  }

  updateEmployeeNote(requestId: number, updateData: any) {
    const url = `http://127.0.0.1:8000/employee/request/${requestId}/updatenote`;
    const token = this.getToken();
    if (!token) {
      console.error('User not authenticated');
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.patch<any>(url, updateData, { headers });
}

updateManagerNote(requestId: number, updateData: any) {
  const url = `http://127.0.0.1:8000/manager/request/${requestId}/addnote`;
  const token = this.getToken();
  if (!token) {
    console.error('User not authenticated');
    return throwError(() => new Error('User not authenticated'));
  }

  const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
  return this.http.patch<any>(url, updateData, { headers });
}

updateAdminNote(requestId: number, updateData: any) {
  const url = `http://127.0.0.1:8000/admin/request/${requestId}/addnote`;
  const token = this.getToken();
  if (!token) {
    console.error('User not authenticated');
    return throwError(() => new Error('User not authenticated'));
  }

  const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
  return this.http.patch<any>(url, updateData, { headers });
}

listEmployeesAdmin(){
  const token = this.getToken();
  if (!token) {
    console.error('User not authenticated');
    return throwError(() => new Error('User not authenticated'));
  }
  const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

  return this.http.get<any[]>('http://127.0.0.1:8000/admin/manage_employees', { headers },);
}

listManagersAdmin(){
  const token = this.getToken();
  if (!token) {
    console.error('User not authenticated');
    return throwError(() => new Error('User not authenticated'));
  }
  const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

  return this.http.get<any[]>('http://127.0.0.1:8000/admin/manage_managers', { headers },);
}

addEmployee(employeeForm: any){
  const token = this.getToken();

  if (!token) {
    console.error('User not authenticated');
    return throwError(() => new Error('User not authenticated'));
  }

  const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json' 
    })
  };

  const requestBody = {
    name: employeeForm.value.name,
    manager_id: employeeForm.value.manager,
    username: employeeForm.value.username,
    email: employeeForm.value.email,
    password: employeeForm.value.password,
    
  };

  console.log("Trying to log new request", requestBody);

  return this.http.post<any>(
    'http://127.0.0.1:8000/admin/manage_employees',
    requestBody, 
    httpOptions
  );
}

addManager(employeeForm: any){
  const token = this.getToken();

  if (!token) {
    console.error('User not authenticated');
    return throwError(() => new Error('User not authenticated'));
  }

  const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json' 
    })
  };

  const requestBody = {
    name: employeeForm.value.name,
    manager_id: employeeForm.value.manager,
    username: employeeForm.value.username,
    email: employeeForm.value.email,
    password: employeeForm.value.password,
    
  };

  console.log("Trying to log new request", requestBody);

  return this.http.post<any>(
    'http://127.0.0.1:8000/admin/manage_managers',
    requestBody, 
    httpOptions
  );
}


}



import { Component } from '@angular/core';
import { ConnectorService } from '../../connector.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrl: './view-request.component.css'
})
export class ViewRequestComponent implements OnInit {

  request: any = {}
  requestId!: number; 
  managerNote  = ''
  adminNote =''

constructor(private connector: ConnectorService,
  private router:Router,
  private route: ActivatedRoute,private cdr: ChangeDetectorRef) {

}

ngOnInit(){
  const id = this.route.snapshot.paramMap.get('id');
  console.log("Starting view request")
  if (id) {
    this.requestId = +id; 
  } else {
    console.error('Request ID not found in the route parameters.');
    return;
  }
  this.showRequest(this.requestId)
  console.log("Request status:", this.request?.status);
}
  showRequest(requestId:any): void {
    console.log("Starting to access data")
    console.log("The note is ",this.adminNote)
    this.connector.viewRequestAdmin(requestId).subscribe(
      data => {
        console.log('Received data:', data);
        this.request = data;
        this.cdr.detectChanges();
        this.adminNote = this.request.adminNote
        if (this.request.adminNote !== null && this.request.adminNote !== undefined) {
          this.adminNote = this.request.adminNote;
        }
        console.log("note", this.adminNote);
      },

      error => {
        console.log('Error occurred', error);
      }
    );
  }

  onupdateNote() {
    console.log("Before sending request, admin note is:", this.adminNote);
    if(!this.adminNote){
      alert('The note is empty')
    }
    const updateData = {  admin_note: this.adminNote , status :"update" };

    this.connector.updateAdminNote(this.requestId, updateData).subscribe(
      response => {
        console.log('Note updated successfully:', response);
        alert('Note updated successfully!');
      },
      error => {
        console.error('Failed to update note:', error);
        alert('Failed to update note.');
      }
    );
  }

  onClose() {
    console.log("Before sending request, admin note is is:", this.adminNote);
    const updateData = {  admin_note: this.adminNote , status :"closed" };

    this.connector.updateAdminNote(this.requestId, updateData).subscribe(
      response => {
        console.log('Note updated successfully:', response);
        alert('Request has been Closed');
      },
      error => {
        console.error('Failed to update note:', error);
        alert('Failed to update note.');
      }
    );
  }

  // onReject() {
  //   console.log("Before sending request, managerNote is:", this.managerNote);
  //   const updateData = {  manager_note: this.managerNote , status :"rejected" };

  //   this.connector.updateManagerNote(this.requestId, updateData).subscribe(
  //     response => {
  //       console.log('Note updated successfully:', response);
  //       alert('Request has been rejected');
  //     },
  //     error => {
  //       console.error('Failed to update note:', error);
  //       alert('Failed to update note.');
  //     }
  //   );
  // }

}

import { Component, OnInit } from '@angular/core';
import { ConnectorService } from '../../connector.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrl: './view-request.component.css'
})
export class ViewRequestComponent implements OnInit {

  request: any
  requestId!: number; 
  managerNote  = ''

constructor(private connector: ConnectorService,
  private router:Router,
  private route: ActivatedRoute,) {

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
}
  showRequest(requestId:any): void {
    console.log("Starting to access data")
    console.log("The note is ",this.managerNote)
    this.connector.viewRequestManager(requestId).subscribe(
      data => {
        console.log('Received data:', data);
        this.request = data;
        this.managerNote = this.request.manager_note
        if (this.request.manager_note !== null && this.request.manager_note !== undefined) {
          this.managerNote = this.request.manager_note;
        }
        console.log("note", this.managerNote);
      },

      error => {
        console.log('Error occurred', error);
      }
    );
  }

  onupdateNote() {
    console.log("Before sending request, managerNote is:", this.managerNote);
    if(!this.managerNote){
      alert('The note is empty')
    }
    const updateData = {  manager_note: this.managerNote , status :"update" };

    this.connector.updateManagerNote(this.requestId, updateData).subscribe(
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

  onApprove() {
    console.log("Before sending request, managerNote is:", this.managerNote);
    const updateData = {  manager_note: this.managerNote , status :"approved" };

    this.connector.updateManagerNote(this.requestId, updateData).subscribe(
      response => {
        console.log('Note updated successfully:', response);
        alert('Request has been approved');
      },
      error => {
        console.error('Failed to update note:', error);
        alert('Failed to update note.');
      }
    );
  }

  onReject() {
    console.log("Before sending request, managerNote is:", this.managerNote);
    const updateData = {  manager_note: this.managerNote , status :"rejected" };

    this.connector.updateManagerNote(this.requestId, updateData).subscribe(
      response => {
        console.log('Note updated successfully:', response);
        alert('Request has been rejected');
      },
      error => {
        console.error('Failed to update note:', error);
        alert('Failed to update note.');
      }
    );
  }

}

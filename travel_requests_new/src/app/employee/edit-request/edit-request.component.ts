import { Component, OnInit } from '@angular/core';
import { ConnectorService } from '../../connector.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrl: './edit-request.component.css'
})
export class EditRequestComponent implements OnInit {

  request: any;
  requestId!: number;

  constructor(
    private connector: ConnectorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log("Starting view request");
    if (id) {
      this.requestId = +id;
    } else {
      console.error('Request ID not found in the route parameters.');
      return;
    }
    this.showRequest(this.requestId);
  }

  showRequest(requestId: number): void {
    console.log("Starting to access data");
    this.connector.viewRequest(requestId).subscribe(
      data => {
        console.log('Received data:', data);
        this.request = data;
      },
      error => {
        console.log('Error occurred', error);
      }
    );
  }

  onSubmit(): void {
    console.log("Submitting updated request:", this.request);
    this.connector.updateRequest(this.requestId, this.request).subscribe(
      response => {
        console.log('Request updated successfully:', response);
        this.router.navigate(['/requests', this.requestId]);
      },
      error => {
        console.error('Error updating request:', error);
      }
    );
  }

  openDeleteModal() {
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }


  onDelete(): void {
    console.log("Deleting request:", this.requestId);
    this.connector.deleteRequest(this.requestId).subscribe(
      response => {
        console.log('Request deleted successfully:', response);
        this.router.navigate(['employee/requests']);
        console.log('Request deleted');
    // Close the modal after deletion
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
      },
      error => {
        console.error('Error deleting request:', error);
        
      }
    );
  }

  onUpdateNote(): void {
    console.log("Updating note for request:", this.requestId);
  }
}
import { Component, OnInit } from '@angular/core';
import { ConnectorService } from '../../connector.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addnote-employee',
  templateUrl: './addnote-employee.component.html',
  styleUrl: './addnote-employee.component.css'
})
export class AddnoteEmployeeComponent implements OnInit {
  request: any;
  requestId!: number;
  additionalNotes = '';

  constructor(
    private connector: ConnectorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requestId = +id;
      this.showRequest(this.requestId);
    } else {
      console.error('Request ID not found in the route parameters.');
    }
  }

  showRequest(requestId: number): void {
    this.connector.viewRequest(requestId).subscribe(
      data => {
        this.request = data;
        console.log("Request data:", this.request); 
      this.additionalNotes = this.request.employee_note ?? '';
      console.log("Loaded additionalNotes:", this.additionalNotes); 
      },
      error => {
        console.error('Error fetching request:', error);
      }
    );
  }

  onUpdateNote(additionalNotes: any): void {
    console.log('Updating additional notes:', additionalNotes);
    const updateData = { employee_note: additionalNotes };
    console.log(updateData)
    this.connector.updateEmployeeNote(this.requestId, updateData).subscribe(
      response => {
        console.log('Note updated successfully:', response);
        alert('Note updated successfully!');
      },
      error => {
        console.error('Error updating note:', error);
      }
    );
  }
}

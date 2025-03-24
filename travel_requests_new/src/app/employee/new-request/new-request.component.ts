import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { ConnectorService } from '../../connector.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrl: './new-request.component.css'
})
export class NewRequestComponent implements OnInit {
  message  = ''
  request : any
  managerName :string | null =''
  constructor(private connector:ConnectorService){
    
  }

  newRequest!: FormGroup

  ngOnInit() {
    this.newRequest = new FormGroup({
      from: new FormControl(''),
      to: new FormControl(''),
      departureDate: new FormControl(''),
      returnDate: new FormControl(''),
      accommodation: new FormControl(''),
      accommodation_loc: new FormControl(''),
      travelMode: new FormControl(''),
      purpose: new FormControl(''),
      additionalNotes: new FormControl(''),

      // from: new FormControl('', [Validators.required, Validators.minLength(3)]),
      // to: new FormControl('', [Validators.required, Validators.minLength(3)]),
      // departureDate: new FormControl('', [Validators.required, Validators.minLength(3)]),
      // returnDate: new FormControl('', [Validators.required, Validators.minLength(3)]),
      // accommodation: new FormControl('', [Validators.required, Validators.minLength(3)]),
      // accommodation_loc: new FormControl('', [Validators.required, Validators.minLength(3)]),
      // travelMode: new FormControl('', [Validators.required, Validators.minLength(3)]),
      // purpose: new FormControl('', [Validators.required, Validators.minLength(3)]),
      // additionalNotes: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
    this.managerName = this.connector.getManager()
  }
  onSubmit() {
    console.log('Form submitted:', this.newRequest.value);
  
    this.connector.addRequest(this.newRequest).subscribe({
      next: (response) => {
        console.log('Request successful:', response);
      },
      error: (error) => {
        console.error('Request failed:', error);
      }
    });
  }

  showRequest(requestId:any): void {
    console.log("Starting to access data")
    this.connector.viewRequest(requestId).subscribe(
      data => {
        console.log('Received data:', data);
        this.request = data;
        console.log(this.managerName)
      },

      error => {
        console.log('Error occurred', error);
      }
    );
  }

}

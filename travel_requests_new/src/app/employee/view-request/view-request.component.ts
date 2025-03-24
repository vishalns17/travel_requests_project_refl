import { Component,OnInit } from '@angular/core';
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

  // onUpdateNote(){
    
  // }

}

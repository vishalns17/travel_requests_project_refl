import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnoteEmployeeComponent } from './addnote-employee.component';

describe('AddnoteEmployeeComponent', () => {
  let component: AddnoteEmployeeComponent;
  let fixture: ComponentFixture<AddnoteEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddnoteEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddnoteEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

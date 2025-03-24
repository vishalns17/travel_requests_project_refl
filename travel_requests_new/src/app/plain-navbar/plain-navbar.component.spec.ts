import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainNavbarComponent } from './plain-navbar.component';

describe('PlainNavbarComponent', () => {
  let component: PlainNavbarComponent;
  let fixture: ComponentFixture<PlainNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlainNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlainNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashModUserComponent } from './admin-dash-mod-user.component';

describe('AdminDashModUserComponent', () => {
  let component: AdminDashModUserComponent;
  let fixture: ComponentFixture<AdminDashModUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashModUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashModUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

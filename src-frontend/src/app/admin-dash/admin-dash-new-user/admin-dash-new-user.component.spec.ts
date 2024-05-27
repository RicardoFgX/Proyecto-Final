import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashNewUserComponent } from './admin-dash-new-user.component';

describe('AdminDashNewUserComponent', () => {
  let component: AdminDashNewUserComponent;
  let fixture: ComponentFixture<AdminDashNewUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashNewUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

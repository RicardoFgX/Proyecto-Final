import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashListUsersComponent } from './admin-dash-list-users.component';

describe('AdminDashListUsersComponent', () => {
  let component: AdminDashListUsersComponent;
  let fixture: ComponentFixture<AdminDashListUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashListUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashListUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

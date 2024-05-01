import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashListProyectsComponent } from './admin-dash-list-proyects.component';

describe('AdminDashListProyectsComponent', () => {
  let component: AdminDashListProyectsComponent;
  let fixture: ComponentFixture<AdminDashListProyectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashListProyectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashListProyectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

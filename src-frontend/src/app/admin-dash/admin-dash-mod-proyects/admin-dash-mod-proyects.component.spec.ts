import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashModProyectsComponent } from './admin-dash-mod-proyects.component';

describe('AdminDashModProyectsComponent', () => {
  let component: AdminDashModProyectsComponent;
  let fixture: ComponentFixture<AdminDashModProyectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashModProyectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashModProyectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashNewProyectComponent } from './admin-dash-new-proyect.component';

describe('AdminDashNewProyectComponent', () => {
  let component: AdminDashNewProyectComponent;
  let fixture: ComponentFixture<AdminDashNewProyectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashNewProyectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashNewProyectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

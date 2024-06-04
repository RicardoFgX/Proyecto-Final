import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashModTareaComponent } from './admin-dash-mod-tarea.component';

describe('AdminDashModTareaComponent', () => {
  let component: AdminDashModTareaComponent;
  let fixture: ComponentFixture<AdminDashModTareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashModTareaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashModTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

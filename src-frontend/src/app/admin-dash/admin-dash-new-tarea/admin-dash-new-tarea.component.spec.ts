import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashNewTareaComponent } from './admin-dash-new-tarea.component';

describe('AdminDashNewTareaComponent', () => {
  let component: AdminDashNewTareaComponent;
  let fixture: ComponentFixture<AdminDashNewTareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashNewTareaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashNewTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

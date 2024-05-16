import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashModNotesComponent } from './admin-dash-mod-notes.component';

describe('AdminDashModNotesComponent', () => {
  let component: AdminDashModNotesComponent;
  let fixture: ComponentFixture<AdminDashModNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashModNotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashModNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

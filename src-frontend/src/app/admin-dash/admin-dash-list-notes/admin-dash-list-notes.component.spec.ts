import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashListNotesComponent } from './admin-dash-list-notes.component';

describe('AdminDashListNotesComponent', () => {
  let component: AdminDashListNotesComponent;
  let fixture: ComponentFixture<AdminDashListNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashListNotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashListNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

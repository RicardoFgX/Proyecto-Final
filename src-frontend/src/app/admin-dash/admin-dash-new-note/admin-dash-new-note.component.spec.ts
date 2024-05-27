import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashNewNoteComponent } from './admin-dash-new-note.component';

describe('AdminDashNewNoteComponent', () => {
  let component: AdminDashNewNoteComponent;
  let fixture: ComponentFixture<AdminDashNewNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashNewNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashNewNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

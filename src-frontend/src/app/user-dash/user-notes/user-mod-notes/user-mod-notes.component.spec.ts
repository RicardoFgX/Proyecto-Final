import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModNotesComponent } from './user-mod-notes.component';

describe('UserModNotesComponent', () => {
  let component: UserModNotesComponent;
  let fixture: ComponentFixture<UserModNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserModNotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserModNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

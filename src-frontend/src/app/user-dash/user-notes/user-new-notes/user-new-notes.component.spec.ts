import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNewNotesComponent } from './user-new-notes.component';

describe('UserNewNotesComponent', () => {
  let component: UserNewNotesComponent;
  let fixture: ComponentFixture<UserNewNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNewNotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserNewNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

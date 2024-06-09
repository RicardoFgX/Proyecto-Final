import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProyectsComponent } from './user-proyects.component';

describe('UserProyectsComponent', () => {
  let component: UserProyectsComponent;
  let fixture: ComponentFixture<UserProyectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProyectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserProyectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

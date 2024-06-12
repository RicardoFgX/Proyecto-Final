import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNewProyectsComponent } from './user-new-proyects.component';

describe('UserNewProyectsComponent', () => {
  let component: UserNewProyectsComponent;
  let fixture: ComponentFixture<UserNewProyectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNewProyectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserNewProyectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

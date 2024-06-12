import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModProyectsComponent } from './user-mod-proyects.component';

describe('UserModProyectsComponent', () => {
  let component: UserModProyectsComponent;
  let fixture: ComponentFixture<UserModProyectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserModProyectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserModProyectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

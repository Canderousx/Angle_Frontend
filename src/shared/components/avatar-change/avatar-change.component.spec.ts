import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarChangeComponent } from './avatar-change.component';

describe('AvatarChangeComponent', () => {
  let component: AvatarChangeComponent;
  let fixture: ComponentFixture<AvatarChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarChangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvatarChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

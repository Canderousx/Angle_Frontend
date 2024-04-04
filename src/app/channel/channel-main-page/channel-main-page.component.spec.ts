import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelMainPageComponent } from './channel-main-page.component';

describe('ChannelMainPageComponent', () => {
  let component: ChannelMainPageComponent;
  let fixture: ComponentFixture<ChannelMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelMainPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

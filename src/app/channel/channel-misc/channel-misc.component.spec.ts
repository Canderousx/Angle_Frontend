import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelMiscComponent } from './channel-misc.component';

describe('ChannelMiscComponent', () => {
  let component: ChannelMiscComponent;
  let fixture: ComponentFixture<ChannelMiscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelMiscComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelMiscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

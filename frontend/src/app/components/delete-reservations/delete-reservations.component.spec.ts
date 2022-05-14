import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteReservationsComponent } from './delete-reservations.component';

describe('DeleteReservationsComponent', () => {
  let component: DeleteReservationsComponent;
  let fixture: ComponentFixture<DeleteReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteReservationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
      providers: [ToastrService],
    });
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should show message - info', () => {
    // Third argument defaults to info
    spyOn(service['toastr'], 'info');
    service.showMessage({ title: 'Test Title', message: 'Test Message' });
    expect(service['toastr'].info).toHaveBeenCalledWith(
      'Test Message',
      'Test Title'
    );
  });
  it('should show message - success', () => {
    spyOn(service['toastr'], 'success');
    service.showMessage({
      title: 'Test Title',
      message: 'Test Message',
      messageType: 'success',
    });
    expect(service['toastr'].success).toHaveBeenCalledWith(
      'Test Message',
      'Test Title'
    );
  });
  it('should show message - warning', () => {
    spyOn(service['toastr'], 'warning');
    service.showMessage({
      title: 'Test Title',
      message: 'Test Message',
      messageType: 'warning',
    });
    expect(service['toastr'].warning).toHaveBeenCalledWith(
      'Test Message',
      'Test Title'
    );
  });
  it('should show message - error', () => {
    spyOn(service['toastr'], 'error');
    service.showMessage({
      title: 'Test Title',
      message: 'Test Message',
      messageType: 'error',
    });
    expect(service['toastr'].error).toHaveBeenCalledWith(
      'Test Message',
      'Test Title'
    );
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Toast from '../common/Toast';

describe('Toast Component', () => {
  jest.useFakeTimers();

  it('should not render when message is empty', () => {
    const { container } = render(
      <Toast message="" type="success" onClose={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render success toast with message', () => {
    render(
      <Toast message="Success!" type="success" onClose={jest.fn()} />
    );

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Success!').closest('.toast')).toHaveClass('toast-success');
  });

  it('should render error toast with message', () => {
    render(
      <Toast message="Error occurred" type="error" onClose={jest.fn()} />
    );

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    expect(screen.getByText('Error occurred').closest('.toast')).toHaveClass('toast-error');
  });

  it('should call onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(
      <Toast message="Test message" type="success" onClose={onClose} />
    );

    const closeButton = screen.getByRole('button', { name: /close notification/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should auto-close after duration', () => {
    const onClose = jest.fn();
    render(
      <Toast message="Test message" type="success" onClose={onClose} duration={3000} />
    );

    expect(onClose).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should use default duration if not specified', () => {
    const onClose = jest.fn();
    render(
      <Toast message="Test message" type="success" onClose={onClose} />
    );

    jest.advanceTimersByTime(3000);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should cleanup timer on unmount', () => {
    const onClose = jest.fn();
    const { unmount } = render(
      <Toast message="Test message" type="success" onClose={onClose} duration={3000} />
    );

    unmount();
    jest.advanceTimersByTime(3000);

    expect(onClose).not.toHaveBeenCalled();
  });

  jest.useRealTimers();
});

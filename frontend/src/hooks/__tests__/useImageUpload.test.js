import { renderHook, act } from '@testing-library/react-hooks';
import { useImageUpload } from '../useImageUpload';
import { VALIDATION, MESSAGES } from '../../constants';

describe('useImageUpload', () => {
  beforeEach(() => {
    global.FileReader = class {
      readAsDataURL() {
        this.onloadend();
      }

      result = 'data:image/png;base64,test';
    };
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useImageUpload());

    expect(result.current.imagePreview).toBe('');
    expect(result.current.imageFile).toBeNull();
    expect(result.current.imageError).toBe('');
  });

  it('should initialize with provided image', () => {
    const { result } = renderHook(() => useImageUpload('http://localhost:3002/uploads/test.jpg'));

    expect(result.current.imagePreview).toBe('http://localhost:3002/uploads/test.jpg');
  });

  it('should handle valid image file', () => {
    const { result } = renderHook(() => useImageUpload());

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

    const mockEvent = {
      target: {
        files: [file],
        value: '',
      },
    };

    act(() => {
      result.current.handleImageChange(mockEvent);
    });

    expect(result.current.imageFile).toBe(file);
    expect(result.current.imageError).toBe('');
    expect(result.current.imagePreview).toBe('data:image/png;base64,test');
  });

  it('should reject invalid file type', () => {
    const { result } = renderHook(() => useImageUpload());

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const mockEvent = {
      target: {
        files: [file],
        value: 'test.pdf',
      },
    };

    act(() => {
      result.current.handleImageChange(mockEvent);
    });

    expect(result.current.imageError).toBe(MESSAGES.ERROR.IMAGE_INVALID_TYPE);
    expect(result.current.imageFile).toBeNull();
  });

  it('should reject file exceeding size limit', () => {
    const { result } = renderHook(() => useImageUpload());

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: VALIDATION.IMAGE_MAX_SIZE + 1 });

    const mockEvent = {
      target: {
        files: [file],
        value: 'test.jpg',
      },
    };

    act(() => {
      result.current.handleImageChange(mockEvent);
    });

    expect(result.current.imageError).toBe(MESSAGES.ERROR.IMAGE_TOO_LARGE);
    expect(result.current.imageFile).toBeNull();
  });

  it('should clear image', () => {
    const { result } = renderHook(() => useImageUpload('http://localhost:3002/uploads/test.jpg'));

    act(() => {
      result.current.clearImage();
    });

    expect(result.current.imagePreview).toBe('');
    expect(result.current.imageFile).toBeNull();
    expect(result.current.imageError).toBe('');
  });

  it('should handle no file selected', () => {
    const { result } = renderHook(() => useImageUpload());

    const mockEvent = {
      target: {
        files: [],
      },
    };

    act(() => {
      result.current.handleImageChange(mockEvent);
    });

    expect(result.current.imageFile).toBeNull();
  });
});

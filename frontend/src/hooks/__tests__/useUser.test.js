import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import { useUser } from '../useUser';

jest.mock('axios');

describe('useUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUser());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch user successfully', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
    };
    axios.get.mockResolvedValue({ data: mockUser });

    const { result, waitForNextUpdate } = renderHook(() => useUser());

    act(() => {
      result.current.fetchUser(1);
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    const errorMessage = 'User not found';
    axios.get.mockRejectedValue({
      response: { data: { error: errorMessage } },
    });

    const { result, waitForNextUpdate } = renderHook(() => useUser());

    act(() => {
      result.current.fetchUser(999);
    });

    await waitForNextUpdate();

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should create user successfully', async () => {
    const newUser = {
      id: 1,
      email: 'new@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
    };
    axios.post.mockResolvedValue({ data: newUser });

    const { result, waitForNextUpdate } = renderHook(() => useUser());

    const formData = new FormData();
    formData.append('email', 'new@example.com');

    let createdUser;
    act(() => {
      result.current.createUser(formData).then((user) => {
        createdUser = user;
      });
    });

    await waitForNextUpdate();

    expect(createdUser).toEqual(newUser);
    expect(result.current.loading).toBe(false);
  });

  it('should update user successfully', async () => {
    const updatedUser = {
      id: 1,
      email: 'updated@example.com',
      first_name: 'Updated',
      last_name: 'Name',
    };
    axios.put.mockResolvedValue({ data: updatedUser });

    const { result, waitForNextUpdate } = renderHook(() => useUser());

    const formData = new FormData();
    formData.append('first_name', 'Updated');

    let updated;
    act(() => {
      result.current.updateUser(1, formData).then((user) => {
        updated = user;
      });
    });

    await waitForNextUpdate();

    expect(updated).toEqual(updatedUser);
    expect(result.current.loading).toBe(false);
  });

  it('should delete user successfully', async () => {
    axios.delete.mockResolvedValue({ data: { message: 'User deleted' } });

    const { result, waitForNextUpdate } = renderHook(() => useUser());

    act(() => {
      result.current.deleteUser(1);
    });

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle delete error', async () => {
    const errorMessage = 'User not found';
    axios.delete.mockRejectedValue({
      response: { data: { error: errorMessage } },
    });

    const { result, waitForNextUpdate } = renderHook(() => useUser());

    act(() => {
      result.current.deleteUser(999);
    });

    await waitForNextUpdate();

    expect(result.current.error).toBe(errorMessage);
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useUser());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});

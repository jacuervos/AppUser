import AsyncStorage from '@react-native-async-storage/async-storage';
import { orderApiService } from '../src/services/orderApiService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

describe('orderApiService History (Sprint 4 - AppUser)', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).fetch = mockFetch;
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('user-jwt-token');
  });

  it('HU-26: retrieves the list of orders created by the user', async () => {
    const userOrdersHistory = [
      {
        id: 20,
        latitude: 4.60971,
        longitude: -74.08175,
        date: '2026-10-25',
        state: { id: 5, name: 'Orden finalizada', color: 'green' },
        type_waste: [
          { id: 1, type_waste_id: 1, name: 'Plástico', weight: 3.5, points: 35 },
        ],
      },
      {
        id: 18,
        latitude: 4.60971,
        longitude: -74.08175,
        date: '2026-10-15',
        state: { id: 1, name: 'Creación de orden', color: 'blue' },
        type_waste: [
          { id: 2, type_waste_id: 2, name: 'Cartón', weight: 2.0, points: 20 },
        ],
      },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: userOrdersHistory,
      }),
    });

    const result = await orderApiService.getMyOrders();

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(20);
    expect(result[0].state.name).toBe('Orden finalizada');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/orders/my-orders'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer user-jwt-token',
          Accept: 'application/json',
        }),
      })
    );
  });

  it('HU-26: throws an error when fetching user order history fails', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await expect(orderApiService.getMyOrders()).rejects.toThrow('Error al obtener las órdenes');
  });

  it('HU-26: exercises order creation, active orders, and rescheduling in orderApiService', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: 20, date: '2026-10-25' } }),
    });
    const created = await orderApiService.createOrderWithWastes(
      { latitude: 4.6, longitude: -74.0, date: '2026-10-25' },
      [{ type_waste_id: 1, weight: 2, points: 20 }]
    );
    expect(created.id).toBe(20);

    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    await expect(
      orderApiService.createOrderWithWastes(
        { latitude: 4.6, longitude: -74.0, date: '2026-10-25' },
        []
      )
    ).rejects.toThrow('Error al crear la orden');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [{ id: 20 }] }),
    });
    expect(await orderApiService.getMyOrderActive()).toHaveLength(1);

    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    await expect(orderApiService.getMyOrderActive()).rejects.toThrow('Error al obtener las órdenes');

    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    await orderApiService.rescheduleOrder(20, '2026-10-30');

    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    await expect(orderApiService.rescheduleOrder(20, '2026-10-30')).rejects.toThrow(
      'Error al reprogramar la orden'
    );
  });
});

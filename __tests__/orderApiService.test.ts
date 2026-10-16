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

describe('orderApiService (Sprint 3 - AppUser)', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).fetch = mockFetch;
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('user-jwt-token');
  });

  it('HU-18: creates a pickup order with wastes on the selected date', async () => {
    const createdOrder = {
      id: 15,
      user_id: 3,
      latitude: 4.60971,
      longitude: -74.08175,
      date: '2026-10-28',
      state_id: 1,
      created_at: '2026-10-16T12:00:00Z',
      updated_at: '2026-10-16T12:00:00Z',
      order_type_wastes: [
        { id: 1, order_id: 15, type_waste_id: 1, weight: '3.5', points: 35 },
      ],
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Orden creada correctamente',
        data: createdOrder,
      }),
    });

    const result = await orderApiService.createOrderWithWastes(
      {
        latitude: 4.60971,
        longitude: -74.08175,
        date: '2026-10-28',
      },
      [
        {
          type_waste_id: 1,
          weight: 3.5,
          points: 35,
        },
      ]
    );

    expect(result.id).toBe(15);
    expect(result.date).toBe('2026-10-28');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/orders/with-wastes'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer user-jwt-token',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          latitude: 4.60971,
          longitude: -74.08175,
          date: '2026-10-28',
          items: [{ type_waste_id: 1, weight: 3.5, points: 35 }],
        }),
      })
    );
  });

  it('HU-21: retrieves active orders with collector location when collector is on the way', async () => {
    const activeOrders = [
      {
        id: 15,
        status: 'Inicio de servicio',
        collector: {
          id: 8,
          name: 'Carlos Recolector',
          location: {
            latitude: 4.615,
            longitude: -74.082,
            updated_at: '2026-10-16T12:15:00Z',
          },
        },
        pickup_location: {
          latitude: 4.60971,
          longitude: -74.08175,
        },
      },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: activeOrders,
      }),
    });

    const result = await orderApiService.getMyOrderActive();

    expect(result).toHaveLength(1);
    expect((result[0] as any).collector.name).toBe('Carlos Recolector');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/orders/active'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer user-jwt-token',
        }),
      })
    );
  });

  it('HU-23: reschedules an order to a new date', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 15,
        date: '2026-11-02',
      }),
    });

    await orderApiService.rescheduleOrder(15, '2026-11-02');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/orders/update-date-state/15'),
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          Authorization: 'Bearer user-jwt-token',
        }),
        body: JSON.stringify({ date: '2026-11-02' }),
      })
    );
  });
});


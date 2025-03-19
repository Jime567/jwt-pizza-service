// const request = require('supertest');
// const app = require('../service');
// const { DB } = require('../database/database');

// jest.mock('../database/database');

// const user = { name: 'pizza diner', email: 'test@test.test', password: 'a', id: 1, roles: [{ role: 'admin' }] };
// let userAuthToken;

// // beforeAll(async () => {
// //     DB.addUser.mockResolvedValue(user);
// //     DB.loginUser.mockResolvedValue({ token: 'fake-jwt-token' });
// //     DB.isLoggedIn.mockResolvedValue(true);

// //     const registerRes = await request(app).post('/api/auth').send(user);
// //     userAuthToken = registerRes.body.token;
// // });

// // describe('Order API Tests', () => {
// //     beforeEach(() => {
// //         jest.clearAllMocks();
// //     });

// //     test('should get the pizza menu', async () => {
// //         const menu = [
// //             { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'the gross one nobody wants' },
// //         ];
// //         DB.getMenu.mockResolvedValue(menu);

// //         const res = await request(app).get('/api/order/menu');
// //         expect(res.status).toBe(200);
// //         expect(Array.isArray(res.body)).toBe(true);
// //         expect(res.body[0].title).toBe('Veggie');
// //     });

// //     test('should add an item to the menu', async () => {
// //         const newItem = { title: 'Lil Pizzer', description: 'just sauce', image: 'pizza9.png', price: 0.0001 };
// //         const updatedMenu = [
// //             { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'pizza so good, it will eat you' },
// //             { id: 2, title: 'Student', description: 'No topping, no sauce, just carbs', image: 'pizza9.png', price: 0.0001 },
// //         ];
// //         DB.addMenuItem.mockResolvedValue(newItem);
// //         DB.getMenu.mockResolvedValue(updatedMenu);

// //         const res = await request(app)
// //             .put('/api/order/menu')
// //             .set('Authorization', `Bearer ${userAuthToken}`)
// //             .send(newItem);

// //         expect(res.status).toBe(200);
// //         expect(Array.isArray(res.body)).toBe(true);
// //         expect(res.body[1].title).toBe('Student');
// //     });

// //     test('should get the orders for the authenticated user', async () => {
// //         const orders = {
// //             dinerId: 4,
// //             orders: [
// //                 { id: 1, franchiseId: 1, storeId: 1, date: '2024-06-05T05:14:40.000Z', items: [{ id: 1, menuId: 1, description: 'Lame', price: 0.05 }] },
// //             ],
// //             page: 1,
// //         };
// //         DB.getOrders.mockResolvedValue(orders);

// //         const res = await request(app)
// //             .get('/api/order')
// //             .set('Authorization', `Bearer ${userAuthToken}`);

// //         expect(res.status).toBe(200);
// //         expect(res.body.orders).toBeInstanceOf(Array);
// //         expect(res.body.orders[0].items[0].description).toBe('Lame');
// //     });
// // });
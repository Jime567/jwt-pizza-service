// const request = require('supertest');
// const app = require('../service');
// const { DB } = require('../database/database');

// jest.mock('../database/database');

// const user = { name: 'pizza diner', email: 'a@jwt.com', password: 'admin', id: 1, roles: [{ role: 'admin' }] };
// let userAuthToken;
// let testFranchiseId = 1;
// let testStoreId = 1;

// // beforeAll(async () => {
// //   DB.addUser.mockResolvedValue(user);
// //   DB.loginUser.mockResolvedValue({ token: 'fake-jwt-token' });
// //   DB.isLoggedIn.mockResolvedValue(true);

// //   const registerRes = await request(app).post('/api/auth').send(user);
// //   userAuthToken = registerRes.body.token;
// // });

// // describe('Franchise API Tests', () => {
// //   beforeEach(() => {
// //     jest.clearAllMocks();
// //   });

// //   test('should list all franchises', async () => {
// //     DB.getFranchises.mockResolvedValue([
// //       { id: 1, name: 'pizzaPocket', admins: [user], stores: [{ id: 1, name: 'SLC', totalRevenue: 0 }] },
// //     ]);

// //     const res = await request(app).get('/api/franchise').set('Authorization', `Bearer ${userAuthToken}`);
// //     expect(res.status).toBe(200);
// //     expect(Array.isArray(res.body)).toBe(true);
// //     expect(res.body[0].name).toBe('pizzaPocket');
// //   });

// //   test('should list a user’s franchises', async () => {
// //     DB.getUserFranchises.mockResolvedValue([
// //       { id: 2, name: 'pizzaExpress', admins: [user], stores: [{ id: 2, name: 'Downtown', totalRevenue: 1000 }] },
// //     ]);

// //     const res = await request(app)
// //       .get(`/api/franchise/${user.id}`)
// //       .set('Authorization', `Bearer ${userAuthToken}`);
// //     expect(res.status).toBe(200);
// //     expect(Array.isArray(res.body)).toBe(true);
// //     expect(res.body[0].name).toBe('pizzaExpress');
// //   });

// //   test('should create a new franchise', async () => {
// //     const newFranchise = { name: 'pizzaKing', admins: [{ email: 'a@jwt.com' }] };
// //     DB.createFranchise.mockResolvedValue({ id: 3, ...newFranchise });

// //     const res = await request(app)
// //       .post('/api/franchise')
// //       .set('Authorization', `Bearer ${userAuthToken}`)
// //       .send(newFranchise);

// //     expect(res.status).toBe(200);
// //     expect(res.body.name).toBe('pizzaKing');
// //   });

// //   test('should delete a franchise', async () => {
// //     DB.deleteFranchise.mockResolvedValue();

// //     const res = await request(app)
// //       .delete(`/api/franchise/${testFranchiseId}`)
// //       .set('Authorization', `Bearer ${userAuthToken}`);

// //     expect(res.status).toBe(200);
// //     expect(res.body.message).toBe('franchise deleted');
// //   });

// //   test('should create a new franchise store', async () => {
// //     const newStore = { name: 'Uptown' };
// //     DB.getFranchise.mockResolvedValue({ id: testFranchiseId, admins: [user] });
// //     DB.createStore.mockResolvedValue({ id: testStoreId, ...newStore });

// //     const res = await request(app)
// //       .post(`/api/franchise/${testFranchiseId}/store`)
// //       .set('Authorization', `Bearer ${userAuthToken}`)
// //       .send(newStore);

// //     expect(res.status).toBe(200);
// //     expect(res.body.name).toBe('Uptown');
// //   });

// //   test('should delete a store', async () => {
// //     DB.getFranchise.mockResolvedValue({ id: testFranchiseId, admins: [user] });
// //     DB.deleteStore.mockResolvedValue();

// //     const res = await request(app)
// //       .delete(`/api/franchise/${testFranchiseId}/store/${testStoreId}`)
// //       .set('Authorization', `Bearer ${userAuthToken}`);

// //     expect(res.status).toBe(200);
// //     expect(res.body.message).toBe('store deleted');
// //   });

// // });

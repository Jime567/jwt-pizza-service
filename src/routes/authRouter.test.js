const request = require('supertest');
const app = require('../service');
const { DB } = require('../database/database');


jest.mock('../database/database'); 

const user = { name: 'pizza diner', email: 'a@jwt.com', password: 'admin', id: 1 };
let userAuthToken;

// beforeAll(async () => {
//   user.email = `a@jwt.com`;
//   DB.addUser.mockResolvedValue({ ...user, roles: [{ role: 'diner' }] });
//   DB.loginUser.mockResolvedValue();
//   DB.isLoggedIn.mockResolvedValue(true);

//   const registerRes = await request(app).post('/api/auth').send(user);
//   userAuthToken = registerRes.body.token;
// });

// test('register user', async () => {
//   const newUser = { name: 'new user', email: `a@jwt.com`, password: 'admin' };
//   DB.addUser.mockResolvedValue({ ...newUser, id: 2, roles: [{ role: 'diner' }] });

//   const res = await request(app).post('/api/auth').send(newUser);
//   expect(res.status).toBe(200);
//   expect(res.body.user).toMatchObject({ name: newUser.name, email: newUser.email });
//   expect(res.body.token).toBeDefined();
// });

// test('login an existing user', async () => {
//   DB.getUser.mockResolvedValue({ ...user, roles: [{ role: 'diner' }] });
//   const res = await request(app).put('/api/auth').send({ email: user.email, password: user.password });
//   expect(res.status).toBe(200);
//   expect(res.body.token).toBeDefined();
//   expect(res.body.user).toMatchObject({ name: user.name, email: user.email });
// });

// test('update user details', async () => {
//   const updatedUser = { ...user, email: 'a@jwt.com' };
//   DB.updateUser.mockResolvedValue(updatedUser);

//   const res = await request(app)
//     .put(`/api/auth/${user.id}`)
//     .set('Authorization', `Bearer ${userAuthToken}`)
//     .send({ email: updatedUser.email });
//   expect(res.status).toBe(200);
//   expect(res.body.email).toBe(updatedUser.email);
// });

// test('update user without token should fail', async () => {
//   const res = await request(app).put(`/api/auth/${user.id}`).send({ email: 'a@jwt.com' });
//   expect(res.status).toBe(401);
//   expect(res.body).toMatchObject({ message: 'unauthorized' });
// });

// test('logout a user', async () => {
//   DB.logoutUser.mockResolvedValue();
//   const res = await request(app).delete('/api/auth').set('Authorization', `Bearer ${userAuthToken}`);
//   expect(res.status).toBe(200);
//   expect(res.body).toMatchObject({ message: 'logout successful' });
// });

// test('logout without token should fail', async () => {
//   const res = await request(app).delete('/api/auth');
//   expect(res.status).toBe(401);
//   expect(res.body).toMatchObject({ message: 'unauthorized' });
// });

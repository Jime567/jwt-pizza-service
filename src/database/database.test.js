const { DB } = require('./database');
const { Role } = require('../model/model');

describe('Database Tests', () => {
  it('should add a user', async () => {
    const user = { name: 'test user', email: 'test@example.com', password: 'password123', roles: [{ role: Role.Diner }] };
    const result = await DB.addUser(user);
    expect(result).toMatchObject({ name: user.name, email: user.email });
  });

  it('should get a user', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const result = await DB.getUser(email, password);
    expect(result.email).toBe(email);
  });

  it('should update a user', async () => {
    const userId = 1;
    const updatedEmail = 'new.email@example.com';
    const updatedPassword = 'newPassword123';
    const result = await DB.updateUser(userId, updatedEmail, updatedPassword);
    expect(result.email).toBe(updatedEmail);
  });

  it('should login a user', async () => {
    const userId = 1;
    const token = 'testToken';
    await DB.loginUser(userId, token);
    const isLoggedIn = await DB.isLoggedIn(token);
    expect(isLoggedIn).toBe(true);
  });

  it('should logout a user', async () => {
    const token = 'testToken';
    await DB.logoutUser(token);
    const isLoggedIn = await DB.isLoggedIn(token);
    expect(isLoggedIn).toBe(false);
  });

  it('should get menu', async () => {
    const menu = await DB.getMenu();
    expect(menu).toBeInstanceOf(Array);
  });

  it('should add a menu item', async () => {
    const item = { title: 'Pizza', description: 'Delicious pizza', image: 'image.jpg', price: 9.99 };
    const result = await DB.addMenuItem(item);
    expect(result).toMatchObject({ title: item.title, description: item.description, price: item.price });
  });

  it('should get orders', async () => {
    const user = { id: 1 };
    const orders = await DB.getOrders(user);
    expect(orders.orders).toBeInstanceOf(Array);
  });

  it('should add a diner order', async () => {
    const user = { id: 1 };
    const order = { franchiseId: 1, storeId: 1, items: [{ menuId: 1, description: 'Pizza', price: 9.99 }] };
    const result = await DB.addDinerOrder(user, order);
    expect(result).toMatchObject({ franchiseId: order.franchiseId, storeId: order.storeId });
  });

  it('should create a franchise', async () => {
    const franchise = { name: `Franchise_${Date.now()}`, admins: [{ email: 'tester@test.test' }] };
    const result = await DB.createFranchise(franchise);
    expect(result).toMatchObject({ name: franchise.name });
  });

  it('should delete a franchise', async () => {
    const franchiseId = 1;
    await DB.deleteFranchise(franchiseId);
    // Verify deletion by attempting to get the franchise
    const franchises = await DB.getFranchises();
    expect(franchises.find(f => f.id === franchiseId)).toBeUndefined();
  });

  it('should get franchises', async () => {
    const franchises = await DB.getFranchises();
    expect(franchises).toBeInstanceOf(Array);
  });

  it('should get user franchises', async () => {
    const userId = 1;
    const franchises = await DB.getUserFranchises(userId);
    expect(franchises).toBeInstanceOf(Array);
  });

it('should create a store', async () => {
    const franchise = { name: `Franchise_${Date.now()}`, admins: [{ email: 'tester@test.test' }] };
    const createdFranchise = await DB.createFranchise(franchise);
    const franchiseId = createdFranchise.id;
    const store = { name: 'Store' };
    const result = await DB.createStore(franchiseId, store);
    expect(result).toMatchObject({ name: store.name, franchiseId });
  });

  it('should delete a store', async () => {
    const franchiseData = { name: `Franchise_${Date.now()}`, admins: [{ email: 'tester@test.test' }] };
    const createdFranchise = await DB.createFranchise(franchiseData);
    const franchiseId = createdFranchise.id;
    const store = { name: 'Store' };
    const createdStore = await DB.createStore(franchiseId, store);
    const storeId = createdStore.id;

    await DB.deleteStore(franchiseId, storeId);

    // Verify deletion by attempting to get the store
    const franchises = await DB.getFranchises();
    const franchise = franchises.find(f => f.id === franchiseId);
    expect(franchise.stores.find(s => s.id === storeId)).toBeUndefined();
  });
});
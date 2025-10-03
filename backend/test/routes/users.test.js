const chai = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/users');
const UserService = require('../../services/UserService');
const { errorHandler } = require('../../middlewares/errorHandler');

const { expect } = chai;

describe('User Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', userRoutes);
    app.use(errorHandler);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('GET /api/users/:id', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      };
      sinon.stub(UserService, 'getUserById').resolves(mockUser);

      const res = await request(app).get('/api/users/1');

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(mockUser);
    });

    it('should return 404 when user not found', async () => {
      sinon.stub(UserService, 'getUserById').rejects({ isOperational: true, statusCode: 404, message: 'User not found' });

      const res = await request(app).get('/api/users/999');

      expect(res.status).to.equal(404);
      expect(res.body.error).to.equal('User not found');
    });
  });

  describe('POST /api/users', () => {
    it('should create user successfully', async () => {
      const newUser = {
        email: 'new@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
      };
      const createdUser = { id: 1, ...newUser };

      sinon.stub(UserService, 'createUser').resolves(createdUser);

      const res = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(createdUser);
    });

    it('should return 409 on duplicate email', async () => {
      sinon.stub(UserService, 'createUser').rejects({
        isOperational: true,
        statusCode: 409,
        message: 'Email already exists',
      });

      const res = await request(app)
        .post('/api/users')
        .send({ email: 'existing@example.com', first_name: 'Test', last_name: 'User' });

      expect(res.status).to.equal(409);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user successfully', async () => {
      const updateData = { first_name: 'Updated', last_name: 'Name' };
      const updatedUser = { id: 1, ...updateData };

      sinon.stub(UserService, 'getUserProfilePicture').resolves(null);
      sinon.stub(UserService, 'updateUser').resolves(updatedUser);

      const res = await request(app)
        .put('/api/users/1')
        .send(updateData);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(updatedUser);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
      sinon.stub(UserService, 'deleteUser').resolves();

      const res = await request(app).delete('/api/users/1');

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('User deleted successfully');
    });

    it('should return 404 when deleting non-existent user', async () => {
      sinon.stub(UserService, 'deleteUser').rejects({
        isOperational: true,
        statusCode: 404,
        message: 'User not found',
      });

      const res = await request(app).delete('/api/users/999');

      expect(res.status).to.equal(404);
    });
  });
});

const chai = require('chai');
const sinon = require('sinon');
const UserService = require('../../services/UserService');
const FileService = require('../../services/FileService');
const db = require('../../sql/db');
const { NotFoundError, ConflictError } = require('../../utils/errors');

const { expect } = chai;

describe('UserService', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      };
      sinon.stub(db, 'query').resolves({ rows: [mockUser] });

      const result = await UserService.getUserById(1);

      expect(result).to.deep.equal(mockUser);
    });

    it('should throw NotFoundError when user not found', async () => {
      sinon.stub(db, 'query').resolves({ rows: [] });

      try {
        await UserService.getUserById(999);
        throw new Error('Should have thrown NotFoundError');
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal('User not found');
      }
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData = {
        email: 'new@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        profile_picture: '/uploads/test.jpg',
      };
      const createdUser = { id: 1, ...userData };

      sinon.stub(db, 'query').resolves({ rows: [createdUser] });

      const result = await UserService.createUser(userData);

      expect(result).to.deep.equal(createdUser);
    });

    it('should throw ConflictError on duplicate email', async () => {
      const userData = { email: 'existing@example.com', first_name: 'Test', last_name: 'User' };
      const dbError = new Error('duplicate key');
      dbError.code = '23505';

      sinon.stub(db, 'query').rejects(dbError);

      try {
        await UserService.createUser(userData);
        throw new Error('Should have thrown ConflictError');
      } catch (error) {
        expect(error).to.be.instanceOf(ConflictError);
      }
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updateData = {
        email: 'updated@example.com',
        first_name: 'Updated',
        last_name: 'Name',
      };
      const updatedUser = { id: 1, ...updateData };

      sinon.stub(db, 'query').resolves({ rows: [updatedUser] });

      const result = await UserService.updateUser(1, updateData);

      expect(result).to.deep.equal(updatedUser);
    });

    it('should throw NotFoundError when updating non-existent user', async () => {
      sinon.stub(db, 'query').resolves({ rows: [] });

      try {
        await UserService.updateUser(999, { first_name: 'Test' });
        throw new Error('Should have thrown NotFoundError');
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
      }
    });
  });

  describe('deleteUser', () => {
    it('should delete user and associated files', async () => {
      const mockUser = { id: 1, profile_picture: '/uploads/test.jpg' };
      sinon.stub(db, 'query').resolves({ rows: [mockUser] });
      sinon.stub(FileService, 'deleteFile').resolves(true);

      await UserService.deleteUser(1);

      expect(FileService.deleteFile.calledOnce).to.be.true;
    });

    it('should throw NotFoundError when deleting non-existent user', async () => {
      sinon.stub(db, 'query').resolves({ rows: [] });

      try {
        await UserService.deleteUser(999);
        throw new Error('Should have thrown NotFoundError');
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
      }
    });
  });
});

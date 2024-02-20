import request from 'supertest';
import { app } from '../app';
import { UserModel } from '../models/user';

jest.mock('../models/UserModel', () => ({
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  save: jest.fn(),
}));

describe('User Controllers', () => {
  describe('getUser', () => {
    it('should return a user if found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValueOnce({
        userId: 'user1',
        // other user details
      });
      const response = await request(app).get('/user/user1');
      expect(response.status).toBe(200);
      expect(response.body.userId).toBe('user1');
    });

    it('should return 404 if user not found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValueOnce(null);
      const response = await request(app).get('/user/nonexistentuser');
      expect(response.status).toBe(404);
    });
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const newUser = {
        userId: 'user2',
        // other user details
      };
      (UserModel.prototype.save as jest.Mock).mockResolvedValueOnce(newUser);
      const response = await request(app)
        .post('/user')
        .send(newUser); // Adjust according to your API's expected request body
      expect(response.status).toBe(201);
      expect(response.body.userId).toBe(newUser.userId);
    });
  });

  // Add tests for updatePerformanceStyles and updateRecentSpots similarly
});
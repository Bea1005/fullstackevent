const { 
  getEquipment, 
  createEquipment, 
  updateEquipment, 
  deleteEquipment 
} = require('../../src/controllers/equipmentController');
const Equipment = require('../../src/models/Equipment');
const httpMocks = require('node-mocks-http');

jest.mock('../../src/models/Equipment');

describe('Equipment Controller Unit Tests', () => {
  let req, res;
  let consoleErrorSpy;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('GET /admin/equipment (getEquipment)', () => {
    it('should return 200 OK and a list of equipment', async () => {
      const fakeEquipment = [
        { _id: '1', name: 'Basketball', category: 'Balls', totalStock: 50, available: 43 },
        { _id: '2', name: 'Volleyball Net', category: 'Net', totalStock: 5, available: 3 }
      ];
      
      // Mock the chain of methods properly
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(fakeEquipment)
      };
      
      Equipment.find.mockReturnValue(mockQuery);
      Equipment.countDocuments.mockResolvedValue(2);
      Equipment.aggregate.mockResolvedValue([{
        totalItems: 55,
        totalAvailable: 46,
        totalOnLoan: 9,
        lowStockCount: 1,
        outOfStockCount: 0
      }]);

      await getEquipment(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().success).toBe(true);
      expect(res._getJSONData().data).toHaveLength(2);
      expect(Equipment.find).toHaveBeenCalled();
    });

    it('should return 500 if database error occurs', async () => {
      // Mock the chain to throw an error
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockRejectedValue(new Error('Database connection failed'))
      };
      
      Equipment.find.mockReturnValue(mockQuery);

      await getEquipment(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData().message).toContain('Server error');
    });
  });

  describe('POST /admin/equipment (createEquipment)', () => {
    it('should return 201 Created and the new equipment', async () => {
      req.body = { name: 'Tennis Racket', category: 'Rackets', total: 20, condition: 'Good' };
      const fakeSavedEquipment = { 
        _id: '12345', 
        name: 'Tennis Racket', 
        category: 'Rackets', 
        totalStock: 20,
        available: 20,
        condition: 'Good'
      };
      
      Equipment.findOne.mockResolvedValue(null);
      Equipment.create.mockResolvedValue(fakeSavedEquipment);

      await createEquipment(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().success).toBe(true);
      expect(res._getJSONData().message).toBe('Equipment added successfully');
      expect(Equipment.create).toHaveBeenCalled();
    });

    it('should return 400 if name is missing', async () => {
      req.body = { category: 'Balls', total: 10 };

      await createEquipment(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe('Name and total stock are required');
    });

    it('should return 400 if equipment already exists', async () => {
      req.body = { name: 'Existing Equipment', category: 'Balls', total: 10 };
      Equipment.findOne.mockResolvedValue({ _id: 'existing', name: 'Existing Equipment' });

      await createEquipment(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe('Equipment already exists');
    });
  });

  describe('PUT /admin/equipment/:id (updateEquipment)', () => {
    it('should return 200 OK and updated equipment', async () => {
      req.params = { id: '12345' };
      req.body = { name: 'Updated Name', totalStock: 30 };
      
      const existingEquipment = {
        _id: '12345',
        name: 'Old Name',
        totalStock: 20,
        save: jest.fn().mockResolvedValue(true)
      };
      
      Equipment.findById.mockResolvedValue(existingEquipment);
      Equipment.findOne.mockResolvedValue(null);

      await updateEquipment(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().success).toBe(true);
    });

    it('should return 404 if equipment not found', async () => {
      req.params = { id: 'nonexistent' };
      Equipment.findById.mockResolvedValue(null);

      await updateEquipment(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData().message).toBe('Equipment not found');
    });
  });

  describe('DELETE /admin/equipment/:id (deleteEquipment)', () => {
    it('should return 200 OK and success message', async () => {
      req.params = { id: '12345' };
      const existingEquipment = { _id: '12345', onLoan: 0 };
      
      Equipment.findById.mockResolvedValue(existingEquipment);
      Equipment.findByIdAndDelete.mockResolvedValue(true);

      await deleteEquipment(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().message).toBe('Equipment deleted successfully');
    });

    it('should return 400 if equipment has items on loan', async () => {
      req.params = { id: '12345' };
      const existingEquipment = { _id: '12345', onLoan: 5 };
      
      Equipment.findById.mockResolvedValue(existingEquipment);

      await deleteEquipment(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toContain('Cannot delete equipment');
    });

    it('should return 404 if equipment not found', async () => {
      req.params = { id: 'nonexistent' };
      Equipment.findById.mockResolvedValue(null);

      await deleteEquipment(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData().message).toBe('Equipment not found');
    });
  });
});
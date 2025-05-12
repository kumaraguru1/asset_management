const { Employee } = require('../models');

class EmployeeController {
  async index(req, res) {
    try {
      const employees = await Employee.findAll();
      res.render('employees/index', { employees });
    } catch (err) {
      console.error('Error loading employees:', err);
      res.status(500).send('Server Error');
    }
  }

  new(req, res) {
    res.render('employees/form', {
      formTitle: 'Add New Employee',
      formAction: '/employees',
      employee: {},
    });
  }

  async create(req, res) {
    try {
      const { name, email, branch, isActive } = req.body;
      await Employee.create({
        name,
        email,
        branch,
        isActive: isActive !== undefined ? isActive : true
      });

      res.redirect('/employees');
    } catch (err) {
      console.error('Error creating employee:', err);
      res.status(500).send('Server Error');
    }
  }

  async edit(req, res) {
    try {
      const employee = await Employee.findByPk(req.params.id);
      res.render('employees/form', {
        formTitle: 'Edit Employee',
        formAction: `/employees/${employee.id}`,
        employee,
      });
    } catch (err) {
      console.error('Error loading employee for edit:', err);
      res.status(500).send('Server Error');
    }
  }

  async update(req, res) {
    try {
      const employee = await Employee.findByPk(req.params.id);
      await employee.update(req.body);
      res.redirect('/employees');
    } catch (err) {
      console.error('Error updating employee:', err);
      res.status(500).send('Server Error');
    }
  }

  async delete(req, res) {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (employee) {
        await employee.destroy(); // Soft delete if paranoid: true
      }
      res.redirect('/employees');
    } catch (err) {
      console.error('Error deleting employee:', err);
      res.status(500).send('Server Error');
    }
  }
}

module.exports = new EmployeeController();

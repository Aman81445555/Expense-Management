const router = require('express').Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const User = require('../models/User');
const Company = require('../models/Company');
const axios = require('axios');

// POST /api/expenses - Submit a new expense
router.post('/', auth, async (req, res) => {
  try {
    const { amount, currency, category, description, date } = req.body;
    const employee = await User.findById(req.user.id);
    if (!employee || !employee.manager) {
      return res.status(400).json({ msg: 'No manager assigned. Cannot submit expense.' });
    }
    const newExpense = new Expense({
      employee: req.user.id,
      amount, currency, category, description, date,
      approvers: [{ approverId: employee.manager, status: 'Pending' }]
    });
    const expense = await newExpense.save();
    res.status(201).json(expense);
  } catch (err) { res.status(500).send('Server Error'); }
});

// GET /api/expenses/pending - Get expenses pending for the logged-in manager
router.get('/pending', auth, async (req, res) => {
    // ... code from our previous steps ...
});

// PUT /api/expenses/:id/action - Approve or Reject an expense
router.put('/:id/:action', auth, async (req, res) => {
  try {
    const { action } = req.params;
    const { comment } = req.body;
    if (action !== 'approve' && action !== 'reject') {
      return res.status(400).json({ msg: 'Invalid action.' });
    }

    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found.' });

    const approverIndex = expense.approvers.findIndex(
      (appr) => appr.approverId.toString() === req.user.id && appr.status === 'Pending'
    );
    if (approverIndex === -1) {
      return res.status(403).json({ msg: 'You are not authorized to act on this expense.' });
    }

    expense.approvers[approverIndex].status = action === 'approve' ? 'Approved' : 'Rejected';
    expense.approvers[approverIndex].comment = comment;
    expense.status = action === 'approve' ? 'Approved' : 'Rejected'; // Simplified for single-approver

    await expense.save();
    res.json(expense);
  } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;
const express = require('express');
const Job = require('../models/Job');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// GET /api/jobs — get all jobs for logged-in user
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/jobs — create a new job
router.post('/', async (req, res) => {
  try {
    const { role, company, status, type, date, notes, link } = req.body;

    if (!role || !company)
      return res.status(400).json({ message: 'Role and company are required' });

    const job = await Job.create({
      user: req.user.id,
      role,
      company,
      status: status || 'Applied',
      type: type || 'On-site',
      date,
      notes,
      link,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/jobs/:id — update a job
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user.id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const { role, company, status, type, date, notes, link } = req.body;

    job.role = role ?? job.role;
    job.company = company ?? job.company;
    job.status = status ?? job.status;
    job.type = type ?? job.type;
    job.date = date ?? job.date;
    job.notes = notes ?? job.notes;
    job.link = link ?? job.link;

    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/jobs/:id — delete a job
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

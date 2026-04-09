import Job from '../models/JobModel.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import day from 'dayjs';
import { NotFoundError } from '../errors/customErrors.js';
import { DEMO_USER } from '../utils/constants.js';

export const getAllJobs = async (req, res) => {
  const { search, status, jobStatus, jobType, sort } = req.query;
  const statusFilter = status || jobStatus;

  // Demo mode - return empty list
  if (req.user.userId === DEMO_USER._id) {
    return res.status(StatusCodes.OK).json({ 
      totalJobs: 0, 
      numOfPages: 1, 
      currentPage: 1, 
      jobs: [],
      msg: 'Demo user - create your first job!' 
    });
  }

  try {
    const queryObject = {
      createdBy: req.user.userId,
    };

    if (search) {
      queryObject.position = { $regex: search, $options: 'i' };
    }

    if (statusFilter && statusFilter !== 'all') {
      queryObject.status = statusFilter;
    }
    if (jobType && jobType !== 'all') {
      queryObject.jobType = jobType;
    }

    const sortOptions = {
      latest: '-createdAt',
      newest: '-createdAt',
      oldest: 'createdAt',
      'a-z': 'position',
      'z-a': '-position',
    };

    const sortKey = sortOptions[sort] || sortOptions.latest;

    // setup pagination

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find(queryObject)
      .sort(sortKey)
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit);
    res
      .status(StatusCodes.OK)
      .json({ totalJobs, numOfPages, currentPage: page, jobs });
  } catch (error) {
    console.error('Get jobs error:', error);
    throw error;
  }
};

export const createJob = async (req, res) => {
  // Demo mode
  if (req.user.userId === '999999999999999999999999') {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Demo mode - real database required to create jobs' });
  }
  
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

export const getJob = async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    createdBy: req.user.userId,
  });

  if (!job) {
    throw new NotFoundError('Job not found');
  }

  res.status(StatusCodes.OK).json({ job });
};

export const updateJob = async (req, res) => {
  // Demo mode
  if (req.user.userId === '999999999999999999999999') {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Demo mode - real database required to update jobs' });
  }
  
  // Prevent users from modifying the createdBy field
  delete req.body.createdBy;
  
  const updatedJob = await Job.findOneAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.user.userId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedJob) {
    throw new NotFoundError('Job not found or not authorized');
  }

  res.status(StatusCodes.OK).json({ msg: 'job modified', job: updatedJob });
};

export const deleteJob = async (req, res) => {
  // Demo mode
  if (req.user.userId === '999999999999999999999999') {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Demo mode - real database required to delete jobs' });
  }
  
  const removedJob = await Job.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.userId,
  });

  if (!removedJob) {
    throw new NotFoundError('Job not found or not authorized');
  }

  res.status(StatusCodes.OK).json({ msg: 'job deleted', job: removedJob });
};

export const showStats = async (req, res) => {
  // Demo mode
  if (req.user.userId === DEMO_USER._id) {
    return res.status(StatusCodes.OK).json({ 
      defaultStats: { pending: 0, interview: 0, declined: 0 },
      monthlyApplications: []
    });
  }
  
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1)
        .year(year)
        .format('MMM YY');

      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

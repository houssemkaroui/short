
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
 
//regester user
exports.signup = catchAsync(async (req, res, next) => {
  if (!req.body) {
    return next(new AppError('Veuillez remplir votre formulaire!', 400));
  }
  const newUser = await User.create(req.body);
  const token = await signToken(newUser._id);
  newUser.password = undefined;
  res.status(200).json({
    status: 'success',
    token,
    data: {
      newUser
    }
  });

  SendSMS(newUser);
});

 

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Merci de saisir email et password correcte!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError("User Not found", 400));
  }
 

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('wrong Password', 401));
  }

  const token = await signToken(user._id);
  user.password = undefined;
  
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
 // createSendToken(user, 200, res)
});



exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //  else if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

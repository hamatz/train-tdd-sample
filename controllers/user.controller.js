const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../model/user.model");

exports.create = async (req, res, next) => {

  if(!req.body.password){
    next({message: "password info should be set"});
  }

  let hash;
  let user;
  try {
    hash = await bcrypt.hash(req.body.password, 10);
  } catch (err) {
    next(err);
  }

  try {
    user = await UserModel.create({
      email: req.body.email,
      password: hash,
    });

    res.status(201).json({ message: "User created!" });
  } catch (err2) {
    next(err2);
  }
};

exports.userLogin = async (req, res, next) => {
  let fetchedUser;
  let user;

  user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({message: "Not Found Error"});
  }
  fetchedUser = user;
  const result = await bcrypt.compare(req.body.password, fetchedUser.password);

  if (!result) {
    return res.status(404).json({
      message: "Not Found Error",
    });
  }
  const token = await jwt.sign(
    { email: fetchedUser.email, userId: fetchedUser._id },
    process.env.JWT_KEY,
    { expiresIn: "10h" }
  );
  res.status(200).json({
    token: token,
    expiresIn: 36000,
    userId: fetchedUser._id,
  });
};

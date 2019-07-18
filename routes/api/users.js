const express = require('express');
const route = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route   POST api/users/register
// @desc    Register user
// @access  public
router.post('/register', (req, res) => {
  User
    .findOne({email: req.body.email})
    .then(user => {
      if (user) {
        return res.status(400).json({email: 'Email already exists.'});
      }

      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      const newUser = newUser({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        })
      })
    })
    .catch(err => console.log(err));
});

// @route   POST api/users/login
// @desc    Login user
// @access  public
router.post('/login', (req, res) => {
  const {errors, isValid} = validateLoginInput(req.body);

  if (!isValid){
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({email})
    .then(user => {
      if (!user){
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      //Check password
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch){
            // Create a JWT payload
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            };

            // Sign token
            jwt.sign(
              payload, 
              keys.secretOrKey,
              {expiresIn: 3600},
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                })
              }
              );
          } else {
            errors.password = 'Password incorrect';
            return res.status(400).json(errors);
          }
        })

    })
    .catch(err => console.log(err));
})

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', {session: false}),
  (req,res) => {
    res.json({msg: 'Success'});
  }
)

// @route   POST api/users/following/:id
// @desc    Following a user
// @access  Private
router.post(
  '/following/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.follows.filter(follow => follow.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyfollowed: 'User already followed this post' });
          }

          // Add user id to follows array
          post.follows.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

// @route   POST api/users/unfollow/:id
// @desc    Unfollow a user
// @access  Private
router.post(
  '/unfollow/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.follows.filter(follow => follow.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notfollowd: 'You have not yet followed this post' });
          }

          // Get remove index
          const removeIndex = post.follows
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          post.follows.splice(removeIndex, 1);

          // Save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

// @route   GET api/users/followers
// @desc    Total number of followers
// @access  Public

// @route   GET api/users/posts
// @desc    Total number of posts by user
// @access  Public

module.exports = router;
//@ts-check
const utils = require("../../lib/utils");
const mongoose = require("mongoose");
const Activity = mongoose.model("Activity");

exports.load = (req, res, next, id) => {
  const tweet = req.tweet;
  utils.findByParam(tweet.comments, { id: id }, (err, comment) => {
    if (err) {
      return next(err);
    }
    req.comment = comment;
    next();
  });
};

// ### Create Comment
exports.create = (req, res) => {
  const tweet = req.tweet;
  const user = req.user;

  if (!req.body.body) {
    return res.redirect("/");
  }
  tweet.addComment(user, req.body, err => {
    if (err) {
      console.log(err);
      return res.render("pages/500");
    }
    const activity = new Activity({
      activityStream: "added a comment",
      sender: user,
      receiver: req.tweet.user,
    });
    console.log(activity)
    activity.save((err) => {
      if (err) {
        console.log(err);
        return res.render("pages/500");
      }
    });
    res.redirect("/");
  });
};

// ### Delete Comment
exports.destroy = (req, res) => {
  // delete a comment here.
  const comment = req.comment;
  comment.remove(err => {
    if (err) {
      res.send(400);
    }
    res.send(200);
  });
};

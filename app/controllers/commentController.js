'use strict';

//Requires mongoose and our schemas
var mongoose = require('mongoose');
var Post = mongoose.model('Posts');
var Comment = mongoose.model('Comments');

//Adds a comment to a post. Takes the id of the post and the comment text. Returns the modified post.
exports.add_a_comment = function(req, res) {

	if(!req.isValidUser){
		console.log('Request not completed due to lack of authentication');
		return res.status(401).send('User must be logged in to access this function');
	}

	var id = req.params.PostId;
	var comment = req.body.text;
	// If there is no comment provided, return
	if(!comment)
		return res.send('No comment provided');

	Post.findByIdAndUpdate(id, {$push: {"comments": new Comment({text:comment, author:req.user.name, authorID:req.user._id})}}, {"new": true, "upsert": true, "safe": true}, function (err, post) {
			if (err) 
				return res.status(500).send(err);
			console.log('Comment successfully inserted to post id:'+id);
			return res.json(post);	
	});
};

//Edits a comment. Takes a postid and commentid as well as the comment text. Returns a success message.
exports.edit_a_comment = function(req, res) {

	if(!req.isValidUser){
		console.log('Request not completed due to lack of authentication');
		return res.status(401).send('User must be logged in to access this function');
	}

	var postid = req.params.PostId;
	var commentid = req.params.CommentId;
	var comment = req.body.text;

	// If there is no comment provided, return
	if(!comment)
		return res.send('No new comment text provided');
	
	Post.findOneAndUpdate({_id: postid, 'comments._id': commentid, 'comments.authorID': req.user._id}, {$set: {'comments.$.text': comment}}, function(err, numAffected) {
		if (err) 
			return res.status(500).send(err);
		if (numAffected.n == 0)
			return res.status(404).send('No comment with post id:'+postid+' and comment id:'+commentid+' found, or user does not have permission');
		console.log('Post id:'+postid+' comment id:'+commentid+' successfully updated');
		return res.send('Post id:'+postid+' comment id:'+commentid+' successfully updated');
	});
};

//Removes a comment. Takes the postid and commentid. Returns a success message.
exports.remove_a_comment = function(req, res) {

	if(!req.isValidUser){
		console.log('Request not completed due to lack of authentication');
		return res.status(401).send('User must be logged in to access this function');
	}

	var postid = req.params.PostId;
	var commentid = req.params.CommentId;

	Post.findOneAndUpdate({_id: postid, 'comments.authorID': req.user._id}, {$pull: {comments: {_id: commentid}}}, {"new": true}, function(err, numRemoved) {
		if (err) 
			return res.status(500).send(err);
		if (!numRemoved || numRemoved.n == 0)
			return res.status(404).send('No comment with post id:'+postid+' and comment id:'+commentid+' found, or user does not have permission');
		console.log('Post id:'+postid+' comment id:'+commentid+' successfully removed');
		return res.send('Post id:'+postid+' comment id:'+commentid+' successfully removed');
	});
};





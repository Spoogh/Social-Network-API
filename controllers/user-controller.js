const { run } = require('node:test');
const { User, Thought} = require('../models');

const userController = {
    //functions go here as a method
    getAllUsers(req, res){
        User.find({})
        .populate({
            path: 'thoughts',
            select:'-__v'
        })
        .select('-__v')
        .sort({_id: -1})
        .then(dbUserData => res.json(dbUserData))
        .catch(err=>{
            console.log(err);
            res.status(500).json(err)
        });
    },

    // get user by id
    getUserById({params}, res){
        User.findOne({ _id: params.id})
        .populate({
            
                path: 'thoughts',
                select: '-__v'
        })
        .select('-__v')
        .then(dbUserData =>{

            if (!dbUserData){
                res.status(404).json({ message: 'No User found with this id'});
                return
            }
            res.json(dbUserData)
        })
        .catch(err=>{
            console.log(err);
            res.status(400).json(err)
        });
    },
    createUser({ body}, res){
        User.create(body)
        .then(dbUserData=> res.json(dbUserData))
        .catch(err => res.status(400).json(err))
    },

    //update user by id
    updateUser({ params, body}, res){
        User.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .then (dbUserData => {
            if(!dbUserData){
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err=>
            res.status(400).json(err)
        );
    },
    deleteUser({params}, res){
        User.findOneAndDelete({ _id: params.id})
        .then(dbUserData =>{
            if (!dbUserData){
                res.status(404).json({ message: 'No User found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },


    //add friend
    addFriend({params}, res){
        User.findOneAndUpdate(
            {id: params.userId},
            {$push: { friends: params.friendId}},
            {new: true, runValidators: true}
        )
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({ message: 'No User found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err))
    },

    removeFriend({ params }, res){
        User.findOneAndUpdate(
            {_id: params.userId},
            {$pull: {friends: params.friendId}},
            {new: true, runValidators: true}
        )
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({ message: 'No User found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err))
    }


}
module.exports = userController
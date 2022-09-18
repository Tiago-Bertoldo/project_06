const Sauces = require('../models/Souces')
const fs  = require('fs')


exports.insertSauces = (req, res , next) => {
    const saucesObject = req.body;
    delete saucesObject._id;
    delete saucesObject._userId;
    const sauces = new Sauces( {
        ...req.body,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauces.save()
    .then(()=> res.status(201).json({ message : 'Sauces Creer'}))
    .catch(error => res.status(400).json( { error }));
}

exports.findAllSouces = ( req, res ,next ) => {
    Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
}


exports.findOneSauces =  (req , res , next) => {
    Sauces.findOne({_id:req.params.id})
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({error}))
}

exports.changeSauces = (req , res , next )=> {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : {
            ...req.body
        };

        delete sauceObject._userId;
        Sauces.findOne({_id: req.params.id})
        .then((sauce)=> {
            if(sauce.userId != req.auth.userId){
                res.status(401).json({message : 'Not authorized'});
            }else {
                Sauces.updateOne({ _id:req.params.id} , { ...sauceObject, _id:req.params.id})
                .then(()=> res.status(200).json({message: 'Object modifié! '}))
                .catch(error => res.status(400).json({error}))
            }
        })
        .catch((error) => {
            res.status(400).json({error})
        })

}

exports.deleteSauce = (req , res , next)=> {
    Sauces.findOne({ _id: req.params.id })
    .then(sauces => {
        if(sauces.userId != req.auth.userId){
            res.status(401).json({message : 'Not Authorized'});
        }else {
            const delFile = sauces.imageUrl.split('/images')[1];
            fs.unlink(`images/${delFile}`, ()=> {
                Sauces.deleteOne({_id : req.params.id})
                .then(()=> { res.status(200).json({message : 'Object supprimé'})})
                .catch(error => res.status(400).json({error}))
            })
        }
    })
    .catch(error => res.status(401).json({message : 'Not Authorized'}))
}


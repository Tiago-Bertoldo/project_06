const Sauces = require('../models/Souces')


exports.insertSauces = (req, res , next) => {
    const sauces = new Sauces( 
        console.log(req.auth.userId), 
        {
        ...req.body,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}//images/${req.file.filename}`
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



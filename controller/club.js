const clubModel = require('./../model/club')

exports.updateClub = (req, res) => {
  clubModel.update(req.body.club)
  .then(result => {
    res.json({message: 'success'})
  })
}
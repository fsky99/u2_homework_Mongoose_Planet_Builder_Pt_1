const Planet = require("../models/planet")
const explorer = require('../models/explorer');

module.exports = {
  index,
  show,
  new: newPlanet,
  create,
}

async function index(req, res) {
  const planets = await Planet.find({})
  res.render("planets/index", { title: "All Planets", planets })
}

async function show(req, res) {
  const planet = await Planet.findById(req.params.id).populate('explorer')
  const explorers = await explorer.find({})
const planetExplorer = planet.explorer
const explorerNames = planetExplorer.map((explorerMember) => explorerMember.name)
const availableExplorers = explorers.filter((explorer)=>{
  console.log(typeof explorer._id)
  if(!explorerNames.includes(explorer.name)) {
    return explorer;
  }
})
  res.render("planets/show", { title: "Planet Detail", planet , availableExplorers })
}


function newPlanet(req, res) {
  // We'll want to be able to render an
  // errorMsg if the create action fails
  res.render("planets/new", { title: "Add Planet", errorMsg: "" })
}

async function create(req, res) {
  // Remove empty properties so that defaults will be applied
  for (let key in req.body) {
    if (req.body[key] === "") delete req.body[key]
  }
  try {
    await Planet.create(req.body)
    // Always redirect after CUDing data
    // We'll refactor to redirect to the movies index after we implement it
    res.redirect("/planets") // Update this line
  } catch (err) {
    // Typically some sort of validation error
    console.log(err)
    res.render("planets/new", { errorMsg: err.message })
  }
}

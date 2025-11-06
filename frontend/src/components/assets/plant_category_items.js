// Starter data for carousels; images reference existing assets.
const imgSucculents = require('../images/SUCCULANTS.jpg')
const imgHerbs = require('../images/herbs.jpg')
const imgTropical = require('../images/tropical.jpg')
const imgLowLight = require('../images/infroor house plants.jpg')
const imgVeggies = require('../images/fruits.jpg')

export const succulentsCacti = [
  { id: 'sc-1', name: 'Golden Barrel Cactus', image: require('../images/succulent1.jpg'), new_price: 349, old_price: 449, bestSeller: true },
  { id: 'sc-2', name: 'Zebra Haworthia', image: imgSucculents, new_price: 299, old_price: 399 },
  { id: 'sc-3', name: 'String of Pearls', image: require('../images/succulent2.jpg'), new_price: 379, old_price: 479, bestSeller: true },
  { id: 'sc-4', name: 'Echeveria Lola', image: require('../images/succulant3.jpg'), new_price: 329, old_price: 429 },
  { id: 'sc-5', name: 'Moon Cactus', image: require('../images/succulant4.jpg'), new_price: 289, old_price: 349 },
  { id: 'sc-6', name: 'Aloe Vera', image: require('../images/succulant5.jpg'), new_price: 319, old_price: 399 },
  { id: 'sc-7', name: 'Pincushion Cactus', image: imgSucculents, new_price: 269, old_price: 329 },
]

export const herbs = [
  { id: 'hb-1', name: 'Sweet Basil', image: imgHerbs, new_price: 199, old_price: 259, bestSeller: true },
  { id: 'hb-2', name: 'Mint', image: imgHerbs, new_price: 189, old_price: 239 },
  { id: 'hb-3', name: 'Rosemary', image: imgHerbs, new_price: 229, old_price: 289, bestSeller: true },
  { id: 'hb-4', name: 'Thyme', image: imgHerbs, new_price: 209, old_price: 269 },
  { id: 'hb-5', name: 'Coriander', image: imgHerbs, new_price: 179, old_price: 229 },
  { id: 'hb-6', name: 'Oregano', image: imgHerbs, new_price: 219, old_price: 279 },
  { id: 'hb-7', name: 'Dill', image: imgHerbs, new_price: 199, old_price: 249 },
]

export const tropical = [
  { id: 'tr-1', name: 'Monstera Deliciosa', image: imgTropical, new_price: 549, old_price: 699, bestSeller: true },
  { id: 'tr-2', name: 'Bird of Paradise', image: imgTropical, new_price: 589, old_price: 749 },
  { id: 'tr-3', name: 'Anthurium', image: imgTropical, new_price: 519, old_price: 659 },
  { id: 'tr-4', name: 'Calathea Orbifolia', image: imgTropical, new_price: 499, old_price: 639 },
  { id: 'tr-5', name: 'Philodendron Brasil', image: imgTropical, new_price: 449, old_price: 579 },
  { id: 'tr-6', name: 'Fiddle Leaf Fig', image: imgTropical, new_price: 599, old_price: 759, bestSeller: true },
  { id: 'tr-7', name: 'Peace Lily', image: imgTropical, new_price: 399, old_price: 499 },
]

export const lowLight = [
  { id: 'll-1', name: 'ZZ Plant', image: imgLowLight, new_price: 399, old_price: 499, bestSeller: true },
  { id: 'll-2', name: 'Snake Plant', image: imgLowLight, new_price: 349, old_price: 449, bestSeller: true },
  { id: 'll-3', name: 'Pothos', image: imgLowLight, new_price: 299, old_price: 379 },
  { id: 'll-4', name: 'Cast Iron Plant', image: imgLowLight, new_price: 429, old_price: 549 },
  { id: 'll-5', name: 'Chinese Evergreen', image: imgLowLight, new_price: 369, old_price: 469 },
  { id: 'll-6', name: 'Spider Plant', image: imgLowLight, new_price: 289, old_price: 359 },
  { id: 'll-7', name: 'Dieffenbachia', image: imgLowLight, new_price: 379, old_price: 459 },
]

export const veggies = [
  { id: 'vg-1', name: 'Tomato Plant', image: imgVeggies, new_price: 249, old_price: 319, bestSeller: true },
  { id: 'vg-2', name: 'Chili Pepper', image: imgVeggies, new_price: 229, old_price: 299 },
  { id: 'vg-3', name: 'Cucumber', image: imgVeggies, new_price: 219, old_price: 289 },
  { id: 'vg-4', name: 'Bell Pepper', image: imgVeggies, new_price: 239, old_price: 309, bestSeller: true },
  { id: 'vg-5', name: 'Eggplant', image: imgVeggies, new_price: 259, old_price: 329 },
  { id: 'vg-6', name: 'Spinach', image: imgVeggies, new_price: 199, old_price: 259 },
  { id: 'vg-7', name: 'Coriander (Edible)', image: imgVeggies, new_price: 179, old_price: 229 },
]
// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Cat
const defaultCatData = {
  name: 'unknown',
  bedsOwned: 0,
};

const defaultDogData = {
  name: 'unknown',
  breed: 'dog',
  age: 0,
};

let lastAddedCat = new Cat(defaultCatData);
let lastAddedDog = new Cat(defaultDogData);

const hostIndex = (req, res) => {
  res.render('index', {
    currentCatName: lastAddedCat.name,
    currentDogName: lastAddedDog.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const readAllCats = (req, res, callback) => {
  Cat.find(callback).lean();
};

const readAllDogs = (req, res, callback) => {
  Dog.find(callback).lean();
};

const readCat = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }

    return res.json(doc);
  };

  Cat.findByName(name1, callback);
};

const readDog = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }

    return res.json(doc);
  };

  Dog.findByName(name1, callback);
};

const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.status(500).json({ err });
    }

    return res.render('page1', { cats: docs });
  };

  readAllCats(req, res, callback);
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const hostPage4 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.status(500).json({ err });
    }

    return res.render('page4', { dogs: docs });
  };

  readAllDogs(req, res, callback);
};

const getCatName = (req, res) => {
  res.json({ name: lastAddedCat.name });
};

const getDogName = (req, res) => {
  res.json({ name: lastAddedDog.name });
};

const setCatName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;

  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  const savePromise = newCat.save();

  savePromise.then(() => {
    lastAddedCat = newCat;

    res.json({
      name: lastAddedCat.name,
      beds: lastAddedCat.bedsOwned,
    });
  });

  savePromise.catch((err) => res.status(500).json({ err }));

  return res;
};

const setDogName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'firstname,lastname,breed,age are all required' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;

  const dogData = {
    name,
    breed: req.body.breed,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);

  const savePromise = newDog.save();

  savePromise.then(() => {
    lastAddedDog = newDog;

    res.json({
      name: lastAddedDog.name,
      breed: lastAddedDog.breed,
      age: lastAddedDog.age,
    });
  });

  savePromise.catch((err) => res.status(500).json({ err }));

  return res;
};

const searchCatName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  return Cat.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }

    if (!doc) {
      return res.json({ error: 'No Cats Found!' });
    }

    return res.json({
      name: doc.name,
      beds: doc.bedsOwned,
    });
  });
};

const searchDogName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  return Dog.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }

    if (!doc) {
      return res.json({ error: 'No Dogs Found!' });
    }

    const document = doc;
    document.age++;

    const savePromise = document.save();

    savePromise.then(() => {
      res.json({
        name: document.name,
        breed: document.breed,
        age: document.age,
      });
    });

    savePromise.catch((error) => {
      res.status(500).json({ error });
    });

    return true;
  });
};

const updateLastCat = (req, res) => {
  lastAddedCat.bedsOwned++;

  const savePromise = lastAddedCat.save();

  savePromise.then(() => {
    res.json({
      name: lastAddedCat.name,
      beds: lastAddedCat.bedsOwned,
    });
  });

  savePromise.catch((err) => {
    res.status(500).json({ err });
  });
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readCat,
  readDog,
  getCatName,
  getDogName,
  setCatName,
  setDogName,
  updateLastCat,
  searchCatName,
  searchDogName,
  notFound,
};

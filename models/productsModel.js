const { ObjectId } = require('mongodb');
const connection = require('./connection');
collectionName = 'products';

const getNewInsertedProduct = (id, name, quantity) => ({ _id: id, name, quantity });

const getAllProducts = async () => {
  return connection()
    .then((db) => db.collection(collectionName).find().toArray())
    .then((products) => products);
};

const insertAProduct = async (name, quantity) =>
  connection()
    .then((db) => db.collection(collectionName).insertOne({ name, quantity }))
    .then((result) => getNewInsertedProduct(result.insertedId, name, quantity));

const getProductById = async (id) =>
  connection()
    .then((db) => db.collection(collectionName).findOne(ObjectId(id)))
    .then((result) => result);

module.exports = {
  getAllProducts,
  insertAProduct,
  getProductById,
};

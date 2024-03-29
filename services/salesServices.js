const { isValidQuantity } = require('./salesValidation');
const salesModel = require('../models/salesModel');
const { ObjectId } = require('mongodb');

const emptyArrayLength = 0;
const objError = {
  err: {
    code: 'not_found',
    message: 'Sale not found',
    status: 404,
  },
};

const UNPROCESSED_ENTITY_STATUS = 422;

const insertSale = async (saleArray) => {
  const validatingQuantity = saleArray.map((sale) => isValidQuantity(sale.quantity));
  if (validatingQuantity.some((validate) => validate.err))
    return validatingQuantity.find((error) => error.err);
  const response = await salesModel.insertSale(saleArray);
  return response;
};

const getSaleById = async (id) => {
  if (!ObjectId.isValid(id)) return objError;
  const response = await salesModel.getSaleById(id);
  if (!response) return objError;
  return response;
};

const getAllSales = async () => {
  const response = await salesModel.getAllSales();
  if (response.length === emptyArrayLength) return objError;
  return { sales: response };
};

const updateSale = async (id, productId, quantity) => {
  const validateQuantity = isValidQuantity(quantity);
  if (validateQuantity.err) return validateQuantity;
  await salesModel.updateSale(id, productId, quantity);
  return { _id: id, itensSold: [{ productId, quantity }] };
};

const deleteSale = async (id) => {
  if (!ObjectId.isValid(id)) {
    return {
      err: {
        code: 'invalid_data',
        message: 'Wrong sale ID format',
        status: UNPROCESSED_ENTITY_STATUS,
      },
    };
  }
  const response = await salesModel.deleteSale(id);
  if (!response) {
    return {
      err: {
        code: 'invalid_data',
        message: 'Wrong sale ID format',
        status: UNPROCESSED_ENTITY_STATUS,
      },
    };
  }
  return response;
};

module.exports = {
  insertSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
};

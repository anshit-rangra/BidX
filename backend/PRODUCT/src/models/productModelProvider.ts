import realProductModel from './product.model.ts';

export let productModel = realProductModel;

export function setProductModel(model: any) {
  productModel = model;
}

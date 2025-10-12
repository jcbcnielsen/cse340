const pool = require("../database/")
const invModel = {}

/* ***************************
 *  Get all classification data
 * ************************** */
invModel.getClassifications = async function (){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
invModel.getInventoryByClassificationId = async function (classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get a single inventory item by inv_id
 * ************************** */
invModel.getInventoryById = async function (inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.inv_id = ${inv_id}`
    );
    return data.rows[0];
  } catch (error) {
    console.error("getdetailsbyid error " + error);
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
invModel.addClassification = async function (classification_name) {
  try {
    const sql = `INSERT INTO public.classification (classification_name) VALUES ('${classification_name}') RETURNING *`;
    return await pool.query(sql);
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Check for an exsisting classification
 * ************************** */
invModel.checkExsistingClass = async function (classification_name) {
  try {
    const sql = `SELECT * FROM public.classification WHERE classification_name = '${classification_name}'`;
    const classification = await pool.query(sql);
    return classification.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Add a new inventory item
 * ************************** */
invModel.addInventory = async function (
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql = `
      INSERT INTO public.inventory (
        inv_make, 
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      ) VALUES (
        '${inv_make}',
        '${inv_model}',
        ${inv_year},
        '${inv_description}',
        '${inv_image}',
        '${inv_thumbnail}',
        ${inv_price},
        ${inv_miles},
        '${inv_color}',
        ${classification_id}
      )`;
    return await pool.query(sql);
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Update an inventory item
 * ************************** */
invModel.editInventory = async function (
  inv_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql = `
      UPDATE public.inventory
      SET
        inv_make = '${inv_make}', 
        inv_model = '${inv_model}',
        inv_year = ${inv_year},
        inv_description = '${inv_description}',
        inv_image = '${inv_image}',
        inv_thumbnail = '${inv_thumbnail}',
        inv_price = ${inv_price},
        inv_miles = ${inv_miles},
        inv_color = '${inv_color}',
        classification_id = ${classification_id}
      WHERE inv_id = ${inv_id} RETURNING *`;
    const data = await pool.query(sql);
    return data.rows[0];
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Delete an inventory item
 * ************************** */
invModel.deleteInventory = async function (inv_id) {
  try {
    const sql = `DELETE FROM public.inventory WHERE inv_id = ${inv_id} RETURNING *`;
    const data = await pool.query(sql);
    return data;
  } catch (error) {
    return error.message;
  }
}

module.exports = invModel;
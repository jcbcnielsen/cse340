const pool = require("../database/");
const accountModel = {}

/* ****************************************
*  Register new account
* *************************************** */
accountModel.registerAccount = async function (account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = `
            INSERT INTO public.account (
                account_firstname,
                account_lastname,
                account_email,
                account_password,
                account_type
            ) VALUES (
                '${account_firstname}',
                '${account_lastname}',
                '${account_email}',
                '${account_password}',
                'Client'
            ) RETURNING *`;
        return await pool.query(sql);
    } catch (error) {
        return error.message;
    }
}

/* **********************
*   Check for existing email
* ********************* */
accountModel.checkExsistingEmail = async function (account_email) {
    try {
        const sql = `SELECT * FROM public.account WHERE account_email = '${account_email}'`;
        const email = await pool.query(sql);
        return email.rowCount;
    } catch (error) {
        return error.message;
    }
}

/* **********************
*   Get account info using an email
* ********************* */
accountModel.getAccountByEmail = async function (account_email) {
    try {
        const sql = `
            SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password
            FROM public.account
            WHERE account_email = '${account_email}'`;
        const result = await pool.query(sql);
        return result.rows[0];
    } catch (error) {
        return new Error("No matching email found.");
    }
}

/* **********************
*   Get account info using an account_id
* ********************* */
accountModel.getAccountById = async function (account_id) {
    try {
        const sql = `
            SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password
            FROM public.account
            WHERE account_id = ${account_id}`;
        const result = await pool.query(sql);
        return result.rows[0];
    } catch (error) {
        return new Error("No matching account found.");
    }
}

/* **********************
*   Update account info
* ********************* */
accountModel.updateAccount = async function (
    account_id,
    account_firstname,
    account_lastname,
    account_email
) {
    try {
        const sql = `
            UPDATE public.account
            SET
                account_firstname = '${account_firstname}',
                account_lastname = '${account_lastname}',
                account_email = '${account_email}'
            WHERE account_id = ${account_id} RETURNING *`;
        const data = await pool.query(sql);
        return data.rows[0];
    } catch (error) {
        return error.message;
    }
}

/* **********************
*   Change account password
* ********************* */
accountModel.changePassword = async function (account_id, account_password) {
    try {
        const sql = `
            UPDATE public.account
            SET
                account_password = '${account_password}'
            WHERE account_id = ${account_id} RETURNING *`;
        const data = await pool.query(sql);
        return data.rows[0];
    } catch (error) {
        return error.message;
    }
}

module.exports = accountModel;
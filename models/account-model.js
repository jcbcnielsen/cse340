const pool = require("../database/");

/* ****************************************
*  Register new account
* *************************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = `INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ('${account_firstname}', '${account_lastname}', '${account_email}', '${account_password}', 'Client') RETURNING *`;
        return await pool.query(sql);
    } catch (error) {
        return error.message;
    }
}

/* **********************
*   Check for existing email
* ********************* */
async function checkExsistingEmail(account_email){
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
async function getAccountByEmail(account_email) {
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

module.exports = {
    registerAccount,
    checkExsistingEmail,
    getAccountByEmail
}
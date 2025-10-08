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

module.exports = { registerAccount }
'use strict';
const { Pool, Client } = require('pg');
const format = require('pg-format');
const config  = require('../config/index');

let types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);

const pool = new Pool({
    user: config.database.user,
    host: config.database.host,
    database: config.database.database,
    password: config.database.password,
    port: config.database.port,
    max: config.database.max
});

module.exports = class DataBase {
    constructor(table) {
        table ? this.tableName = table : '';
    }

    async getBy(field, value, columns) {
        if (columns){
            let ColumnNames = Object.values(columns);
            const result = await this.query(`SELECT ${ColumnNames.map((key) => `${key}`).join(', ')}  FROM ${this.tableName} WHERE ${field} = $1`, [value]);
            return result.rows
        } else {
            const result = await this.query(`SELECT * FROM ${this.tableName} WHERE ${field} = $1`, [value]);
            return result.rows

        }
    }

    async getById(id,columns) {
        if (columns) {
            let ColumnNames = Object.values(columns);
            const result = await this.query(`SELECT ${ColumnNames.map((key) => `${key}`).join(', ')} FROM ${this.tableName} WHERE id = $1`, [id]);
            if (result.rowCount === 0) {
                this.throwHttpError(404, 'Not found');
            }
            return result.rows[0];
        }else {
            const result = await this.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
            if (result.rowCount === 0) {
                this.throwHttpError(404, 'Not found');
            }
            return result.rows[0];
        }
    }

    async getAll(columns) {
        if (columns) {
            let ColumnNames = Object.values(columns);
            const result = await this.query(`SELECT ${ColumnNames.map((key) => `${key}`).join(', ')} FROM ${this.tableName}`);
            return result.rowCount === 0 ? [] : result.rows;
        }else{
            const result = await this.query(`SELECT * FROM ${this.tableName}`);
            return result.rowCount === 0 ? [] : result.rows;
        }
    }

    async add(data) {
        delete data.id;
        const result = await this.insert(data);
        if(result.rowCount === 0) {
            this.throwHttpError(400, 'Bad request');
        }
        return result.rows[0];
    }

    async addMany(data) {
        const result = await this.multipleInsert(
            Object.keys(this.jsonSchema.properties).filter(field => field !== 'id'),
            data
        );
        if(result.rowCount === 0) {
            this.throwHttpError(400, 'Bad request');
        }
        return { rowCount: result.rowCount }
    }

    async removeBy(field, value) {
        const result = await this.delete(field, value);
        return { rowCount: result.rowCount }
    }

    async edit(data) {
        const result = await this.update(data);
        if(result.rowCount === 0) {
            this.throwHttpError(404, 'Not found');
        }
        return result.rows[0];
    }

    throwHttpError(status, message) {
        const err = new Error(message);
        err.status = status;
        throw err;
    }

    insert(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const query = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${keys.map((_, i) => `$${(i + 1)}`).join(', ')}) returning *`
        return this.query(query, values);
    }

    multipleInsert(fields, data) {
        const query = format(`INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES %L`, data);
        return this.query(query)
    }

    update(data) {
        const id = data.id;
        delete data.id;
        const keys = Object.keys(data);
        const values = Object.values(data);
        const query = `UPDATE ${this.tableName} SET ${keys.map((key, i) => `${key} = $${i + 2}`).join(', ')} WHERE id = $1 returning *`;
        return this.query(query, [id, ...values])
    }

    query(query, values) {
        // console.log("QUERY:", query);
        // console.log("VALUES:", values);
        return values ? pool.query(query, values) : pool.query(query)
    }

    async DB_query(query, values) {
        // console.log("QUERY:", query);
        // console.log("VALUES:", values);
        let data =  await this.query(query, values);
        return data['rows']
    }

    delete(field, value) {
        return this.query(`DELETE FROM ${this.tableName} WHERE ${field} = $1`, [value])
    }
};

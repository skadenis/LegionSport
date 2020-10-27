'use strict';
let DataBase = require('../components/database/index');

module.exports = class representatives {
  constructor(){

  }

  async get_info(data){
      return {
          status: 200,
          data: await new DataBase('representative').getById(data.id)
      }
  }

  async get_child_representatives(data){
      return await new DataBase('representative').DB_query('SELECT * FROM representative WHERE child_id = $1 and is_deleted = $2', [data.child_id, false]);
  }
  async add_child_representatives(data){
      let info = await this.get_info({id:data.id});
      return {
          status:200,
          data: info
      };
  }
  async edit_representative(data){
      let users = await new DataBase('representative').getBy('id',data.id);


      if(users.length > 0){
          await new DataBase('representative').edit(data);
          let info = await this.get_info({id:data.id});
          return {
              status:200,
              data: info
          };
      }else {
          return {
              status:404,
              description: 'no user with such id'
          };
      }


  }
  async delete_representative(data){
      let editdata = {
          id: data.id,
          is_deleted: true
      };
      return {
          status:200,
          info: await new DataBase('representative').edit(editdata)
      };
  }

};

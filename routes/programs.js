let express = require('express');
let router = express.Router();

let Policy = require('cors');
const verifyToken = require('../components/functions/Token');
const CheckAuthorization = require('../components/functions/CheckAuthorization');
const ManageRights = require('../components/functions/Rights/ManagePrograms');

let programs = require('../operations/programs');

router.get('/all', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await programs.get_all_programs();
    res.json(data);
});
router.get('/:id', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await new programs().get_program_info({id: req.params.id});
    res.json(data);
});

router.post('/edit', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data;
    if(req.body.id === 0){
        data = await programs.create_program(req.body);
    } else {
        data = await new programs().edit_program(req.body);
    }
    res.json(data);
});
router.post('/delete', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await new programs().delete_program(req.body);
    res.json(data);
});

module.exports = router;

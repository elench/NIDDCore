const { JobTitleModel } = require('../model/JobTitleModel');

module.exports = {
    target: JobTitleModel,
    columns: {
        job_title_id: {
            primary: true,
            type: 'int',
            generated: true
        },
        job_title: {
            type: 'varchar',
            length: 64
        }
    }
}

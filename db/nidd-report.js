const knex = require('./connection').knex;

const niddReport = [];
let maxId = -1;

module.exports.getReportById = id => {
    return knex('niddreport')
    .where('nidd_report_id', id)
    .then(report => {
        return report[0];
    })
}

module.exports.loadNiddReport = () =>  {
    return knex('niddreport')
    .where('nidd_report_id', '>', maxId)
    .then(reports => {
        for (report of reports) {
            niddReport.push(report);
        }
        maxId = niddReport[niddReport.length - 1].nidd_report_id;
        return 'loaded';
    })
    .catch(err => {
        return err;
    });
}

module.exports.getNiddReport = (limit, offset) => {
    return knex
    .select('nidd_report_id', 'ip_src', 'ip_dst', 'sig_name', 'timestamp')
    .from('niddreport')
    .limit(limit)
    .offset(offset)
    .orderBy('nidd_report_id', 'desc');
}

module.exports.getCount = () => {
    return knex('niddreport')
    .count('nidd_report_id as count')
    .then(count => {
        return count[0].count;
    });
}

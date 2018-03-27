const knex = require('./connection').knex;

const niddReport = [];
let maxId = -1;

module.exports.getReportById = id => {
    for (let report of niddReport) {
        if (report.nidd_report_id == id) {
            return report;
        }
    }
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

module.exports.getNiddReport = () => {
    return niddReport;
}

$(document).ready(function() {
    $('#eventTable').DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': '/index/table',
        'ordering': false,
        'searching': false,
        'columns': [
            { 'data': 'nidd_report_id',
                'render': function(data, type, row, meta) {
                    let link =
                        `<a href="/report/${data}"><i class="fas fa-eye"></i></a> ${data}`;
                    return link;
                }
            },
            { 'data': 'ip_src' },
            { 'data': 'ip_dst' },
            { 'data': 'sig_name' },
            { 'data': 'timestamp' },
        ],
    });
});

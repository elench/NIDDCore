<% include header %>
<% const r = report; %>

  <div class="panel panel-primary">
    <div class="panel-heading">
      <h4 class="panel-title">Report Details</h4>
    </div>
    <div class="panel-body">
      <div class="row">
        <div class="col-sm-3">
          <p>Report ID: <%= r.nidd_report_id %></p>
        </div>
        <div class="col-sm-3">
          <p>Accessed by: <%= %></p>
        </div>
        <div class="col-sm-3">
          <p>Created on: <%= %></p>
        </div>
      </div>
    </div>
  </div>

  <div class="panel panel-primary">
    <div class="panel-heading">
      <h4 class="panel-title">Event Details</h4>
    </div>

    <div class="panel-body">
      <div class="row">
        <div class="col-sm-3">
          <p>Sensor ID: <%= r.sid %></p>
        </div>
        <div class="col-sm-3">
          <p>Sensor: <%= %></p>
        </div>
        <div class="col-sm-3">
          <p>Interface: <%= r.interface %></p>
        </div>
        <div class="col-sm-3">
          <p>CID: <%= r.cid %></p>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-3">
          <p>Timestamp: <%= r.timestamp %></p>
        </div>
        <div class="col-sm-3">
          <p>Generator ID: <%= r.sig_gid %></p>
        </div>
        <div class="col-sm-3">
          <p>Signature ID: <%= r.sig_id %></p>
        </div>
        <div class="col-sm-3">
          <p>Signature: <%= r.signature %></p>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-3">
          <p>Sig. Revision: <%= r.sig_rev %></p>
        </div>
        <div class="col-sm-3">
          <p>Sig. Priority: <%= r.sig_priority %></p>
        </div>
        <div class="col-sm-3">
          <p>Classification: <%= r.sig_name %></p>
        </div>
      </div>
    </div>
  </div>

  <div class="panel panel-primary">
    <div class="panel-heading">
      <h4 class="panel-title">IP Header</h4>
    </div>

    <div class="panel-body">
      <div class="row">
        <div class="col-sm-3">
          <p>Source: <%= r.ip_src %></p>
        </div>
        <div class="col-sm-3">
          <p>Destination: <%= r.ip_dst %></p>
        </div>
        <div class="col-sm-3">
          <p>Version: <%= r.ip_ver %></p>
        </div>
        <div class="col-sm-3">
          <p>Proto: <%= r.ip_proto %></p>
        </div>
      </div>
    </div>

  </div>

  <div class="panel panel-primary">
    <div class="panel-heading">
      <h4 class="panel-title">TCP Header</h4>
    </div>

    <div class="panel-body">
      <div class="row">
        <div class="col-sm-6">
          <p>Source Port: <%= r.tcp_sport %></p>
        </div>
        <div class="col-sm-6">
          <p>Destination Port: <%= r.tcp_dport %></p>
        </div>
      </div>
    </div>

  </div>

  <div class="panel panel-primary">
    <div class="panel-heading">
      <h4 class="panel-title">UDP Header</h4>
    </div>

    <div class="panel-body">
      <div class="row">
        <div class="col-sm-6">
          <p>Source Port: <%= r.udp_sport %></p>
        </div>
        <div class="col-sm-6">
          <p>Destination Port: <%= r.udp_dport %></p>
        </div>
      </div>
    </div>

  </div>

  <div class="panel panel-primary">
    <div class="panel-heading">
      <h4 class="panel-title">ICMP Header</h4>
    </div>

    <div class="panel-body">
      <div class="row">
        <div class="col-sm-6">
          <p>Type: <%= r.icmp_type %></p>
        </div>
        <div class="col-sm-6">
          <p>Code: <%= r.icmp_code %></p>
        </div>
      </div>
    </div>

  </div>

  <div class="panel panel-primary">

    <div class="panel-heading">
      <div class="row">
        <div class="col-sm-6">
          <h4 class="panel-title">Source Image</h4>
        </div>
        <div class="col-sm-6">
          <h4 class="panel-title">Destination Image</h4>
        </div>
      </div>
    </div>

    <div class="panel-body">
      <div class="row">
        <div class="col-sm-6">
          <div class="thumbnail">
            <a href="/snapshots/2018-3-15_15-18-53.jpg">
              <img src="/snapshots/2018-3-15_15-18-53.jpg">
            </a>
          </div>
        </div>

        <div class="col-sm-6">
          <div class="thumbnail">
            <a href="/snapshots/2018-3-15_15-18-58.jpg">
              <img src="/snapshots/2018-3-15_15-18-58.jpg">
            </a>
          </div>
        </div>
      </div>
    </div>

  </div>

  <div class="panel panel-primary">
    <div class="row">
      <div class="col-sm-6">
        <h4 class="panel-title">Source User</h4>
        <p>User ID: <%= %></p>
        <p>Name: <%= `${r.src_user_first_name} ${r.src_user_last_name}` %></p>
        <p>Job Title: <%= r.src_job_title %></p>
        <p>Office Location: <%= `${r.src_office_building} ${r.src_office_room}` %></p>
        <p>Phone: <%= r.src_phone %></p>
        <p>Email: <%= r.src_email %></p>
      </div>
      <div class="col-sm-6">
        <h4 class="panel-title">Destination User</h4>
        <p>User ID: <%= %></p>
        <p>Name: <%= `${r.dst_user_first_name} ${r.src_user_last_name}` %></p>
        <p>Job Title: <%= r.dst_job_title %></p>
        <p>Office Location: <%= `${r.dst_office_building} ${r.src_office_room}` %></p>
        <p>Phone: <%= r.dst_phone%></p>
        <p>Email: <%= r.dst_email%></p>
      </div>
    </div>
  </div>

</div>

<% include footer %>

const typeorm = require('typeorm');
const { DataModel } = require('../model/snort-model/DataModel');
const { DetailModel } = require('../model/snort-model/DetailModel');
const { EncodingModel } = require('../model/snort-model/EncodingModel');
const { EventModel } = require('../model/snort-model/EventModel');
const { IcmpHdrModel } = require('../model/snort-model/IcmpHdrModel');
const { IpHdrModel } = require('../model/snort-model/IpHdrModel');
const { OptModel } = require('../model/snort-model/OptModel');
const { ReferenceModel } = require('../model/snort-model/ReferenceModel');
const { ReferenceSystemModel } = require('../model/snort-model/ReferenceSystemModel');
const { SchemaModel } = require('../model/snort-model/SchemaModel');
const { SensorModel } = require('../model/snort-model/SensorModel');
const { SigClassModel } = require('../model/snort-model/SigClassModel');
const { SignatureModel } = require('../model/snort-model/SignatureModel');
const { SigReferenceModel } = require('../model/snort-model/SigReferenceModel');
const { TcpHdrModel } = require('../model/snort-model/TcpHdrModel');
const { UdpHdrModel } = require('../model/snort-model/UdpHdrModel');

const options = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'toor',
    database: 'snortdb_fake',
    synchronize: true,
    logging: false,
    entitySchemas: [
        require('../entity/snort-entity/DataSchema'),
        require('../entity/snort-entity/DetailSchema'),
        require('../entity/snort-entity/EncodingSchema'),
        require('../entity/snort-entity/EventSchema'),
        require('../entity/snort-entity/IcmpHdrSchema'),
        require('../entity/snort-entity/IpHdrSchema'),
        require('../entity/snort-entity/OptSchema'),
        require('../entity/snort-entity/ReferenceSchema'),
        require('../entity/snort-entity/ReferenceSystemSchema'),
        require('../entity/snort-entity/SchemaSchema'),
        require('../entity/snort-entity/SensorSchema'),
        require('../entity/snort-entity/SigClassSchema'),
        require('../entity/snort-entity/SignatureSchema'),
        require('../entity/snort-entity/SigReferenceSchema'),
        require('../entity/snort-entity/TcpHdrSchema'),
        require('../entity/snort-entity/UdpHdrSchema')
    ]
}

typeorm.createConnection(options)
.then(async connection => {
    const  dataRepository = connection.getRepository(DataModel);
    const  detailRepository = connection.getRepository(DetailModel);
    const  encodingRepository = connection.getRepository(EncodingModel);
    const  eventRepository = connection.getRepository(EventModel);
    const  icmpRepository = connection.getRepository(IcmpHdrModel);
    const  ipRepository = connection.getRepository(IpHdrModel);
    const  optRepository = connection.getRepository(OptModel);
    const  referenceRepository = connection.getRepository(ReferenceModel);
    const  refSysRepository = connection.getRepository(ReferenceSystemModel);
    const  schemaRepository = connection.getRepository(SchemaModel);
    const  sensorRepository = connection.getRepository(SensorModel);
    const  sigclassRepository = connection.getRepository(SigClassModel);
    const  sigRepository = connection.getRepository(SignatureModel);
    const  sigRefRepository = connection.getRepository(SigReferenceModel);
    const  tcpRepository = connection.getRepository(TcpHdrModel);
    const  udpRepository = connection.getRepository(UdpHdrModel);

    const dataTable = await dataRepository.find();
    const detailTable = await detailRepository.find();
    const encodingTable = await encodingRepository.find();
    const eventTable = await eventRepository.find();
    const icmpTable = await icmpRepository.find();
    const ipTable = await ipRepository.find();
    const optTable = await optRepository.find();
    const referenceTable = await referenceRepository.find();
    const refSysTable = await refSysRepository.find();
    const schemaTable = await schemaRepository.find();
    const sensorTable = await sensorRepository.find();
    const sigClassTable = await sigclassRepository.find();
    const sigTable = await sigRepository.find();
    const sigRefTable = await sigRefRepository.find();
    const tcpTable = await tcpRepository.find();
    const udpTable = await udpRepository.find();

    console.log(dataTable);
    console.log(detailTable);
    console.log(encodingTable);
    console.log(eventTable);
    console.log(icmpTable);
    console.log(ipTable);
    console.log(optTable);
    console.log(referenceTable);
    console.log(refSysTable);
    console.log(schemaTable);
    console.log(sensorTable);
    console.log(sigClassTable);
    console.log(sigTable);
    console.log(sigRefTable);
    console.log(tcpTable);
    console.log(udpTable);

    await connection.close();
})
.catch(err => {
    console.log(err);
});

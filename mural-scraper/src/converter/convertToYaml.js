const YAML = require('yaml');

function convertToYaml(db){
    const doc = new YAML.Document();
    doc.contents = db
    return doc.toString();
}


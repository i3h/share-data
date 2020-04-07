const core = require('@actions/core');
const github = require('@actions/github');
const artifact = require('@actions/artifact');
const fs = require('fs').promises;

// Setup user input
const share_id = core.getInput('share-id');
const mode = core.getInput('mode');
const key = core.getInput('key');
const value = core.getInput('value');

// Setup artifact
const artifactClient = artifact.create();
const artifactName = share_id;
const fileName = `share_data_${share_id}.json`;
const rootDirectory = '.';
const files = [fileName];

async function run() {
  try {
    let js = {};
    if (mode == 'set') {
      js = await load();
      js[key] = value;
      await save(js);
    } else if (mode == 'get') {
      js = await load();
      let data;
      if (key != '') {
        data = js[key];
      } else {
        data = JSON.stringify(js);
      }
      core.setOutput('data', data);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function load() {
  let js = {};
  try {
    let downloadResponse = await artifactClient.downloadArtifact(artifactName);
    let raw = await fs.readFile(fileName);
    js = JSON.parse(raw);
    await fs.unlink(fileName);
  } catch (error) {
    //console.log(error);
  }
  return js;
}

async function save(js) {
  let data = JSON.stringify(js, null, 2);
  await fs.writeFile(fileName, data, { mode: '644' });
  let uploadResult = await artifactClient.uploadArtifact(
    artifactName,
    files,
    rootDirectory,
  );
  await fs.unlink(fileName);
}

module.exports = run;

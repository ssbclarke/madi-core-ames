import { dirname, join } from "path";
import nock from "nock";
import * as stackTrace from "stack-trace";

function parentPath() {
  const trace = stackTrace.get();
  const currentFile = trace.shift().getFileName();
  const parentFile = trace
    .find(t => t.getFileName() !== currentFile).getFileName();
  const path = dirname(parentFile);
  return path.replace(/^file:\/\//, '') // Remove file:// from protocol on linux
}

export function setupRecorder(options = {}) {
  const nockBack = nock.back;
  const fixturePath =
    options.fixturePath || join(parentPath(), "__nock-fixtures__");
  nockBack.fixtures = fixturePath;
  nockBack.setMode(options.mode || "record");
  return (fixtureName, options = {}) =>
    nockBack(`${fixtureName}.json`, options).then(({ nockDone, context }) => {
        console.log('\n\n\n\n\n********** STARTING ',fixtureName,'************\n\n\n\n\n')
        return {
            completeRecording: ()=>{
                console.log('\n\n\n\n\n********** CLOSING ',fixtureName,'************\n\n\n\n\n')
                nock.cleanAll();
                nockDone();
            },
            ...context,
            assertScopesFinished: context.assertScopesFinished.bind(context)
        }
    });
}
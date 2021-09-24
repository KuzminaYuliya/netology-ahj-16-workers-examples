importScripts('node_modules/jszip/dist/jszip.js');

self.addEventListener('message', (e) => {
  const zip = new JSZip();

  const filename = e.data.name;

  const reader = new FileReader();

  reader.addEventListener('load', async (e) => {
    console.log('load');
    const text = e.target.result;

    zip.file(filename, text);

    const result = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
          level: 9
      }
    });

    const baseName = filename.includes('.') ?
      filename.slice(0, filename.lastIndexOf('.')) :
      filename;

    self.postMessage({
      filename: baseName + '.zip',
      blob: result
    });
  });

  reader.readAsArrayBuffer(e.data);
});

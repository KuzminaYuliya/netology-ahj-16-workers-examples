console.log('worker started');
self.addEventListener('message', (e) => {
  console.log('message in worker ' + e.data);

  let z;
  for (let i = 0; i < 1000000000; i++) {
    z = i * 2;
  }

  console.log(z);
  self.postMessage(z);
});

/*
      let z;
      for (let i = 0; i < 1000000000; i++) {
        z = i * 2;
      }

      resolve(z);
*/

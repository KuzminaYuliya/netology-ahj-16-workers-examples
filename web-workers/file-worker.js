self.addEventListener('message', (e) => {
  console.log(e.data);

  const reader = new FileReader();

  reader.addEventListener('load', (e) => {
    const text = e.target.result;

    self.postMessage(text);
  });

  reader.readAsText(e.data);
});

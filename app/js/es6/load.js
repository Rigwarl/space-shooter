export default (manifest, { progress, type } = {}) => new Promise((resolve, reject) => {
  const queue = new createjs.LoadQueue();

  if (type === 'sound') queue.installPlugin(createjs.Sound);
  if (progress) queue.addEventListener('progress', progress);

  queue.addEventListener('complete', () => resolve(queue));
  queue.addEventListener('error', reject);

  if (!Array.isArray(manifest)) manifest = [manifest];

  queue.loadManifest(manifest);
});

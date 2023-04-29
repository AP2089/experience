import chokidar from 'chokidar';
import sharp from 'sharp';

const vitePluginAutoGenerationWebp = (options = {}) => ({
  name: 'vite-plugin-auto-generation-webp',
  buildStart: async () => {
    try {
      const watcher = chokidar.watch(options.src);
      const events = ['add', 'change'];
  
      watcher.on('all', (event, target) => {
        if (events.includes(event)) {
          sharp(target)
            .webp()
            .toFile(target.replace(/\.[^.]+$/, '.webp'))
            .catch(error => {
              console.log(error);
            });
        }
      });
      
      if (process.env.NODE_ENV === 'production') {
        await watcher.close();
      }  
    } catch (error) {
      console.log(error);
    }
  }
});

export default vitePluginAutoGenerationWebp;
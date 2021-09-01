import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: './examples',
  build: {
    rollupOptions: {
      input: {
        main: './examples/index.html',

        asterisk: './examples/asterisk/index.html',
        boxfield: './examples/boxfield/index.html',
        calendar: './examples/calendar/index.html',
        demo1: './examples/demo1/index.html',
        demo4: './examples/demo4/index.html',
        demo6: './examples/demo6/index.html',
        events: './examples/events/index.html',
        hierarchy: './examples/hierarchy/index.html',
        'instance-sum': './examples/instance-sum/index.html',
        'instance-wires': './examples/instance-wires/index.html',
        points: './examples/points/index.html',
        table: './examples/table/index.html',
        'torus-walk': './examples/torus-walk/index.html',
        tv: './examples/tv/index.html',
      }
    },
    outDir: '../dist',
    emptyOutDir: true,
  }
})

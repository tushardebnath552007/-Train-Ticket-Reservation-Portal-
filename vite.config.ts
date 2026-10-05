import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';
import { defineConfig, Plugin } from 'vite';

function ensureBackend5500Plugin(): Plugin {
  return {
    name: 'ensure-backend-5500',
    configureServer() {
      const checkAndStart = () => {
        const req = http.get('http://127.0.0.1:5500/health', (res) => {
          if (res.statusCode === 200) {
            console.log('[Backend 5500] Verified ONLINE and healthy on port 5500');
          }
        });
        req.on('error', () => {
          console.log('[Backend 5500] Port 5500 inactive, spawning server_5500.ts...');
          try {
            const child = spawn('npx', ['tsx', 'server_5500.ts'], {
              stdio: 'ignore',
              detached: true,
            });
            child.unref();
          } catch (e) {
            console.error('[Backend 5500] Failed to launch server_5500.ts:', e);
          }
        });
      };
      checkAndStart();
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), ensureBackend5500Plugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5500',
          changeOrigin: true,
          secure: false,
        },
        '/health': {
          target: 'http://localhost:5500',
          changeOrigin: true,
          secure: false,
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

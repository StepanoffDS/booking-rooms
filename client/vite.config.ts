import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
const config = {
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/shared/test/setup.ts',
    coverage: {
      provider: 'v8',
      include: [
        'src/shared/model/booking.ts',
        'src/shared/realtime/realtime-provider.tsx',
        'src/features/booking-cancel/model/use-cancel-booking.ts',
        'src/features/booking-create/model/*.ts',
        'src/features/room-search/model/*.ts',
        'src/pages/room/model/{schedule,use-room-date}.ts',
        'src/pages/rooms/model/use-stored-office.ts',
      ],
    },
  },
};

export default defineConfig(config);

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Viteの設定（Reactプラグインを有効化）
export default defineConfig({
  plugins: [react()],
  server: {
    // SupabaseのデフォルトSite URL（http://localhost:3000）に合わせる
    port: 3000,
  },
})

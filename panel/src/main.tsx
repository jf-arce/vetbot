import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "next-themes";

// `next-themes` ya estaba instalado y `components/ui/sonner.tsx` ya lo
// consume (`useTheme()`) — faltaba este `ThemeProvider` en la raíz. Sin él,
// `useTheme()` no rompe (usa un valor por defecto) pero tampoco hace nada.
// `attribute="class"` matchea el `.dark` que ya define `index.css`.
createRoot(document.getElementById('root')!).render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ThemeProvider>,
)

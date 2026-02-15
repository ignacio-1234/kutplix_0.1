# 🎨 KUTPLIX - Plataforma de Gestión de Contenido Digital

Aplicación web Next.js para centralizar y optimizar la gestión de contenido digital entre clientes y diseñadores.

## 📋 Características

- ✅ Autenticación (Login/Registro)
- ✅ Dashboard para Clientes
- ✅ Dashboard para Diseñadores  
- ✅ Dashboard para Administradores
- ✅ Gestión de Proyectos
- ✅ Sistema de Revisiones
- ✅ Gestión de Planes
- ✅ Notificaciones en tiempo real

## 🚀 Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Fuentes:** DM Sans + Sora (Google Fonts)
- **Iconos:** Emojis nativos

## 📦 Instalación

### 1. Clonar o descargar el proyecto

```bash
cd kutplix-nextjs
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🗂️ Estructura del Proyecto

```
kutplix-nextjs/
├── app/
│   ├── dashboard/
│   │   ├── cliente/      # Dashboard del cliente
│   │   ├── disenador/    # Dashboard del diseñador (pendiente)
│   │   └── admin/        # Dashboard del admin (pendiente)
│   ├── login/            # Página de login/registro
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página de inicio (redirige a login)
├── components/
│   └── Sidebar.tsx       # Componente de navegación lateral
├── lib/                  # Utilidades y helpers
├── types/                # Tipos de TypeScript
├── public/               # Archivos estáticos
├── tailwind.config.ts    # Configuración de Tailwind
├── tsconfig.json         # Configuración de TypeScript
└── package.json          # Dependencias del proyecto
```

## 🎨 Rutas Disponibles

- `/` - Redirige al login
- `/login` - Página de autenticación
- `/dashboard/cliente` - Panel del cliente ✅
- `/dashboard/disenador` - Panel del diseñador (por implementar)
- `/dashboard/admin` - Panel del administrador (por implementar)

## 🎯 Próximas Implementaciones

### Dashboards Pendientes

1. **Dashboard Diseñador** (`/dashboard/disenador`)
   - Lista de tareas asignadas
   - Calendario de entregas
   - Métricas personales
   - Actividad reciente

2. **Dashboard Admin** (`/dashboard/admin`)
   - KPIs generales
   - Gestión de usuarios
   - Proyectos en riesgo
   - Carga de diseñadores

3. **Crear Nuevo Proyecto** (`/dashboard/cliente/nueva-solicitud`)
   - Wizard de 3 pasos
   - Selector de tipo de contenido
   - Upload de archivos
   - Confirmación

### Funcionalidades Adicionales

- [ ] Sistema de autenticación real (NextAuth.js)
- [ ] API Routes para backend
- [ ] Base de datos (Prisma + PostgreSQL)
- [ ] Upload de archivos (AWS S3 / Cloudinary)
- [ ] Notificaciones en tiempo real (Socket.io)
- [ ] Sistema de pagos (Stripe)
- [ ] Generación de reportes PDF
- [ ] Sistema de comentarios
- [ ] Chat en tiempo real

## 🎨 Paleta de Colores

```css
--primary: #2E75B6       /* Azul corporativo */
--primary-dark: #1a4d7a  /* Azul oscuro */
--primary-light: #D5E8F0 /* Azul claro */
--success: #4CAF50       /* Verde */
--warning: #FF9800       /* Naranja */
--danger: #f44336        /* Rojo */
--purple: #9c27b0        /* Púrpura */
```

## 🔧 Scripts Disponibles

```bash
npm run dev      # Ejecutar en modo desarrollo
npm run build    # Compilar para producción
npm run start    # Ejecutar build de producción
npm run lint     # Ejecutar ESLint
```

## 📝 Guía de Desarrollo

### Crear una nueva página

1. Crear carpeta en `app/` con el nombre de la ruta
2. Agregar archivo `page.tsx` dentro de la carpeta
3. Exportar componente por defecto

Ejemplo:
```tsx
// app/mi-pagina/page.tsx
export default function MiPagina() {
  return <div>Mi contenido</div>
}
```

### Crear un nuevo componente

1. Crear archivo en `components/`
2. Usar convención PascalCase
3. Exportar por defecto

Ejemplo:
```tsx
// components/MiComponente.tsx
export default function MiComponente() {
  return <div>Mi componente</div>
}
```

### Usar Tailwind CSS

```tsx
<div className="bg-primary text-white p-4 rounded-lg">
  Contenido
</div>
```

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

## 📄 Documentación Técnica

Consulta el archivo `Kutplix-Documentacion-Tecnica.docx` para:
- Requerimientos funcionales completos
- Arquitectura del sistema
- Modelo de datos
- Casos de uso
- Stack tecnológico recomendado

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Proyecto: Kutplix - Plataforma de Gestión de Contenido Digital

---

**Versión:** 1.0.0  
**Última actualización:** Febrero 2026

# Firebase

### Solo desplegar funciones
```bash
npx firebase deploy --only functions
```

### Solo desplegar índices
```bash
npx firebase deploy --only firestore:indexes
```

### Todo junto
```bash
npx firebase deploy --only functions,firestore:indexes,storage
```

### Emulador local para probar antes de desplegar
```bash
npx firebase emulators:start --only functions,firestore
```

### Scrips de migración de datos

```bash
npm i dotenv
npx tsx /scripts/file.ts
```

### Verificar que Firebase CLI reconoce el proyecto
```bash
npx firebase projects:list
```
### Ver qué va a desplegar sin ejecutar
```bash
npx firebase deploy --only functions --dry-run
```

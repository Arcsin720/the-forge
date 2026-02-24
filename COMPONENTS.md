# THE FORGE - Component Library

## Vue d'ensemble

Cette librairie de composants fournit des éléments réutilisables et cohérents pour l'interface THE FORGE. Tous les composants sont construits avec TypeScript, Next.js et TailwindCSS.

## Architecture

- **Pattern**: React forwardRef pour tous les composants
- **Styling**: TailwindCSS (dark theme)
- **Type Safety**: TypeScript interfaces pour chaque prop
- **State Management**: Context API (Toast system)

## Installation / Import

```typescript
// Import individuel
import { Button } from '@/components/Button';

// Import depuis l'index
import { Button, Card, Modal, useToast } from '@/components';
```

## Composants Disponibles

### Boutons & Contrôles

#### Button
Bouton réutilisable avec multiples variantes.

```typescript
<Button 
  variant="primary" // primary | secondary | outline | danger
  size="md"         // sm | md | lg
  isLoading={false}
  onClick={() => {}}
>
  Click me
</Button>
```

**Props:**
- `variant`: Style du bouton
- `size`: Taille (sm/md/lg)
- `isLoading`: Affiche spinner et désactive
- `disabled`: État désactivé
- `fullWidth`: Prend 100% de la largeur

#### Checkbox
Checkbox stylisé avec label optionnel.

```typescript
<Checkbox 
  checked={true}
  onChange={(checked) => {}}
  label="J'accepte"
  id="checkbox-1"
/>
```

#### Select
Dropdown sélectionnable avec clavier/souris.

```typescript
<Select
  options={[
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' }
  ]}
  value="a"
  onChange={(value) => {}}
  placeholder="Choisir..."
/>
```

---

### Cartes & Conteneurs

#### Card
Conteneur principal avec variantes.

```typescript
<Card 
  variant="default" // default | highlight | dark
  padding="md"      // sm | md | lg
>
  Contenu
</Card>
```

#### PricingCard
Carte de prix avec features list.

```typescript
<PricingCard
  id="pro"
  name="PRO"
  price="79€"
  tagline="Description"
  features={["Feature 1", "Feature 2"]}
  highlighted={true}
/>
```

#### StatCard
Affiche une statistique avec tendance.

```typescript
<StatCard
  label="Revenue"
  value={1234}
  unit="€"
  icon={<Icon />}
  trend={{ value: 15, isPositive: true }}
/>
```

#### Modal
Fenêtre modale centrée avec backdrop.

```typescript
<Modal
  isOpen={true}
  onClose={() => {}}
  title="Title"
  footer={<Button>Confirmer</Button>}
>
  Contenu
</Modal>
```

---

### Navigation & Layout

#### Breadcrumb
Navigation hiérarchique.

```typescript
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products' }
  ]}
/>
```

#### Tabs
Onglets avec contenu dynamique.

```typescript
<Tabs
  items={[
    { label: 'Tab 1', value: 'tab1', content: <div>...</div> },
    { label: 'Tab 2', value: 'tab2', content: <div>...</div> }
  ]}
  defaultValue="tab1"
  onChange={(value) => {}}
/>
```

#### Pagination
Navigation entre pages.

```typescript
<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => {}}
/>
```

#### Divider
Ligne de séparation avec label optionnel.

```typescript
<Divider label="ou" />
<Divider orientation="vertical" />
```

---

### Notifications & Feedback

#### Alert
Message d'alerte stylisé.

```typescript
<Alert
  title="Attention"
  message="Quelque chose s'est passé"
  type="warning" // success | error | warning | info
  onClose={() => {}}
/>
```

#### Toast (useToast hook)
Notifications temporaires en bas d'écran.

```typescript
const { addToast } = useToast();

addToast('Opération réussie!', 'success', 3000);
addToast('Erreur', 'error');
```

**Layout root required:**
```typescript
<ToastProvider>
  <AppShell />
  <ToastContainer />
</ToastProvider>
```

---

### Formulaires

#### FormInput
Champ de saisie avec validation.

```typescript
<FormInput
  label="Email"
  type="email"
  value={email}
  onChange={(e) => {}}
  error="Invalid email"
  hint="Utilisé pour la connexion"
/>
```

---

### Affichage

#### Badge
Badge compact pour tags/labels.

```typescript
<Badge 
  label="Nouveau"
  variant="accent" // primary | success | warning | danger | info | accent
  size="md"        // sm | md
/>
```

#### Tag
Tag removable pour filtres.

```typescript
<Tag
  label="Développement"
  variant="accent"
  onRemove={() => {}}
/>
```

#### Avatar
Avatar utilisateur/initiales.

```typescript
<Avatar
  src="/avatar.jpg"
  initials="JD"
  size="md" // sm | md | lg
/>
```

#### GradientText
Texte avec gradient.

```typescript
<GradientText variant="primary"> // primary | success | warning | danger
  Texte impactant
</GradientText>
```

#### Skeleton
Placeholder de chargement.

```typescript
<Skeleton 
  width="100%" 
  height="1rem"
  count={3}
/>
```

#### Spinner
Indicateur de chargement rotatif.

```typescript
<Spinner size="md" /> {/* sm | md | lg */}
```

#### Tooltip
Infobulle au survol.

```typescript
<Tooltip 
  content="Aide"
  position="top" // top | bottom | left | right
>
  <Button>Hover me</Button>
</Tooltip>
```

---

## Patterns Courants

### Formulaire Complet

```typescript
const [email, setEmail] = useState('');
const { addToast } = useToast();

async function handleSubmit(e) {
  e.preventDefault();
  try {
    await submitEmail(email);
    addToast('Email envoyé!', 'success');
  } catch (err) {
    addToast('Erreur: ' + err.message, 'error');
  }
}

return (
  <Card variant="highlight" padding="lg">
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="primary" type="submit">
        Soumettre
      </Button>
    </form>
  </Card>
);
```

### Modal de Confirmation

```typescript
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <Button onClick={() => setIsOpen(true)}>Supprimer</Button>
    
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Confirmation"
      footer={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      }
    >
      Êtes-vous sûr?
    </Modal>
  </>
);
```

### Page Showcase

Une page complète des composants est disponible sur `/components-showcase`.

---

## Conventions

1. **Nommage**: PascalCase pour les composants
2. **Props**: Interfaces TypeScript explicites
3. **Forwarding**: Tous les composants supportent `ref` via `forwardRef`
4. **Styling**: TailwindCSS uniquement (pas de fichiers CSS)
5. **Dark Theme**: Palettes sombre par défaut

## Couleurs Theme

- `forge-accent`: Orange principal (#EA580C)
- `forge-accentSoft`: Orange doux
- `forge-border`: Bordures discrètes
- `slate-*`: Niveaux de gris

## Responsive

Tous les composants utilisent des classes Tailwind pour la réactivité:
- `sm:`, `md:`, `lg:`, `xl:` prefixes

---

## Contribuer

Quand vous ajoutez un composant:

1. Créer le fichier `components/ComponentName.tsx`
2. Exporter depuis `components/index.ts`
3. Ajouter une interface TypeScript explicite
4. Utiliser `React.forwardRef`
5. Ajouter le composant au showcase

---

## Status (v1.0)

✅ 20+ composants produits
✅ Typage complet TypeScript
✅ Dark theme cohérent
✅ Toast system global
✅ Showcase page
⏳ Animations avancées
⏳ Storybook documentation

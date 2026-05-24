# Suppression d'inscriptions

## Fonctionnalité implémentée

Les administrateurs peuvent maintenant supprimer des inscriptions depuis l'interface admin.

## Emplacements de suppression

### 1. Depuis la liste des inscriptions (`/admin/registrations`)

**Bouton :** Icône poubelle (🗑️) rouge dans la colonne "Actions"

**Fonctionnement :**
1. Cliquer sur l'icône poubelle
2. Confirmation : "Êtes-vous sûr de vouloir supprimer l'inscription de [Prénom Nom] ?"
3. Si "OK" → Suppression et rafraîchissement automatique de la liste
4. Si "Annuler" → Aucune action

### 2. Depuis la page de détail (`/admin/registrations/[id]`)

**Bouton :** "Supprimer" rouge en haut à droite

**Fonctionnement :**
1. Cliquer sur "Supprimer"
2. Confirmation : "Êtes-vous sûr de vouloir supprimer cette inscription ?"
3. Si "OK" → Suppression et redirection vers `/admin/registrations`
4. Si "Annuler" → Aucune action

## API

### Endpoint
```
DELETE /api/registrations/[id]
```

### Implémentation
**Fichier :** `app/api/registrations/[id]/route.ts`

```typescript
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from("registrations")
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
```

**Caractéristiques :**
- ✅ Utilise `supabaseAdmin` (clé de service)
- ✅ Gestion des erreurs
- ✅ Configuration SSL pour développement
- ✅ Suppression définitive de la base de données

## Composants modifiés

### 1. Table des inscriptions
**Fichier :** `components/admin/registrations-table.tsx`

**Ajouts :**
```typescript
// Import
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// State
const [deletingId, setDeletingId] = useState<string | null>(null);

// Fonction de suppression
const handleDelete = async (id: string, name: string) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer l'inscription de ${name} ?`)) {
    return;
  }

  setDeletingId(id);
  try {
    const response = await fetch(`/api/registrations/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.refresh(); // Rafraîchit la page
    } else {
      alert("Erreur lors de la suppression");
    }
  } catch (error) {
    console.error("Error deleting registration:", error);
    alert("Erreur lors de la suppression");
  } finally {
    setDeletingId(null);
  }
};

// Colonne Actions avec bouton de suppression
{
  id: "actions",
  header: "Actions",
  cell: ({ row }) => (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={...}>
        <FileText className="h-4 w-4 mr-2" />
        PDF
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleDelete(row.original.id, `${row.original.first_name} ${row.original.last_name}`)}
        disabled={deletingId === row.original.id}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  ),
}
```

### 2. Détails d'inscription
**Fichier :** `components/admin/registration-details.tsx`

**Déjà existant :**
- Bouton "Supprimer" avec icône poubelle
- Confirmation avant suppression
- Redirection après suppression

## Interface utilisateur

### Liste des inscriptions

```
┌─────────────────────────────────────────────────────────────┐
│ Prénom │ Nom    │ Email        │ ... │ Actions            │
├─────────────────────────────────────────────────────────────┤
│ Jean   │ Dupont │ jean@...     │ ... │ [PDF] [🗑️]        │
│ Marie  │ Martin │ marie@...    │ ... │ [PDF] [🗑️]        │
└─────────────────────────────────────────────────────────────┘
```

### Page de détail

```
┌─────────────────────────────────────────────────────────────┐
│ [← Retour]                    [Modifier] [Supprimer]        │
├─────────────────────────────────────────────────────────────┤
│ Informations personnelles                                   │
│ ...                                                          │
└─────────────────────────────────────────────────────────────┘
```

## Sécurité

### Authentification requise
- ✅ Seuls les utilisateurs connectés à l'admin peuvent supprimer
- ✅ Vérification de session avant toute action

### Confirmation utilisateur
- ✅ Double confirmation (popup JavaScript)
- ✅ Message personnalisé avec le nom de la personne

### Suppression définitive
- ⚠️ **Attention :** La suppression est **DÉFINITIVE**
- ⚠️ Aucune corbeille ou récupération possible
- ⚠️ Les données sont supprimées de la base de données

## Cas d'usage

### Suppression d'une inscription test
1. Aller sur `/admin/registrations`
2. Trouver l'inscription test
3. Cliquer sur 🗑️
4. Confirmer
5. ✅ Inscription supprimée

### Suppression d'une inscription annulée
1. Filtrer par statut "Annulé"
2. Sélectionner l'inscription
3. Cliquer sur 🗑️
4. Confirmer
5. ✅ Inscription supprimée

### Suppression d'un doublon
1. Rechercher le nom de la personne
2. Identifier le doublon
3. Cliquer sur le doublon pour voir les détails
4. Vérifier que c'est bien un doublon
5. Cliquer sur "Supprimer"
6. Confirmer
7. ✅ Doublon supprimé

## Améliorations futures possibles

### Court terme
- [ ] Soft delete (marquer comme supprimé au lieu de supprimer)
- [ ] Historique des suppressions
- [ ] Raison de suppression (commentaire)

### Moyen terme
- [ ] Corbeille avec récupération possible (30 jours)
- [ ] Suppression en masse (sélection multiple)
- [ ] Export avant suppression

### Long terme
- [ ] Archivage automatique
- [ ] Audit trail complet
- [ ] Permissions granulaires (qui peut supprimer)

## Tests

### Test de suppression depuis la liste
1. Se connecter à `/admin/login`
2. Aller sur `/admin/registrations`
3. Créer une inscription test
4. Cliquer sur 🗑️ de l'inscription test
5. ✅ Vérifier la popup de confirmation
6. Confirmer
7. ✅ Vérifier que l'inscription disparaît de la liste
8. ✅ Vérifier dans Supabase que l'inscription est supprimée

### Test de suppression depuis la page de détail
1. Aller sur `/admin/registrations`
2. Cliquer sur une inscription
3. Cliquer sur "Supprimer"
4. ✅ Vérifier la popup de confirmation
5. Confirmer
6. ✅ Vérifier la redirection vers `/admin/registrations`
7. ✅ Vérifier que l'inscription n'apparaît plus

### Test d'annulation
1. Cliquer sur 🗑️
2. Cliquer sur "Annuler" dans la popup
3. ✅ Vérifier que rien ne se passe
4. ✅ Vérifier que l'inscription est toujours là

### Test de suppression en cours
1. Cliquer sur 🗑️ d'une inscription
2. Confirmer
3. ✅ Vérifier que le bouton est désactivé pendant la suppression
4. ✅ Vérifier qu'on ne peut pas cliquer plusieurs fois

## Logs et débogage

### Console navigateur
```javascript
// En cas d'erreur
Error deleting registration: {...}
```

### Console serveur
```
DELETE /api/registrations/[id]
```

### Vérification Supabase
```sql
-- Vérifier qu'une inscription a bien été supprimée
SELECT * FROM registrations WHERE id = 'xxx';
-- Résultat attendu : 0 ligne
```

## Statut
✅ **Implémenté** - La suppression d'inscriptions est fonctionnelle depuis la liste et la page de détail.

## ⚠️ Avertissement important

**La suppression est DÉFINITIVE et IRRÉVERSIBLE.**

Avant de supprimer une inscription :
1. ✅ Vérifier que c'est bien la bonne inscription
2. ✅ S'assurer qu'il n'y a pas de paiement en cours
3. ✅ Considérer l'archivage plutôt que la suppression
4. ✅ Informer la personne concernée si nécessaire

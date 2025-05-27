# Documentation Complète de Zod

## Introduction

Zod est une bibliothèque TypeScript et JavaScript permettant de définir des schémas de validation et de transformation de données. Cette documentation centralise toutes les fonctionnalités disponibles.

## 1. Types de base

### Chaînes de caractères

-   `z.string()` : Définit une chaîne de caractères.
-   `z.string().trim()` : Supprime les espaces au début et à la fin.
-   `z.string().toLowerCase()` : Convertit en minuscules.
-   `z.string().toUpperCase()` : Convertit en majuscules.
-   `z.string().length(n, message?)` : Doit avoir exactement `n` caractères.
-   `z.string().min(n, message?)` : Doit avoir au moins `n` caractères.
-   `z.string().max(n, message?)` : Ne doit pas dépasser `n` caractères.
-   `z.string().email(message?)` : Valide une adresse e-mail.
-   `z.string().url(message?)` : Valide une URL.
-   `z.string().uuid(message?)` : Valide un UUID.
-   `z.string().regex(/regex/, message?)` : Valide avec une expression régulière.
-   `z.string().cuid(message?)` : Valide un identifiant CUID.
-   `z.string().datetime(options?)` : Valide une date ISO 8601.

### Nombres

-   `z.number()` : Définit un nombre.
-   `z.number().min(n, message?)` : Minimum `n`.
-   `z.number().max(n, message?)` : Maximum `n`.
-   `z.number().positive(message?)` : Doit être positif.
-   `z.number().negative(message?)` : Doit être négatif.
-   `z.number().int(message?)` : Doit être un entier.
-   `z.number().finite(message?)` : Doit être un nombre fini.
-   `z.number().safe(message?)` : Doit être un nombre sûr (dans la plage de `Number.MAX_SAFE_INTEGER`).

### Booléens

-   `z.boolean()` : Définit un booléen (`true` ou `false`).

### Dates

-   `z.date()` : Définit une date.
-   `z.date().min(date, message?)` : Doit être après `date`.
-   `z.date().max(date, message?)` : Doit être avant `date`.

### Tableaux

-   `z.array(z.string())` : Tableau de chaînes.
-   `z.array(z.number()).min(n, message?)` : Doit contenir au moins `n` éléments.
-   `z.array(z.number()).max(n, message?)` : Ne doit pas dépasser `n` éléments.
-   `z.array(z.number()).nonempty(message?)` : Ne peut pas être vide.

### Objets

-   `z.object({ key: z.type })` : Définit un objet avec des clés et types spécifiques.
-   `z.object({ key: z.type }).partial()` : Rend toutes les clés optionnelles.
-   `z.object({ key: z.type }).required()` : Rend toutes les clés obligatoires.
-   `z.object({ key: z.type }).extend({ newKey: z.type })` : Étend un objet.

## 2. Modificateurs et transformations

-   `.default(value)` : Définit une valeur par défaut.
-   `.optional()` : Rend un champ optionnel.
-   `.nullable()` : Permet `null`.
-   `.or(z.type)` : Accepte un type alternatif.
-   `.and(z.type)` : Combine deux schémas.
-   `.transform(fn)` : Transforme la valeur.

## 3. Gestion des erreurs et messages personnalisés

-   `.refine(fn, message?)` : Validation personnalisée.
-   `.superRefine(fn)` : Validation avancée.
-   `.catch(defaultValue)` : Remplace les erreurs par une valeur par défaut.

## 4. Unions et intersections

-   `z.union([z.string(), z.number()])` : Accepte plusieurs types.
-   `z.intersection(z.type1, z.type2)` : Combine plusieurs schémas.

## 5. Enums et littéraux

-   `z.enum(["A", "B", "C"])` : Définit un enum.
-   `z.literal("valeur")` : Accepte une valeur spécifique.

## 6. Utilisation avancée

### Parse et safeParse

-   `schema.parse(data)` : Retourne les données validées ou génère une erreur.
-   `schema.safeParse(data)` : Retourne `{ success: true, data }` ou `{ success: false, error }`.

### Merging et Extension

-   `schema1.merge(schema2)` : Fusionne deux objets.
-   `schema.extend({ newKey: z.string() })` : Ajoute des propriétés à un objet.

## 7. Exemple d'utilisation

```ts
const userSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    age: z.number().min(18),
});

const result = userSchema.safeParse({
    username: "John",
    email: "john@example.com",
    age: 20,
});
console.log(result);
```

## Conclusion

Zod est une bibliothèque puissante et flexible pour la validation et transformation des données. Cette documentation résume ses fonctionnalités principales.

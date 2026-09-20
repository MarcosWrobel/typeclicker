/**
 * Script de Migração & Normalização Estrutural de Schemas (TypeClicker - Colégio Leopoldina)
 * 
 * Executa a migração em lote de documentos na coleção 'saves' para schemaVersion: 2
 * Mantém total retrocompatibilidade, garantindo que nenhum dado do aluno seja perdido.
 * 
 * Uso:
 *   npx tsx scripts/migrate-schemas.ts [--dry-run]
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

function removeUndefinedFields<T>(obj: T): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefinedFields(item)) as unknown as T;
  }
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = typeof value === 'object' && value !== null
        ? removeUndefinedFields(value)
        : value;
    }
  }
  return cleaned as T;
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function runMigration() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(`[TypeClicker Migration] Iniciando normalização de schemas... (Dry Run: ${isDryRun ? 'SIM' : 'NÃO'})`);

  try {
    const savesSnap = await getDocs(collection(db, 'saves'));
    console.log(`[TypeClicker Migration] Encontrados ${savesSnap.size} documentos de alunos.`);

    let migratedCount = 0;
    let upToDateCount = 0;
    let batch = writeBatch(db);
    let batchCount = 0;
    const commitPromises: Promise<void>[] = [];

    savesSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const currentVersion = data.schemaVersion ?? data.saveState?.schemaVersion ?? 1;

      if (currentVersion >= 2 && data.saveState?.schemaVersion === 2) {
        upToDateCount++;
        return;
      }

      const currentSave = data.saveState || {};
      const normalizedSave = {
        ...currentSave,
        schemaVersion: 2,
        flaggedForReview: currentSave.flaggedForReview ?? data.flaggedForReview ?? false,
        flagReason: currentSave.flagReason ?? data.flagReason ?? null,
        lastSyncTimestamp: currentSave.lastSyncTimestamp ?? Date.now(),
        completedChallenges: currentSave.completedChallenges || [],
        upgrades: currentSave.upgrades || {},
        correctKeys: currentSave.correctKeys || 0,
        wrongKeys: currentSave.wrongKeys || 0,
        totalActiveSeconds: currentSave.totalActiveSeconds || 0,
        prestigeCores: currentSave.prestigeCores || 0,
        prestigeCount: currentSave.prestigeCount || 0
      };

      const updatedDoc = {
        schemaVersion: 2,
        flaggedForReview: normalizedSave.flaggedForReview,
        ...(normalizedSave.flagReason ? { flagReason: normalizedSave.flagReason } : {}),
        saveState: removeUndefinedFields(normalizedSave)
      };

      if (!isDryRun) {
        batch.set(docSnap.ref, removeUndefinedFields(updatedDoc), { merge: true });
        batchCount++;

        if (batchCount >= 450) {
          commitPromises.push(batch.commit());
          batch = writeBatch(db);
          batchCount = 0;
        }
      }

      migratedCount++;
    });

    if (!isDryRun && batchCount > 0) {
      commitPromises.push(batch.commit());
    }

    if (!isDryRun) {
      await Promise.all(commitPromises);
    }

    console.log(`\n========================================`);
    console.log(`[TypeClicker Migration] RESULTADO FINAL:`);
    console.log(`- Total de documentos verificados: ${savesSnap.size}`);
    console.log(`- Documentos migrados para v2: ${migratedCount}`);
    console.log(`- Documentos que já estavam atualizados: ${upToDateCount}`);
    console.log(`========================================\n`);
    process.exit(0);
  } catch (error) {
    console.error(`[TypeClicker Migration] Erro crítico durante migração:`, error);
    process.exit(1);
  }
}

runMigration();

import { auth } from './firebaseService';

export interface FirestoreMetricsData {
  reads: {
    used: number;
    quota: number;
    percent: number;
  };
  writes: {
    used: number;
    quota: number;
    percent: number;
  };
  studentsCount: number;
  server: {
    status: 'normal' | 'warning' | 'critical';
    uptimeSeconds: number;
    memoryRssMb: number;
    environment: string;
  };
  latencyNotice: string;
  source: 'cloud_monitoring' | 'fallback_local';
  timestamp: string;
  cacheTtlSeconds: number;
  isFromCache?: boolean;
  cachedSecondsAgo?: number;
}

/**
 * Consulta as métricas oficiais de consumo do Firestore no Google Cloud Monitoring
 * e contagem agregada de alunos, com validação de token de Administrador.
 */
export async function fetchFirestoreMetrics(forceRefresh: boolean = false): Promise<FirestoreMetricsData> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Você precisa estar autenticado como administrador para visualizar as métricas.');
  }

  const token = await user.getIdToken();
  const url = `/api/admin/firestore-metrics${forceRefresh ? '?force=true' : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${response.status} ao carregar métricas.`);
  }

  return response.json();
}

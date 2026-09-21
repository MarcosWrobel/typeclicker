export interface CustomCurricularText {
  id: string;
  title: string;
  discipline: string; // Ex: 'História', 'Ciências', 'Português', 'Geografia', 'Matemática', 'Geral'
  targetTurma?: string; // Ex: 'todas', '6ºA', '8ºB'
  content: string;
  createdAt: number;
  authorName?: string;
}

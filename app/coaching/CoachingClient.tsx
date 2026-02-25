'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { useToast } from '@/components/ToastProvider';

interface TrackingData {
  id: string;
  week: number;
  createdAt: string;
  energyLevel: number;
  soreness: number;
  motivation: number;
  adherenceRate: number;
  nutritionQuality: number;
  notes?: string;
}

export default function CoachingClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const programId = searchParams.get('programId');
  const { addToast } = useToast();

  const [tracking, setTracking] = useState<TrackingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    energyLevel: 7,
    soreness: 3,
    motivation: 8,
    adherenceRate: 85,
    nutritionQuality: 7,
    notes: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const loadTracking = async () => {
      try {
        setLoading(true);
        if (!programId) {
          setError("Programme non spécifié");
          return;
        }
        const response = await fetch(`/api/coaching/tracking${programId ? `?programId=${programId}` : ''}`);
        if (!response.ok) throw new Error('Failed to load tracking');
        const data = await response.json();
        setTracking(data);
        setCurrentWeek(data.length + 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      loadTracking();
    }
  }, [status, programId]);

  const handleInputChange = (field: string, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!programId) {
      addToast("Programme non spécifié", "error");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/coaching/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId,
          week: currentWeek,
          ...formData
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }
      
      const newTracking = await response.json();
      setTracking([...tracking, newTracking]);
      setCurrentWeek(currentWeek + 1);
      setError(null);
      
      setFormData({
        energyLevel: 7,
        soreness: 3,
        motivation: 8,
        adherenceRate: 85,
        nutritionQuality: 7,
        notes: ''
      });
      
      addToast("Suivi sauvegardé avec succès", "success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setError(errorMsg);
      addToast(errorMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!programId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          Programme non spécifié. Retourne sur l’espace membre pour sélectionner un programme ELITE.
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 rounded-md bg-forge-accent px-4 py-2 text-sm font-semibold text-black"
        >
          Aller au dashboard
        </button>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="inline-block mb-4">
            <span className="px-3 py-1 bg-forge-accent/20 text-forge-accent rounded-full text-xs font-semibold">
              SUIVI ELITE
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Tracking & Progression
          </h1>
          <p className="text-slate-300">
            Suivez votre progression hebdomadaire avec auto-évaluation détaillée
          </p>
        </div>

        {error && (
          <Card className="border-red-500/30 bg-red-500/10 mb-6">
            <p className="text-red-400">{error}</p>
          </Card>
        )}

        {/* Formulaire de suivi */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Suivi Semaine {currentWeek}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grille d'auto-évaluation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Énergie */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Niveau d&apos;énergie général : {formData.energyLevel}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.energyLevel}
                  onChange={(e) => handleInputChange('energyLevel', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-forge-accent"
                />
                <p className="text-xs text-slate-400 mt-1">Comment vous sentez-vous cette semaine?</p>
              </div>

              {/* Courbatures */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Niveau de courbatures : {formData.soreness}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.soreness}
                  onChange={(e) => handleInputChange('soreness', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-forge-accent"
                />
                <p className="text-xs text-slate-400 mt-1">Fatigue musculaire ressente</p>
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Niveau de motivation : {formData.motivation}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.motivation}
                  onChange={(e) => handleInputChange('motivation', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-forge-accent"
                />
                <p className="text-xs text-slate-400 mt-1">Envie d&apos;entraînement</p>
              </div>

              {/* Adhérence */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Taux d&apos;adhérence : {formData.adherenceRate}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.adherenceRate}
                  onChange={(e) => handleInputChange('adherenceRate', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-forge-accent"
                />
                <p className="text-xs text-slate-400 mt-1">% de séances complétées</p>
              </div>

              {/* Nutrition */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-3">
                  Qualité nutritionnelle : {formData.nutritionQuality}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.nutritionQuality}
                  onChange={(e) => handleInputChange('nutritionQuality', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-forge-accent"
                />
                <p className="text-xs text-slate-400 mt-1">Respect de votre nutrition</p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Notes supplémentaires
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Observations, ajustements à faire, points positifs..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-forge-accent/50 min-h-[100px]"
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? 'Sauvegarde...' : 'Enregistrer la semaine'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/dashboard')}
              >
                Retour
              </Button>
            </div>
          </form>
        </Card>

        {/* Historique */}
        {tracking.length > 0 && (
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6">Historique du suivi</h2>
            <div className="space-y-4">
              {[...tracking].reverse().map((week) => (
                <div key={week.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white">Semaine {week.week}</h3>
                    <span className="text-xs text-slate-400">
                      {new Date(week.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Énergie</p>
                      <p className="text-lg font-bold text-forge-accent">{week.energyLevel}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Courbatures</p>
                      <p className="text-lg font-bold text-orange-400">{week.soreness}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Motivation</p>
                      <p className="text-lg font-bold text-yellow-400">{week.motivation}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Adhérence</p>
                      <p className="text-lg font-bold text-blue-400">{week.adherenceRate}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Nutrition</p>
                      <p className="text-lg font-bold text-green-400">{week.nutritionQuality}/10</p>
                    </div>
                  </div>
                  {week.notes && (
                    <p className="text-sm text-slate-300 pt-3 border-t border-slate-700/50">
                      {week.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {tracking.length === 0 && !loading && (
          <Card className="text-center py-8">
            <p className="text-slate-400 mb-4">Aucun suivi enregistré pour le moment</p>
            <p className="text-sm text-slate-500">Commencez par enregistrer votre première semaine</p>
          </Card>
        )}
      </div>
    </div>
  );
}

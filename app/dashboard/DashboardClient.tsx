"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/Spinner";

interface DashboardStats {
  totalPrograms: number;
  activePrograms: number;
  completedPrograms: number;
  totalSessions: number;
}

interface Program {
  id: string;
  name: string;
  tier: string;
  goal: string;
  level: string;
  frequency: number;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardClient() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, programsRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/programs")
        ]);

        if (!statsRes.ok || !programsRes.ok) {
          throw new Error("Erreur lors du chargement des données");
        }

        const statsData = await statsRes.json();
        const programsData = await programsRes.json();

        setStats(statsData);
        setPrograms(programsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Bienvenue {session?.user?.name || "utilisateur"}</h1>
        <p className="text-slate-400">{session?.user?.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-forge-accent/10 to-forge-accentSoft/5 border border-forge-accent/20 rounded-lg p-6 space-y-2">
          <p className="text-sm font-medium text-slate-400">Programmes</p>
          <p className="text-3xl font-bold text-forge-accent">{stats?.totalPrograms || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-6 space-y-2">
          <p className="text-sm font-medium text-slate-400">Actifs</p>
          <p className="text-3xl font-bold text-blue-400">{stats?.activePrograms || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-lg p-6 space-y-2">
          <p className="text-sm font-medium text-slate-400">Complétés</p>
          <p className="text-3xl font-bold text-green-400">{stats?.completedPrograms || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-lg p-6 space-y-2">
          <p className="text-sm font-medium text-slate-400">Séances</p>
          <p className="text-3xl font-bold text-orange-400">{stats?.totalSessions || 0}</p>
        </div>
      </div>

      {/* Programs Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Vos programmes</h2>
          <Link
            href="/pricing"
            className="text-sm font-medium text-forge-accent hover:text-forge-accentSoft transition-colors"
          >
            Nouveau programme →
          </Link>
        </div>

        {programs.length === 0 ? (
          <div className="text-center py-10 border border-forge-border/40 rounded-lg">
            <p className="text-slate-400 mb-4">Aucun programme pour le moment</p>
            <Link
              href="/pricing"
              className="inline-block px-6 py-2 rounded-md bg-forge-accent text-black font-medium hover:bg-forge-accentSoft transition-colors"
            >
              Commencer un programme
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((program) => (
              <Link
                key={program.id}
                href={`/program/${program.id}`}
                className="group border border-forge-border/40 rounded-lg p-6 hover:bg-forge-background/80 hover:border-forge-accent/40 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-forge-accent transition-colors">
                        {program.name || `Programme ${program.tier}`}
                      </h3>
                      <p className="text-xs font-medium text-forge-accent mt-1">{program.tier}</p>
                    </div>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                      {program.frequency}x/sem
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-slate-400">
                    <p>📊 Objectif: <span className="text-slate-200">{program.goal}</span></p>
                    <p>💪 Niveau: <span className="text-slate-200">{program.level}</span></p>
                  </div>

                  {program.tier === "ELITE" && (
                    <Link
                      href={`/coaching?programId=${program.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block text-xs font-medium text-forge-accent hover:text-forge-accentSoft transition-colors mt-2"
                    >
                      Voir le suivi →
                    </Link>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

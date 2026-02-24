"use client";

import { useState } from 'react';
import {
  Button,
  Card,
  Badge,
  Alert,
  Checkbox,
  Select,
  Tag,
  Avatar,
  GradientText,
  Spinner,
  Skeleton,
  Tabs,
  Pagination,
  Tooltip,
  Divider,
} from '@/components';

export default function ComponentsShowcase() {
  const [selectedValue, setSelectedValue] = useState('option1');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 space-y-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          <GradientText>Composants Réutilisables</GradientText>
        </h1>
        <p className="text-slate-400">Système de composants pour THE FORGE</p>
      </section>

      {/* Buttons */}
      <Card variant="highlight">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Boutons</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" isLoading>Chargement...</Button>
            <Button variant="primary" disabled>Désactivé</Button>
          </div>
        </div>
      </Card>

      {/* Badges & Tags */}
      <Card variant="highlight">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Badges et Tags</h2>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge label="Primary" />
              <Badge label="Success" variant="success" />
              <Badge label="Warning" variant="warning" />
              <Badge label="Danger" variant="danger" />
              <Badge label="Accent" variant="accent" size="md" />
            </div>
            <Divider label="Tags" />
            <div className="flex flex-wrap gap-2">
              <Tag label="Développement" variant="accent" onRemove={() => {}} />
              <Tag label="Production" variant="success" />
              <Tag label="Maintenance" variant="warning" onRemove={() => {}} />
            </div>
          </div>
        </div>
      </Card>

      {/* Form Controls */}
      <Card variant="highlight">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Contrôles Formulaire</h2>
          <div className="space-y-4">
            <Checkbox label="J'accepte les conditions" />
            <Select
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' }
              ]}
              value={selectedValue}
              onChange={(value) => setSelectedValue(value as string)}
            />
          </div>
        </div>
      </Card>

      {/* Alerts */}
      <Card variant="highlight">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Alertes</h2>
          {isAlertVisible && (
            <Alert
              title="Information"
              message="Ceci est un message d'alerte informatif"
              type="info"
              onClose={() => setIsAlertVisible(false)}
            />
          )}
          <Alert
            title="Succès"
            message="L'opération s'est déroulée avec succès"
            type="success"
          />
          <Alert
            title="Avertissement"
            message="Veuillez faire attention à cette action"
            type="warning"
          />
          <Alert
            title="Erreur"
            message="Une erreur s'est produite"
            type="error"
          />
        </div>
      </Card>

      {/* Typography */}
      <Card variant="highlight">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Typographie</h2>
          <div className="space-y-3">
            <p className="text-xl"><GradientText>Gradient Text Primary</GradientText></p>
            <p className="text-xl"><GradientText variant="success">Gradient Text Success</GradientText></p>
            <p className="text-xl"><GradientText variant="danger">Gradient Text Danger</GradientText></p>
          </div>
        </div>
      </Card>

      {/* Loading States */}
      <Card variant="highlight">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">États de Chargement</h2>
          <div className="flex gap-4">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
          <Divider />
          <div className="space-y-3">
            <Skeleton height="1rem" count={3} />
          </div>
        </div>
      </Card>

      {/* User Info */}
      <Card variant="highlight">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Avatars</h2>
          <div className="flex gap-4">
            <Avatar size="sm" initials="TF" />
            <Avatar size="md" initials="AB" />
            <Avatar size="lg" initials="XYZ" />
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card variant="highlight">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Onglets</h2>
          <Tabs
            items={[
              {
                label: 'Onglet 1',
                value: 'tab1',
                content: <p className="text-slate-300">Contenu de l&apos;onglet 1</p>
              },
              {
                label: 'Onglet 2',
                value: 'tab2',
                content: <p className="text-slate-300">Contenu de l&apos;onglet 2</p>
              },
              {
                label: 'Onglet 3',
                value: 'tab3',
                content: <p className="text-slate-300">Contenu de l&apos;onglet 3</p>
              }
            ]}
          />
        </div>
      </Card>

      {/* Pagination */}
      <Card variant="highlight">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Pagination</h2>
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
          />
          <p className="text-sm text-slate-400">Page {currentPage} de 10</p>
        </div>
      </Card>

      {/* Tooltips */}
      <Card variant="highlight">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Tooltips</h2>
          <div className="flex gap-4 flex-wrap">
            <Tooltip content="Ceci est un tooltip" position="top">
              <Button variant="secondary" size="sm">Top</Button>
            </Tooltip>
            <Tooltip content="Ceci est un tooltip" position="bottom">
              <Button variant="secondary" size="sm">Bottom</Button>
            </Tooltip>
            <Tooltip content="Ceci est un tooltip" position="left">
              <Button variant="secondary" size="sm">Left</Button>
            </Tooltip>
            <Tooltip content="Ceci est un tooltip" position="right">
              <Button variant="secondary" size="sm">Right</Button>
            </Tooltip>
          </div>
        </div>
      </Card>
    </main>
  );
}

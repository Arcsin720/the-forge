export type ProgramInput = {
  goal: string;
  level: string;
  frequency: string;
  tier: "BASIC" | "PRO" | "ELITE";
};

export type GeneratedProgram = {
  contentText: string;
  nutritionText?: string;
  youtubeLinks: string[];
};

export function generateProgram(input: ProgramInput): GeneratedProgram {
  const header = [
    "PROGRAMME FORGE",
    `Objectif: ${input.goal}`,
    `Niveau: ${input.level}`,
    `Fréquence: ${input.frequency} séances / semaine`,
    ""
  ].join("\n");

  const baseBlocks = [
    "Bloc 1: Activation",
    "- 5 à 10 min de mobilité générale",
    "- 2 séries de 15 reps d'un exercice de gainage",
    "",
    "Bloc 2: Force principale",
    "- 3 à 5 séries sur les mouvements fondamentaux",
    "- Repos 90 à 150 secondes entre les séries",
    "",
    "Bloc 3: Volume ciblé",
    "- 2 à 4 exercices d'isolation liés à l'objectif",
    "- 10 à 15 reps, repos 60 à 90 secondes",
    "",
    "Bloc 4: Finish",
    "- 5 à 10 min de travail métabolique ou cardio"
  ].join("\n");

  let contentText = `${header}${baseBlocks}`;
  let nutritionText: string | undefined;
  const youtubeLinks: string[] = [];

  if (input.tier === "PRO" || input.tier === "ELITE") {
    nutritionText = [
      "NUTRITION FORGE",
      "",
      "- 1,6 à 2 g de protéines par kg de poids de corps",
      "- 2 à 3 g de glucides par kg selon le niveau d'activité",
      "- Lipides majoritairement issus de sources non transformées",
      "- Hydratation: 35 à 45 ml d'eau par kg de poids de corps",
      "",
      "Structuration des repas:",
      "- 3 à 4 repas principaux répartis sur la journée",
      "- 20 à 40 g de protéines complètes par repas",
      "- Carbohydrates plus concentrés autour de l'entraînement"
    ].join("\n");

    youtubeLinks.push(
      "https://www.youtube.com/results?search_query=mobility+routine",
      "https://www.youtube.com/results?search_query=full+body+strength+workout",
      "https://www.youtube.com/results?search_query=core+workout+routine"
    );
  }

  if (input.tier === "ELITE") {
    contentText += [
      "",
      "",
      "ELITE TRACKING",
      "- Logue chaque séance dans ton dashboard /coaching",
      "- Note charge, RPE, et ressenti global en fin de séance"
    ].join("\n");
  }

  return {
    contentText,
    nutritionText,
    youtubeLinks
  };
}

import { prisma } from "@/lib/prisma";
import { generateProgram, type ProgramInput } from "@/lib/programGenerator";

export async function createProgramForUser(
  userId: string,
  input: ProgramInput,
  stripeCheckoutId: string
) {
  const generated = generateProgram(input);

  const program = await prisma.program.create({
    data: {
      userId,
      tier: input.tier,
      goal: input.goal,
      level: input.level,
      frequency: input.frequency,
      contentText: generated.contentText,
      nutritionText: generated.nutritionText ?? null,
      youtubeLinks: generated.youtubeLinks,
      stripeCheckoutId
    }
  });

  return program;
}

export async function getProgramForUser(programId: string, userId: string) {
  const program = await prisma.program.findFirst({
    where: {
      id: programId,
      userId
    }
  });

  return program;
}


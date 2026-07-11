/**
 * FixIt — database seed (chapters + chunks)
 *
 * Populates the Chapter and Chunk tables so /api/chapters and /api/chunks
 * return real content. Content is derived from the FixIt textbook set.
 * Embeddings are NOT seeded here — run the AI embedding step separately to
 * enable /api/retrieve (semantic search).
 *
 * Run:   pnpm --filter @fixit/db db:seed
 *   or:  cd packages/db && node prisma/seed.mjs
 * Idempotent: chapters are upserted by `number`; their chunks are replaced.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CHAPTERS = [
  {
    "number": 1,
    "title": "Class XII Computer Science",
    "subject": "Computer Science",
    "grade": "Class 12",
    "chunks": [
      {
        "sectionRef": "1.1",
        "content": "Stack Study Guide: Linear collections and their order constraints.",
        "tokenCount": 17
      },
      {
        "sectionRef": "1.2",
        "content": "A stack is a fundamental data structure constrained by the LIFO order policy. This stands for \"Last In, First Out\", meaning elements are inserted and extracted from the same end, called the \"top\".",
        "tokenCount": 49
      },
      {
        "sectionRef": "1.3",
        "content": "When we want to insert a new piece of data onto a stack, we execute a push operation. This increases the stack size by one and sets the new item as the active top element.",
        "tokenCount": 43
      },
      {
        "sectionRef": "1.4",
        "content": "Conversely, to extract or delete the most recently added item, we perform a pop operation. This retrieves the top value and updates the top index downward.",
        "tokenCount": 39
      },
      {
        "sectionRef": "1.5",
        "content": "It is critical to check constraints during stack usage. If we attempt to append an item to a stack that is full, we cause a stack overflow error, which can halt program execution.",
        "tokenCount": 45
      }
    ]
  },
  {
    "number": 2,
    "title": "Class XI Biology",
    "subject": "Biology",
    "grade": "Class 11",
    "chunks": [
      {
        "sectionRef": "2.1",
        "content": "Cell biology overview: Basic structures and classification.",
        "tokenCount": 15
      },
      {
        "sectionRef": "2.2",
        "content": "The cell is the basic structural and functional unit of all living organisms. Cells are classified by complexity. A prokaryotic cell is characterized by the absence of a true, membrane-bound nucleus and membrane-bound organelles.",
        "tokenCount": 58
      },
      {
        "sectionRef": "2.3",
        "content": "In contrast, a complex eukaryotic cell contains a clear, membrane-bound nucleus housing its genetic material, alongside specialized compartments.",
        "tokenCount": 37
      },
      {
        "sectionRef": "2.4",
        "content": "One of the most important organelles in eukaryotic cells is the mitochondria. Often referred to as the 'powerhouse of the cell', it produces adenosine triphosphate (ATP) through aerobic cellular respiration.",
        "tokenCount": 52
      },
      {
        "sectionRef": "2.5",
        "content": "Another critical cell component is the ribosomes. Found in both cell types, these granular structures lack membranes and serve as the cellular machinery for translating genetic codes into proteins.",
        "tokenCount": 50
      }
    ]
  },
  {
    "number": 3,
    "title": "Class X Biology",
    "subject": "Biology",
    "grade": "Class 10",
    "chunks": [
      {
        "sectionRef": "3.1",
        "content": "Respiration study card: Gas exchange and energy production.",
        "tokenCount": 15
      },
      {
        "sectionRef": "3.2",
        "content": "Energy generation inside cells occurs in two main ways. When respiration occurs in the complete absence of oxygen, it is classified as anaerobic respiration.",
        "tokenCount": 40
      },
      {
        "sectionRef": "3.3",
        "content": "In cells that utilize oxygen, glucose breakdown terminates inside the mitochondria, leading to a higher yield of ATP energy compared to anaerobic paths.",
        "tokenCount": 38
      },
      {
        "sectionRef": "3.4",
        "content": "For gaseous exchange, the human lungs contain millions of small balloon-like sacs called alveoli. Their thin walls are heavily lined with blood capillaries to transfer gases.",
        "tokenCount": 44
      },
      {
        "sectionRef": "3.5",
        "content": "To transport oxygen from lungs to body cells, blood contains a red respiratory pigment called hemoglobin. It has a very high affinity for oxygen.",
        "tokenCount": 37
      }
    ]
  },
  {
    "number": 4,
    "title": "Class XII Biology",
    "subject": "Biology",
    "grade": "Class 12",
    "chunks": [
      {
        "sectionRef": "4.1",
        "content": "NCERT Biology Class XII Curriculum Overview.",
        "tokenCount": 11
      },
      {
        "sectionRef": "4.2",
        "content": "The Class XII curriculum begins with Unit VI: Reproduction. This unit covers vital biological processes across four core chapters, including reproduction in organisms and flowering plants.",
        "tokenCount": 47
      },
      {
        "sectionRef": "4.3",
        "content": "Following reproduction, Unit VII focuses on Genetics and Evolution, outlining the molecular basis of inheritance and variation principles.",
        "tokenCount": 35
      },
      {
        "sectionRef": "4.4",
        "content": "Unit VI Introduction: Reproduction principles.",
        "tokenCount": 12
      },
      {
        "sectionRef": "4.5",
        "content": "While individual organisms die, species continue to survive for millions of years. This continuity is driven by reproduction, which allows offspring creation via asexual or sexual modes.",
        "tokenCount": 47
      },
      {
        "sectionRef": "4.6",
        "content": "Sexual reproduction introduces new variants, which can provide significant survival advantages to species under environmental pressures.",
        "tokenCount": 34
      },
      {
        "sectionRef": "4.7",
        "content": "Profile of Panchanan Maheshwari: Pioneer Botanist.",
        "tokenCount": 13
      },
      {
        "sectionRef": "4.8",
        "content": "Panchanan Maheshwari was an exceptionally distinguished Indian botanist who popularized the use of embryological characters in plant taxonomy.",
        "tokenCount": 36
      },
      {
        "sectionRef": "4.9",
        "content": "He achieved worldwide acclaim for establishing research in test-tube fertilization and immature embryo culture, a major landmark in plant biotechnology.",
        "tokenCount": 38
      },
      {
        "sectionRef": "4.10",
        "content": "Lifespans and Species Continuity.",
        "tokenCount": 9
      },
      {
        "sectionRef": "4.11",
        "content": "The period from birth to natural death represents an organism's lifespan. Organism lifespans are not correlated with size; for example, crows and parrots have different lifespans despite similar sizes.",
        "tokenCount": 51
      },
      {
        "sectionRef": "4.12",
        "content": "Death of every individual is certain, meaning no individual is immortal, except for single-celled organisms, which reproduce by division.",
        "tokenCount": 35
      },
      {
        "sectionRef": "4.13",
        "content": "The Cycle of Birth, Growth, and Death.",
        "tokenCount": 10
      },
      {
        "sectionRef": "4.14",
        "content": "Reproduction is a biological process where an organism gives rise to offspring similar to itself. This establishes a continuous cycle of birth, growth, and death.",
        "tokenCount": 41
      },
      {
        "sectionRef": "4.15",
        "content": "Reproduction is classified into two types: asexual reproduction (single parent, no gamete fusion) and sexual reproduction (two parents, fusion of gametes).",
        "tokenCount": 39
      },
      {
        "sectionRef": "4.16",
        "content": "Asexual Reproduction and Clones.",
        "tokenCount": 8
      },
      {
        "sectionRef": "4.17",
        "content": "A single parent is capable of producing offspring. The resulting individuals are genetically identical, which is why we call them a clone.",
        "tokenCount": 35
      },
      {
        "sectionRef": "4.18",
        "content": "In unicellular organisms like yeast, reproduction occurs via unequal division or budding, where small buds pinch off the parent cell.",
        "tokenCount": 34
      },
      {
        "sectionRef": "4.19",
        "content": "Asexual Reproductive Structures.",
        "tokenCount": 8
      },
      {
        "sectionRef": "4.20",
        "content": "Simple organisms like algae reproduce via specialized motile structures called zoospores, which are microscopic and flagellated.",
        "tokenCount": 32
      },
      {
        "sectionRef": "4.21",
        "content": "Other common structures include conidia in Penicillium, buds in Hydra, and internal gemmules in sponges.",
        "tokenCount": 26
      },
      {
        "sectionRef": "4.22",
        "content": "Vegetative Propagation in Plants.",
        "tokenCount": 9
      },
      {
        "sectionRef": "4.23",
        "content": "In plants, asexual reproduction is termed vegetative propagation. The structures involved, like runners or rhizomes, are called propagules.",
        "tokenCount": 35
      },
      {
        "sectionRef": "4.24",
        "content": "Common examples include the eyes of potato tubers, the rhizome of ginger, and offsets of water hyacinth.",
        "tokenCount": 26
      },
      {
        "sectionRef": "4.25",
        "content": "Vegetative structures in Angiosperms.",
        "tokenCount": 10
      },
      {
        "sectionRef": "4.26",
        "content": "In bryophyllum, adventitious buds arise from notches along leaf margins. When these leaves fall, buds grow into independent plants, a form of vegetative growth.",
        "tokenCount": 40
      },
      {
        "sectionRef": "4.27",
        "content": "Water hyacinth, an aquatic plant often called the \"Terror of Bengal\", spreads rapidly through water bodies using offsets.",
        "tokenCount": 31
      },
      {
        "sectionRef": "4.28",
        "content": "Because vegetative propagation does not involve two parents, it is classified under asexual processes.",
        "tokenCount": 26
      },
      {
        "sectionRef": "4.29",
        "content": "This mode allows uniform, rapid multiplication, maintaining identical genetic profiles or clones of high-yield crops.",
        "tokenCount": 30
      }
    ]
  }
];

async function main() {
  console.log(`Seeding ${CHAPTERS.length} chapters…`);
  for (const ch of CHAPTERS) {
    const chapter = await prisma.chapter.upsert({
      where: { number: ch.number },
      update: { title: ch.title, subject: ch.subject, grade: ch.grade },
      create: { number: ch.number, title: ch.title, subject: ch.subject, grade: ch.grade },
    });
    // Replace this chapter's chunks so re-running stays clean
    await prisma.chunk.deleteMany({ where: { chapterId: chapter.id } });
    if (ch.chunks.length) {
      await prisma.chunk.createMany({
        data: ch.chunks.map((c) => ({
          chapterId: chapter.id,
          sectionRef: c.sectionRef,
          content: c.content,
          tokenCount: c.tokenCount,
        })),
      });
    }
    console.log(`  ✓ Ch ${ch.number} "${ch.title}" — ${ch.chunks.length} chunks`);
  }
  const [chapters, chunks] = await Promise.all([prisma.chapter.count(), prisma.chunk.count()]);
  console.log(`Done. chapters=${chapters} chunks=${chunks}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

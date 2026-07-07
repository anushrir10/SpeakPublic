export const textbooks = [
  {
    id: "cs-12",
    title: "Class XII Computer Science",
    subject: "Computer Science",
    grade: "Class 12",
    board: "CBSE (NCERT)",
    coverColor: "from-[#2C3E50] to-[#1A252F]",
    spineColor: "bg-[#111A24]",
    author: "NCERT Editorial Board",
    pages: [
      {
        pageNumber: 1,
        title: "Data Structures: Stacks",
        imageUrl: "/cs_class12_page.png",
        originalText: `
          <h3>CHAPTER 3: DATA STRUCTURES - STACKS</h3>
          <p class="mb-4">In computer science, a stack is a linear data structure that follows a specific order in which elements are added and removed. We witness stacks in everyday life: a stack of plates, a stack of books, or a deck of cards.</p>
          <h4 class="font-bold text-lg border-b border-[#ebdcb9] pb-1 mt-4 mb-2">3.1 Stack Operations</h4>
          <p class="mb-4">The defining rule of a stack is the <strong>LIFO</strong> principle. This means the last element placed on the stack is the first one to be taken off. There are two primary operations associated with a stack:
          <ul class="list-disc pl-5 mb-4">
            <li><strong>Push</strong>: Adding an element to the top of the stack.</li>
            <li><strong>Pop</strong>: Removing an element from the top of the stack.</li>
          </ul>
          </p>
          <p class="mb-4">If we try to perform a push operation on a stack that is already at its maximum capacity, we trigger a stack <strong>overflow</strong> condition, which is a common memory or runtime error in stack management.</p>
        `,
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg text-slate-800">Stack Study Guide: Linear collections and their order constraints.</p>
          <p class="mb-4 leading-relaxed">
            A stack is a fundamental data structure constrained by the {LIFO} order policy. This stands for "Last In, First Out", meaning elements are inserted and extracted from the same end, called the "top".
          </p>
          <p class="mb-4 leading-relaxed">
            When we want to insert a new piece of data onto a stack, we execute a {push} operation. This increases the stack size by one and sets the new item as the active top element.
          </p>
          <p class="mb-4 leading-relaxed">
            Conversely, to extract or delete the most recently added item, we perform a {pop} operation. This retrieves the top value and updates the top index downward.
          </p>
          <p class="mb-4 leading-relaxed">
            It is critical to check constraints during stack usage. If we attempt to append an item to a stack that is full, we cause a stack {overflow} error, which can halt program execution.
          </p>
        `,
        concepts: {
          "LIFO": {
            term: "LIFO (Last In, First Out)",
            definition: "LIFO is an acronym for Last In, First Out. It is a data management model where the element that is inserted last into the structure is the very first one to be removed.",
            flashcard: {
              front: "What does the acronym LIFO stand for and which data structure uses it?",
              back: "Last In, First Out. It is the defining operational rule of Stacks, where insertions and deletions occur at the same end."
            },
            mcq: {
              question: "Which of the following data structures operates on the LIFO principle?",
              options: [
                "Queue",
                "Stack",
                "Binary Tree",
                "Linked List"
              ],
              correctIndex: 1,
              explanation: "A Stack inserts and removes items from the top only, which satisfies the Last In, First Out (LIFO) model."
            }
          },
          "push": {
            term: "Push Operation",
            definition: "The push operation inserts a new element at the top of the stack. It updates the stack pointer and stores the new data item.",
            flashcard: {
              front: "What is the primary action of a 'push' operation?",
              back: "It inserts a new data element onto the top of the stack, incrementing the stack pointer."
            },
            mcq: {
              question: "What happens to the stack top index after a successful push operation?",
              options: [
                "It decreases by one",
                "It remains unchanged",
                "It increases by one",
                "It resets to zero"
              ],
              correctIndex: 2,
              explanation: "Pushing an element adds it to the top, so the top index increases by one to point to the new top element."
            }
          },
          "pop": {
            term: "Pop Operation",
            definition: "The pop operation removes the element at the top of the stack. It returns the top value and decrements the stack pointer.",
            flashcard: {
              front: "What does a 'pop' operation return and how does it change the stack?",
              back: "It returns the element currently at the top of the stack and removes it from the collection, decrementing the stack pointer."
            },
            mcq: {
              question: "If a stack has elements [A, B, C] (C is top) and we perform a pop operation, what is returned?",
              options: [
                "A",
                "B",
                "C",
                "Null"
              ],
              correctIndex: 2,
              explanation: "C is at the top of the stack. A pop operation removes and returns the top element, which is C."
            }
          },
          "overflow": {
            term: "Stack Overflow",
            definition: "Stack Overflow is an error condition that occurs when a program attempts to push a new item onto a stack that has already reached its maximum allocated size or capacity.",
            flashcard: {
              front: "Explain the difference between stack overflow and stack underflow.",
              back: "Overflow happens when pushing to a full stack. Underflow happens when popping from an empty stack."
            },
            mcq: {
              question: "Pushing an item onto a full stack results in which error state?",
              options: [
                "Stack Underflow",
                "Stack Overflow",
                "Index Out of Bounds",
                "Memory Corruption"
              ],
              correctIndex: 1,
              explanation: "Stack Overflow is the precise term for trying to add items to a stack that has exceeded its size limits."
            }
          }
        }
      }
    ]
  },
  {
    id: "bio-11",
    title: "Class XI Biology",
    subject: "Biology",
    grade: "Class 11",
    board: "CBSE (NCERT)",
    coverColor: "from-[#155E37] to-[#0A331C]",
    spineColor: "bg-[#051C0F]",
    author: "NCERT Editorial Board",
    pages: [
      {
        pageNumber: 1,
        title: "Cell: The Unit of Life",
        imageUrl: "/biology_class11_page.png",
        originalText: `
          <h3>CHAPTER 8: CELL - THE UNIT OF LIFE</h3>
          <p class="mb-4">When you look around, you see both living and non-living things. You must have wondered and asked yourself - 'what is it that makes an organism living, or what is it that an inanimate thing does not have which a living thing has?' The answer to this is the presence of the basic unit of life - the cell in all living organisms.</p>
          <h4 class="font-bold text-lg border-b border-[#ebdcb9] pb-1 mt-4 mb-2">8.1 What is a Cell?</h4>
          <p class="mb-4">Organisms are either unicellular or multicellular. Anton von Leeuwenhoek first saw and described a live cell. Cells are divided into two main categories based on structural complexity: <strong>prokaryotic</strong> cells, which lack a nuclear membrane, and <strong>eukaryotic</strong> cells, which contain a well-defined membrane-bound nucleus.</p>
          <p class="mb-4">Inside cells, organelle structures carry out critical metabolic jobs. The <strong>mitochondria</strong> are double-membrane bound powerhouses responsible for generating cellular ATP. Scattered in the cytoplasm, tiny non-membrane bound particles called <strong>ribosomes</strong> are the sites of protein synthesis.</p>
        `,
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg text-slate-800">Cell biology overview: Basic structures and classification.</p>
          <p class="mb-4 leading-relaxed">
            The cell is the basic structural and functional unit of all living organisms. Cells are classified by complexity. A {prokaryotic} cell is characterized by the absence of a true, membrane-bound nucleus and membrane-bound organelles.
          </p>
          <p class="mb-4 leading-relaxed">
            In contrast, a complex {eukaryotic} cell contains a clear, membrane-bound nucleus housing its genetic material, alongside specialized compartments.
          </p>
          <p class="mb-4 leading-relaxed">
            One of the most important organelles in eukaryotic cells is the {mitochondria}. Often referred to as the 'powerhouse of the cell', it produces adenosine triphosphate (ATP) through aerobic cellular respiration.
          </p>
          <p class="mb-4 leading-relaxed">
            Another critical cell component is the {ribosomes}. Found in both cell types, these granular structures lack membranes and serve as the cellular machinery for translating genetic codes into proteins.
          </p>
        `,
        concepts: {
          "prokaryotic": {
            term: "Prokaryotic Cell",
            definition: "A prokaryotic cell is a simple, single-celled organism that lacks a distinct membrane-bound nucleus and membrane-bound organelles. Bacterial cells are typical prokaryotes.",
            flashcard: {
              front: "What is the key defining feature of prokaryotic cells?",
              back: "They lack a membrane-bound nucleus. Their genetic material (DNA) lies exposed in a region called the nucleoid."
            },
            mcq: {
              question: "Which of the following organisms is prokaryotic?",
              options: [
                "Amoeba",
                "Onion cell",
                "Escherichia coli (Bacterium)",
                "Yeast"
              ],
              correctIndex: 2,
              explanation: "Bacteria (like E. coli) are prokaryotes, while Amoeba, plants, and Yeast are eukaryotic."
            }
          },
          "eukaryotic": {
            term: "Eukaryotic Cell",
            definition: "A eukaryotic cell is a complex cell characterized by having a well-defined membrane-bound nucleus that encloses its genetic material, along with specialized membrane-bound organelles like Golgi bodies and mitochondria.",
            flashcard: {
              front: "Name three structures found in eukaryotic cells but absent in prokaryotes.",
              back: "A nuclear membrane, mitochondria, Golgi apparatus, and endoplasmic reticulum."
            },
            mcq: {
              question: "Where is genetic material stored in a eukaryotic cell?",
              options: [
                "Free-floating in the cytoplasm",
                "Inside a membrane-bound nucleus",
                "Within ribosomes",
                "Inside vacuole walls"
              ],
              correctIndex: 1,
              explanation: "Eukaryotic cells keep their DNA inside a double-membrane bound compartment called the nucleus."
            }
          },
          "mitochondria": {
            term: "Mitochondria",
            definition: "Mitochondria are double-membrane bound organelles found in most eukaryotic organisms. They generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
            flashcard: {
              front: "Why are mitochondria referred to as the powerhouses of the cell?",
              back: "They perform aerobic cellular respiration, which converts nutrients into ATP, the cell's energy currency."
            },
            mcq: {
              question: "Which chemical energy unit is generated inside the mitochondria?",
              options: [
                "Glucose",
                "ADP",
                "ATP",
                "DNA"
              ],
              correctIndex: 2,
              explanation: "Mitochondria synthesize Adenosine Triphosphate (ATP), which acts as the energetic fuel for cellular work."
            }
          },
          "ribosomes": {
            term: "Ribosomes",
            definition: "Ribosomes are minute, non-membrane bound organelle structures composed of RNA and proteins. They are the sites where genetic translation occurs to synthesize proteins.",
            flashcard: {
              front: "What is the primary function of ribosomes?",
              back: "Protein synthesis. They read mRNA sequences and assemble amino acids into polypeptide chains."
            },
            mcq: {
              question: "Ribosomes are responsible for which cellular function?",
              options: [
                "Photosynthesis",
                "Lipid digestion",
                "Protein synthesis",
                "DNA replication"
              ],
              correctIndex: 2,
              explanation: "Ribosomes read mRNA codes and translate them, acting as the sites for protein synthesis."
            }
          }
        }
      }
    ]
  },
  {
    id: "bio-10",
    title: "Class X Biology",
    subject: "Biology",
    grade: "Class 10",
    board: "CBSE (NCERT)",
    coverColor: "from-[#8E44AD] to-[#713393]",
    spineColor: "bg-[#4D1D69]",
    author: "NCERT Editorial Board",
    pages: [
      {
        pageNumber: 1,
        title: "Life Processes: Respiration",
        imageUrl: "/biology_class10_page.png",
        originalText: `
          <h3>CHAPTER 6: LIFE PROCESSES - RESPIRATION</h3>
          <p class="mb-4">We have discussed nutrition in organisms. The food material taken in during nutrition is used in cells to provide energy for various life processes. Diverse organisms do this in different ways - some use oxygen, while some do it without using oxygen.</p>
          <h4 class="font-bold text-lg border-b border-[#ebdcb9] pb-1 mt-4 mb-2">6.1 Aerobic vs Anaerobic Processes</h4>
          <p class="mb-4">Respiration can occur without oxygen in some simple organisms (like yeast). This process is known as <strong>anaerobic</strong> respiration. It produces ethanol and carbon dioxide. In human cells, when oxygen is abundant, glucose is fully oxidized inside the <strong>mitochondria</strong> to release water, CO₂, and a large quantity of energy.</p>
          <h4 class="font-bold text-lg border-b border-[#ebdcb9] pb-1 mt-4 mb-2">6.2 Human Respiratory System</h4>
          <p class="mb-4">In humans, air is taken in through nostrils. The passage of air goes down to the lungs. Inside the lungs, the passage divides into smaller tubes which terminate in balloon-like structures called <strong>alveoli</strong>. These provide a surface where exchange of gases takes place. The red pigment in blood, <strong>hemoglobin</strong>, binds to oxygen and carries it to body tissues.</p>
        `,
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg text-slate-800">Respiration study card: Gas exchange and energy production.</p>
          <p class="mb-4 leading-relaxed">
            Energy generation inside cells occurs in two main ways. When respiration occurs in the complete absence of oxygen, it is classified as {anaerobic} respiration.
          </p>
          <p class="mb-4 leading-relaxed">
            In cells that utilize oxygen, glucose breakdown terminates inside the {mitochondria}, leading to a higher yield of ATP energy compared to anaerobic paths.
          </p>
          <p class="mb-4 leading-relaxed">
            For gaseous exchange, the human lungs contain millions of small balloon-like sacs called {alveoli}. Their thin walls are heavily lined with blood capillaries to transfer gases.
          </p>
          <p class="mb-4 leading-relaxed">
            To transport oxygen from lungs to body cells, blood contains a red respiratory pigment called {hemoglobin}. It has a very high affinity for oxygen.
          </p>
        `,
        concepts: {
          "anaerobic": {
            term: "Anaerobic Respiration",
            definition: "Anaerobic respiration is the breakdown of glucose to release energy in the absence of oxygen. It occurs in yeast and human muscle cells during heavy exercise.",
            flashcard: {
              front: "What are the products of anaerobic respiration in yeast?",
              back: "Ethanol (alcohol), carbon dioxide, and a small amount of energy (2 ATP)."
            },
            mcq: {
              question: "Respiration in the absence of oxygen is called?",
              options: [
                "Aerobic respiration",
                "Anaerobic respiration",
                "Photosynthesis",
                "Transpiration"
              ],
              correctIndex: 1,
              explanation: "Respiration without oxygen is anaerobic respiration. Respiration with oxygen is aerobic respiration."
            }
          },
          "mitochondria": {
            term: "Mitochondria",
            definition: "Mitochondria are double-membrane bound organelles where aerobic cellular respiration takes place, yielding the majority of energy (ATP) for cell metabolism.",
            flashcard: {
              front: "In which cell organelle does aerobic respiration take place?",
              back: "Inside the mitochondria, where glucose breakdown products are fully oxidized using oxygen."
            },
            mcq: {
              question: "Where in a cell is pyruvate broken down to CO2, water and energy during aerobic respiration?",
              options: [
                "Cytoplasm",
                "Mitochondria",
                "Chloroplast",
                "Ribosomes"
              ],
              correctIndex: 1,
              explanation: "Pyruvate oxidation and Krebs Cycle reactions occur in the mitochondria during aerobic respiration."
            }
          },
          "alveoli": {
            term: "Alveoli",
            definition: "Alveoli are tiny balloon-like structures at the end of bronchioles in human lungs. They provide an extensive, thin surface area for the exchange of oxygen and carbon dioxide with blood capillaries.",
            flashcard: {
              front: "What is the function of alveoli in the human respiratory system?",
              back: "They provide a very thin, vascularized surface area for the exchange of respiratory gases between air and blood."
            },
            mcq: {
              question: "Which structure inside human lungs provides the surface for gaseous exchange?",
              options: [
                "Bronchi",
                "Trachea",
                "Alveoli",
                "Nostrils"
              ],
              correctIndex: 2,
              explanation: "Alveoli are the final gas-exchange units in lungs, providing a thin respiratory membrane."
            }
          },
          "hemoglobin": {
            term: "Hemoglobin",
            definition: "Hemoglobin is an iron-rich protein pigment present in red blood cells that binds oxygen reversibly in the lungs and carries it to all body cells and tissues.",
            flashcard: {
              front: "Why does blood appear red and how does it transport oxygen?",
              back: "Due to hemoglobin, an iron-containing respiratory pigment which binds to oxygen and carries it throughout the body."
            },
            mcq: {
              question: "Which respiratory pigment has a high affinity for oxygen in humans?",
              options: [
                "Chlorophyll",
                "Hemoglobin",
                "Melanin",
                "Myoglobin"
              ],
              correctIndex: 1,
              explanation: "Hemoglobin is the primary respiratory pigment in human blood that transports oxygen."
            }
          }
        }
      }
    ]
  },
  {
    id: "bio-12",
    title: "Class XII Biology",
    subject: "Biology",
    grade: "Class 12",
    board: "CBSE (NCERT)",
    coverColor: "from-[#27AE60] to-[#1E8449]",
    spineColor: "bg-[#145A32]",
    author: "NCERT Editorial Board",
    pages: [
      {
        pageNumber: 1,
        title: "Table of Contents",
        imageUrl: "/bio12/page-001.png",
        originalText: "<h3>NCERT Class XII Biology Contents</h3>",
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg text-slate-800">NCERT Biology Class XII Curriculum Overview.</p>
          <p class="mb-4 leading-relaxed">
            The Class XII curriculum begins with Unit VI: {Reproduction}. This unit covers vital biological processes across four core chapters, including reproduction in organisms and flowering plants.
          </p>
          <p class="mb-4 leading-relaxed">
            Following reproduction, Unit VII focuses on {Genetics} and Evolution, outlining the molecular basis of inheritance and variation principles.
          </p>
        `,
        concepts: {
          "reproduction": {
            term: "Reproduction",
            definition: "Reproduction is a fundamental biological process by which an organism produces offspring similar to itself, ensuring species continuity.",
            flashcard: {
              front: "What is the primary evolutionary role of reproduction?",
              back: "It ensures species continuity across generations and introduces genetic variations through sexual modes."
            },
            mcq: {
              question: "Reproduction is crucial because it ensures:",
              options: [
                "Species continuity",
                "Individual immortality",
                "Photosynthetic efficiency",
                "Zero cell division"
              ],
              correctIndex: 0,
              explanation: "Reproduction enables species to survive and continue generation after generation."
            }
          },
          "genetics": {
            term: "Genetics",
            definition: "Genetics is the branch of biology concerned with the study of genes, genetic variation, and heredity in organisms.",
            flashcard: {
              front: "What is the main focus of genetics in Class XII Biology?",
              back: "Heredity, inheritance patterns, genetic variation, and the molecular basis of genetic inheritance."
            },
            mcq: {
              question: "Genetics is the study of:",
              options: [
                "Heredity and variation",
                "Cell structure only",
                "Fossil structures",
                "Respiration pathways"
              ],
              correctIndex: 0,
              explanation: "Genetics explores how traits are passed down (heredity) and the differences between individuals (variation)."
            }
          }
        }
      },
      {
        pageNumber: 2,
        title: "Unit VI Intro: Reproduction",
        imageUrl: "/bio12/page-002.png",
        originalText: "<h3>Unit VI: Reproduction</h3>",
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg text-slate-800">Unit VI Introduction: Reproduction principles.</p>
          <p class="mb-4 leading-relaxed">
            While individual organisms die, species continue to survive for millions of years. This continuity is driven by {reproduction}, which allows offspring creation via asexual or sexual modes.
          </p>
          <p class="mb-4 leading-relaxed">
            Sexual reproduction introduces new {variants}, which can provide significant survival advantages to species under environmental pressures.
          </p>
        `,
        concepts: {
          "reproduction": {
            term: "Reproduction",
            definition: "Reproduction is the process by which living organisms leave progeny, maintaining genetic transfer.",
            flashcard: {
              front: "Name the two primary modes of reproduction.",
              back: "Asexual reproduction (involving a single parent) and Sexual reproduction (involving fusion of gametes)."
            },
            mcq: {
              question: "Which reproduction mode yields greater genetic diversity?",
              options: [
                "Asexual reproduction",
                "Sexual reproduction",
                "Budding",
                "Binary fission"
              ],
              correctIndex: 1,
              explanation: "Sexual reproduction involves gametic fusion from two parents, creating new genetic combinations and variants."
            }
          },
          "variants": {
            term: "Variants",
            definition: "Variants are individuals with genetic differences from their parents, often carrying traits that offer survival benefits.",
            flashcard: {
              front: "How do new variants arise in populations?",
              back: "Primarily through genetic recombination during sexual reproduction, mutation, and chromosomal crossing over."
            },
            mcq: {
              question: "What is the primary evolutionary advantage of producing variants?",
              options: [
                "Slower cell division",
                "Enhanced survival advantage",
                "Clonal reproduction",
                "Reduced mutation rates"
              ],
              correctIndex: 1,
              explanation: "Genetic variants have different adaptations, increasing the likelihood that some members of a species survive environmental changes."
            }
          }
        }
      },
      {
        pageNumber: 3,
        title: "Scientist Profile: P. Maheshwari",
        imageUrl: "/bio12/page-003.png",
        originalText: "<h3>Panchanan Maheshwari (1904-1966)</h3>",
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg text-slate-800">Profile of Panchanan Maheshwari: Pioneer Botanist.</p>
          <p class="mb-4 leading-relaxed">
            Panchanan Maheshwari was an exceptionally distinguished Indian botanist who popularized the use of embryological characters in plant {taxonomy}.
          </p>
          <p class="mb-4 leading-relaxed">
            He achieved worldwide acclaim for establishing research in test-tube fertilization and immature {embryo} culture, a major landmark in plant biotechnology.
          </p>
        `,
        concepts: {
          "taxonomy": {
            term: "Taxonomy",
            definition: "Taxonomy is the science of naming, describing, and classifying organisms, including plants and animals.",
            flashcard: {
              front: "How did Maheshwari contribute to plant taxonomy?",
              back: "He popularized using embryological characters as taxonomic markers to classify plants."
            },
            mcq: {
              question: "Maheshwari integrated which field into taxonomy?",
              options: [
                "Embryology",
                "Fossil dating",
                "Aerospace botany",
                "Marine ecology"
              ],
              correctIndex: 0,
              explanation: "Maheshwari popularized the application of embryological traits for resolving taxonomic classifications."
            }
          },
          "embryo": {
            term: "Embryo Culture",
            definition: "Embryo culture is a tissue culture technique that isolates and grows immature or mature embryos in vitro to obtain viable plants.",
            flashcard: {
              front: "What tissue culture technique did Maheshwari pioneer?",
              back: "The artificial culture of immature embryos and test-tube fertilization of angiosperms."
            },
            mcq: {
              question: "Artificial embryological growth is known as:",
              options: [
                "Embryo culture",
                "Binary fission",
                "Asexual budding",
                "Grafting"
              ],
              correctIndex: 0,
              explanation: "Embryo culture is the specialized in-vitro cultivation of immature embryos to overcome fertilization barriers."
            }
          }
        }
      },
      {
        pageNumber: 4,
        title: "Chapter 1: Life Span",
        imageUrl: "/bio12/page-004.png",
        originalText: "<h3>Chapter 1: Reproduction in Organisms</h3>",
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg text-slate-800">Lifespans and Species Continuity.</p>
          <p class="mb-4 leading-relaxed">
            The period from birth to natural death represents an organism's {lifespan}. Organism lifespans are not correlated with size; for example, crows and parrots have different lifespans despite similar sizes.
          </p>
          <p class="mb-4 leading-relaxed">
            Death of every individual is certain, meaning no individual is {immortal}, except for single-celled organisms, which reproduce by division.
          </p>
        `,
        concepts: {
          "lifespan": {
            term: "Lifespan",
            definition: "Lifespan is the duration of time from the birth of an organism to its natural death.",
            flashcard: {
              front: "Are animal lifespans directly proportional to their physical size?",
              back: "No. For example, a crow lives about 15 years while a parrot lives up to 140 years, despite having similar sizes."
            },
            mcq: {
              question: "The period from birth to natural death is called:",
              options: [
                "Growth cycle",
                "Lifespan",
                "Metabolic rate",
                "Evolutionary span"
              ],
              correctIndex: 1,
              explanation: "The lifespan represents the total period from an organism's birth to its natural death."
            }
          },
          "immortal": {
            term: "Biological Immortality",
            definition: "Immortal in biology refers to organisms that do not experience natural senescence death, typically because the parent cell continues living by dividing.",
            flashcard: {
              front: "Why are single-celled organisms considered biologically immortal?",
              back: "Because they reproduce by binary fission, where the parent cell splits to form two daughter cells, avoiding natural death."
            },
            mcq: {
              question: "Which of the following organisms are considered biologically immortal?",
              options: [
                "Unicellular organisms",
                "Multicellular mammals",
                "Flowering trees",
                "Bony fish"
              ],
              correctIndex: 0,
              explanation: "Single-celled organisms divide symmetrically, meaning there is no residual dead parent body, making them immortal."
            }
          }
        }
      },
      {
        pageNumber: 5,
        title: "Reproduction Cycle",
        imageUrl: "/bio12/page-005.png",
        originalText: "<h3>Reproduction Definition</h3>",
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg text-slate-800">The Cycle of Birth, Growth, and Death.</p>
          <p class="mb-4 leading-relaxed">
            Reproduction is a biological process where an organism gives rise to offspring similar to itself. This establishes a continuous cycle of {birth}, growth, and death.
          </p>
          <p class="mb-4 leading-relaxed">
            Reproduction is classified into two types: {asexual} reproduction (single parent, no gamete fusion) and sexual reproduction (two parents, fusion of gametes).
          </p>
        `,
        concepts: {
          "birth": {
            term: "Birth-Growth-Death Cycle",
            definition: "The cycle of birth, growth, maturation, reproduction, and eventual death that ensures species continuity across generations.",
            flashcard: {
              front: "What is the ecological purpose of the birth-growth-death cycle?",
              back: "It maintains steady population dynamics and ensures species continue to exist generation after generation."
            },
            mcq: {
              question: "The biological mechanism ensuring species continuity across generations is:",
              options: [
                "Respiration",
                "Reproduction",
                "Digestion",
                "Excretion"
              ],
              correctIndex: 1,
              explanation: "Reproduction is the specific biological process responsible for species survival and continuity."
            }
          },
          "asexual": {
            term: "Asexual Reproduction",
            definition: "Asexual reproduction is the production of offspring by a single parent without the fusion of male and female gametes.",
            flashcard: {
              front: "What is a major characteristic of asexual offspring?",
              back: "They are genetically and morphologically identical to the parent, forming a clone."
            },
            mcq: {
              question: "Offspring produced by a single parent without gametic fusion are called:",
              options: [
                "Zygotes",
                "Clones",
                "Hybrids",
                "Mutants"
              ],
              correctIndex: 1,
              explanation: "Asexual reproduction produces genetically identical clones of the parent."
            }
          }
        }
      },
      {
        pageNumber: 6,
        title: "Asexual & Clones",
        imageUrl: "/bio12/page-006.png",
        originalText: "<h3>Asexual Reproduction</h3>",
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg text-slate-800">Asexual Reproduction and Clones.</p>
          <p class="mb-4 leading-relaxed">
            A single parent is capable of producing offspring. The resulting individuals are genetically identical, which is why we call them a {clone}.
          </p>
          <p class="mb-4 leading-relaxed">
            In unicellular organisms like yeast, reproduction occurs via unequal division or {budding}, where small buds pinch off the parent cell.
          </p>
        `,
        concepts: {
          "clone": {
            term: "Clone",
            definition: "A clone is a group of morphologically and genetically identical individuals derived from a single parent.",
            flashcard: {
              front: "Define a clone in biological terms.",
              back: "A group of organisms that are morphologically and genetically identical to each other and their parent."
            },
            mcq: {
              question: "Which term describes morphologically and genetically identical individuals?",
              options: [
                "Clones",
                "Siblings",
                "Species",
                "Cohorts"
              ],
              correctIndex: 0,
              explanation: "Clones represent genetic duplicates formed via asexual replication."
            }
          },
          "budding": {
            term: "Budding",
            definition: "Budding is an asexual reproduction method where a new organism develops from an outgrowth or bud on the parent cell due to cell division.",
            flashcard: {
              front: "Describe yeast budding.",
              back: "The cell undergoes unequal division, forming a small bud that remains attached initially before separating to mature."
            },
            mcq: {
              question: "Yeast reproduces asexually through which process?",
              options: [
                "Sporulation",
                "Binary fission",
                "Budding",
                "Fragmentation"
              ],
              correctIndex: 2,
              explanation: "Budding is the specific method of unequal cell division found in yeast."
            }
          }
        }
      },
      {
        pageNumber: 7,
        title: "Asexual Structures",
        imageUrl: "/bio12/page-007.png",
        originalText: "<h3>Asexual Structures</h3>",
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg text-slate-800">Asexual Reproductive Structures.</p>
          <p class="mb-4 leading-relaxed">
            Simple organisms like algae reproduce via specialized motile structures called {zoospores}, which are microscopic and flagellated.
          </p>
          <p class="mb-4 leading-relaxed">
            Other common structures include {conidia} in Penicillium, buds in Hydra, and internal gemmules in sponges.
          </p>
        `,
        concepts: {
          "zoospores": {
            term: "Zoospores",
            definition: "Zoospores are microscopic, motile asexual spores produced by certain algae and fungi, using flagella for movement.",
            flashcard: {
              front: "What flagellated asexual structure is common in Chlamydomonas?",
              back: "Zoospores. They are microscopic motile spores that germinate into new individuals."
            },
            mcq: {
              question: "Zoospores are characterized by being:",
              options: [
                "Non-motile and thick-walled",
                "Microscopic and motile",
                "Large seed structures",
                "Multi-parent zygotes"
              ],
              correctIndex: 1,
              explanation: "Zoospores are microscopic asexual spores capable of independent motility using flagella."
            }
          },
          "conidia": {
            term: "Conidia",
            definition: "Conidia are non-motile asexual spores formed at the tips of specialized hyphae in fungi like Penicillium.",
            flashcard: {
              front: "Name the asexual reproductive spore structure of Penicillium.",
              back: "Conidia. They are non-motile spores produced exogenously in chains."
            },
            mcq: {
              question: "Penicillium reproduces asexually using which structure?",
              options: [
                "Zoospores",
                "Conidia",
                "Gemmules",
                "Buds"
              ],
              correctIndex: 1,
              explanation: "Conidia are the signature asexual spores of the Penicillium genus."
            }
          }
        }
      },
      {
        pageNumber: 8,
        title: "Vegetative Propagules",
        imageUrl: "/bio12/page-008.png",
        originalText: "<h3>Vegetative Propagation</h3>",
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg text-slate-800">Vegetative Propagation in Plants.</p>
          <p class="mb-4 leading-relaxed">
            In plants, asexual reproduction is termed vegetative propagation. The structures involved, like runners or rhizomes, are called {propagules}.
          </p>
          <p class="mb-4 leading-relaxed">
            Common examples include the eyes of potato tubers, the {rhizome} of ginger, and offsets of water hyacinth.
          </p>
        `,
        concepts: {
          "propagules": {
            term: "Vegetative Propagules",
            definition: "Vegetative propagules are plant units or structures, such as runners, rhizomes, suckers, tubers, or offsets, that can give rise to a new offspring plant.",
            flashcard: {
              front: "What is a vegetative propagule?",
              back: "Any vegetative plant part capable of growing into a complete new plant (e.g., potato eye, ginger rhizome)."
            },
            mcq: {
              question: "Which of the following is NOT a vegetative propagule?",
              options: [
                "Runner",
                "Rhizome",
                "Zygote",
                "Tuber"
              ],
              correctIndex: 2,
              explanation: "A zygote is a sexual fertilization cell, whereas runners, rhizomes, and tubers are asexual vegetative propagules."
            }
          },
          "rhizome": {
            term: "Rhizome",
            definition: "A rhizome is a continuously growing horizontal underground stem that puts out lateral shoots and adventitious roots, seen in ginger and banana.",
            flashcard: {
              front: "What propagule structure does Ginger use to multiply?",
              back: "A rhizome, which is an underground horizontal stem bearing nodes and buds."
            },
            mcq: {
              question: "Ginger propagates vegetative shoots from its:",
              options: [
                "Rhizome",
                "Bulbil",
                "Offset",
                "Runner"
              ],
              correctIndex: 0,
              explanation: "Ginger uses underground rhizomes for horizontal vegetative spread."
            }
          }
        }
      },
      {
        pageNumber: 9,
        title: "Vegetative Mechanisms",
        imageUrl: "/bio12/page-009.png",
        originalText: "<h3>Vegetative Mechanics</h3>",
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg text-slate-800">Vegetative structures in Angiosperms.</p>
          <p class="mb-4 leading-relaxed">
            In bryophyllum, adventitious buds arise from notches along leaf margins. When these leaves fall, buds grow into independent plants, a form of {vegetative} growth.
          </p>
          <p class="mb-4 leading-relaxed">
            Water hyacinth, an aquatic plant often called the "Terror of Bengal", spreads rapidly through water bodies using {offsets}.
          </p>
        `,
        concepts: {
          "vegetative": {
            term: "Vegetative Reproduction",
            definition: "Vegetative reproduction is an asexual propagation mode where new plant individuals emerge from vegetative structures rather than seeds.",
            flashcard: {
              front: "Where do adventitious buds form in Bryophyllum?",
              back: "Along the notches at the margins of the leaves. They drop off to form new plantlets."
            },
            mcq: {
              question: "Bryophyllum propagates new plantlets from its:",
              options: [
                "Roots",
                "Stems",
                "Leaf margins",
                "Flowers"
              ],
              correctIndex: 2,
              explanation: "Bryophyllum leaves contain adventitious buds along their margins that grow into new plants."
            }
          },
          "offsets": {
            term: "Offsets",
            definition: "An offset is a short horizontal branch arising from the axis of leaves, producing a cluster of leaves at the apex and roots below, common in water hyacinth.",
            flashcard: {
              front: "How does the 'Terror of Bengal' (Water Hyacinth) propagate so quickly?",
              back: "Through offsets, which are sub-aerial stems that propagate horizontally on the water surface."
            },
            mcq: {
              question: "Water hyacinth propagates using which vegetative structure?",
              options: [
                "Offsets",
                "Rhizomes",
                "Bulbils",
                "Runners"
              ],
              correctIndex: 0,
              explanation: "Offsets allow rapid lateral cloning and spread of water hyacinth over standing water."
            }
          }
        }
      },
      {
        pageNumber: 10,
        title: "Asexual Summary",
        imageUrl: "/bio12/page-010.png",
        originalText: "<h3>Asexual Process Summary</h3>",
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg text-slate-800">Asexual Reproduction Summary.</p>
          <p class="mb-4 leading-relaxed">
            Because vegetative propagation does not involve two parents, it is classified under {asexual} processes.
          </p>
          <p class="mb-4 leading-relaxed">
            This mode allows uniform, rapid multiplication, maintaining identical genetic profiles or {clones} of high-yield crops.
          </p>
        `,
        concepts: {
          "asexual": {
            term: "Asexual Propagation",
            definition: "Asexual propagation is the production of new plants using vegetative parts, preserving maternal genetic characteristics.",
            flashcard: {
              front: "What is the primary agricultural advantage of asexual propagation?",
              back: "It preserves desired traits of the parent crop exactly, avoiding the segregation of genes seen in sexual seeds."
            },
            mcq: {
              question: "Agricultural vegetative propagation is popular because it:",
              options: [
                "Maintains parental genetic traits",
                "Increases mutation rates",
                "Produces hybrid seeds",
                "Forces double fertilization"
              ],
              correctIndex: 0,
              explanation: "Vegetative propagation results in genetic clones, preserving high-yielding maternal plant traits perfectly."
            }
          },
          "clones": {
            term: "Clones",
            definition: "Clones are identical cell populations or organisms generated from a single progenitor, sharing an identical nuclear genome.",
            flashcard: {
              front: "Why are plants grown from cuttings called clones?",
              back: "Because they are vegetative replicates of the donor plant, sharing 100% of its genome without modification."
            },
            mcq: {
              question: "Plants raised from stem cuttings represent:",
              options: [
                "Clones",
                "Hybrids",
                "F1 variants",
                "Polyploids"
              ],
              correctIndex: 0,
              explanation: "Stem cuttings propagate plants mitotically, resulting in morphological and genetic duplicates (clones)."
            }
          }
        }
      }
    ]
  }
];

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
    isPdf: true,
    pdfUrl: "/bio11-split.pdf",
    pages: [
      // ──────────────────────────────────────────────
      // CHAPTER 1: THE LIVING WORLD (Pages 1–9 from kebo101.pdf)
      // ──────────────────────────────────────────────
      {
        pageNumber: 1,
        title: "The Living World — Unit Opener & Overview",
        imageUrl: "/kebo101/page_01.png",
        originalText: `
          <h3>CHAPTER 1: THE LIVING WORLD</h3>
          <p class="mb-4">Biology is the science of life forms and living processes. The living world comprises an amazing diversity of living organisms. Early man could easily perceive the difference between inanimate matter and living organisms. Early man deified some of the inanimate matter (wind, sea, fire etc.) and some of the animals, and even trees.</p>
          <p class="mb-4">This is a reflection of the state of mind where early man was bewildered and humbled by the seemingly magical and wondrous aspects of the living world.</p>
          <p class="mb-4">A dog and a mango tree are both living things; a stone and a cup are non-living. But what property makes a dog or a mango tree a living thing? The most obvious and technically complicated answer to this question would be that living things are self-replicating, evolving and self-regulating interactive systems capable of responding to external stimuli.</p>
        `,
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg">Chapter 1: The Living World — Biology as the science of life.</p>
          <p class="mb-4 leading-relaxed">
            {Biology} is the science of life forms and living processes. The living world comprises an amazing diversity of organisms. Early humans perceived the difference between inanimate matter and living organisms, often deifying natural forces.
          </p>
          <p class="mb-4 leading-relaxed">
            The living world shows remarkable {diversity} — from microscopic bacteria to giant blue whales and towering sequoia trees. All of these share certain fundamental properties that define what it means to be alive.
          </p>
          <p class="mb-4 leading-relaxed">
            Living things are characterised as self-replicating, evolving, and self-regulating interactive systems capable of responding to external stimuli. Non-living things lack these properties of {metabolism}, growth, and reproduction.
          </p>
        `,
        concepts: {
          "Biology": {
            term: "Biology",
            definition: "Biology is the scientific study of life and living organisms, including their structure, function, growth, origin, evolution, and distribution. The word comes from the Greek 'bios' (life) and 'logos' (study).",
            flashcard: {
              front: "What is Biology and what does it study?",
              back: "Biology is the science of life forms and living processes — it studies the structure, function, growth, origin, evolution, and distribution of all living organisms."
            },
            mcq: {
              question: "Which of the following best describes Biology?",
              options: [
                "Study of chemicals and their reactions",
                "Science of life forms and living processes",
                "Study of planets and celestial bodies",
                "Science of rocks and minerals"
              ],
              correctIndex: 1,
              explanation: "Biology (from Greek 'bios' = life, 'logos' = study) is the science of life forms and living processes."
            }
          },
          "diversity": {
            term: "Diversity of Life",
            definition: "Biodiversity refers to the variety of life on Earth, encompassing millions of species of plants, animals, fungi, and microorganisms. The living world shows remarkable diversity in size, habitat, structure, and physiology.",
            flashcard: {
              front: "What does the diversity of living organisms on Earth encompass?",
              back: "It includes millions of species varying in size (from bacteria to blue whales), habitat (deserts to deep oceans), structure, and physiology. This variety is studied under biodiversity."
            },
            mcq: {
              question: "Approximately how many species have been identified and named on Earth so far?",
              options: [
                "About 1 million",
                "About 1.7–1.8 million",
                "About 5 million",
                "About 10 million"
              ],
              correctIndex: 1,
              explanation: "Around 1.7–1.8 million species have been named and described, though the actual number on Earth is estimated to be far higher."
            }
          },
          "metabolism": {
            term: "Metabolism",
            definition: "Metabolism is the sum total of all chemical reactions occurring in a living body. It includes anabolic (building) and catabolic (breaking down) reactions. Metabolism is a defining property of life — non-living things do not show metabolism.",
            flashcard: {
              front: "What is metabolism and why is it a defining property of life?",
              back: "Metabolism is the sum total of all chemical reactions in a living body (anabolism + catabolism). It is a unique property of living organisms — no non-living object is metabolically active."
            },
            mcq: {
              question: "Which of the following is NOT a characteristic unique to living organisms?",
              options: [
                "Metabolism",
                "Growth",
                "Crystallization",
                "Response to stimuli"
              ],
              correctIndex: 2,
              explanation: "Crystallization occurs in non-living matter (e.g., salt crystals). Metabolism, growth (from inside), and response to stimuli are unique to living organisms."
            }
          }
        }
      },
      {
        pageNumber: 2,
        title: "The Living World — Ernst Mayr (1904–2004)",
        imageUrl: "/kebo101/page_02.png",
        originalText: `
          <h3>ERNST MAYR — The Darwin of the 20th Century</h3>
          <p class="mb-4">Born on 5 July 1904, in Kempten, Germany, ERNST MAYR, the Harvard University evolutionary biologist who has been called 'The Darwin of the 20th century', was one of the 100 greatest scientists of all time.</p>
          <p class="mb-4">Mayr joined Harvard's Faculty of Arts and Sciences in 1953 and retired in 1975, assuming the title Professor Emeritus. Through his nearly 80-year career, his research spanned ornithology, taxonomy, zoogeography, evolution, systematics, and the history and philosophy of biology.</p>
          <p class="mb-4">He almost single-handedly made the origin of species diversity the central question of evolutionary biology that it is today. He also pioneered the currently accepted definition of a biological species.</p>
        `,
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg">Ernst Mayr — Pioneer of evolutionary biology and the biological species concept.</p>
          <p class="mb-4 leading-relaxed">
            Ernst Mayr (1904–2005) was a Harvard evolutionary biologist called 'The Darwin of the 20th century'. His research covered ornithology, {taxonomy}, zoogeography, evolution, systematics, and philosophy of biology.
          </p>
          <p class="mb-4 leading-relaxed">
            Mayr pioneered the currently accepted definition of a {species} — a group of interbreeding natural populations that are reproductively isolated from other such groups. This became the cornerstone of modern evolutionary biology.
          </p>
          <p class="mb-4 leading-relaxed">
            He was awarded three prizes widely regarded as the Nobel Prize of biology: the Balzan Prize in 1983, the International Prize for Biology in 1994, and the Crafoord Prize in 1999.
          </p>
        `,
        concepts: {
          "taxonomy": {
            term: "Taxonomy",
            definition: "Taxonomy is the branch of biology that deals with the identification, nomenclature (naming), and classification of organisms. It establishes rules and principles to group organisms based on shared characteristics.",
            flashcard: {
              front: "What are the three main activities of Taxonomy?",
              back: "1. Identification — recognising and describing an organism. 2. Nomenclature — giving it a scientific name. 3. Classification — grouping it with similar organisms in a hierarchical system."
            },
            mcq: {
              question: "Taxonomy involves which of the following activities?",
              options: [
                "Identification, nomenclature, and classification",
                "Dissection, staining, and microscopy",
                "Fermentation, cloning, and culturing",
                "Mutation, crossbreeding, and selection"
              ],
              correctIndex: 0,
              explanation: "Taxonomy covers three main activities: identification of organisms, giving them scientific names (nomenclature), and classifying them into groups."
            }
          },
          "species": {
            term: "Species",
            definition: "A species is a group of individual organisms with fundamental similarities, which can interbreed among themselves and produce fertile offspring, but are reproductively isolated from other such groups. It is the basic unit of classification.",
            flashcard: {
              front: "Define 'species' according to the biological species concept.",
              back: "A species is a group of interbreeding natural populations that share fundamental morphological similarities and are reproductively isolated from other such groups."
            },
            mcq: {
              question: "Which of the following is the correct definition of a species?",
              options: [
                "All organisms that look similar",
                "Organisms that live in the same area",
                "A group sharing fundamental similarities that can interbreed and produce fertile offspring",
                "Any group of animals in a kingdom"
              ],
              correctIndex: 2,
              explanation: "A species consists of organisms with fundamental similarities that interbreed among themselves to produce fertile offspring, and are reproductively isolated from others."
            }
          }
        }
      },
      {
        pageNumber: 3,
        title: "The Living World — Introduction & Diversity (1.1)",
        imageUrl: "/kebo101/page_03.png",
        originalText: `
          <h3>1.1 WHAT IS 'LIVING'?</h3>
          <p class="mb-4">How wonderful is the living world! The wide range of living types is amazing. The extraordinary habitats in which we find living organisms, be it cold mountains, deciduous forests, oceans, fresh water lakes, deserts or hot springs, leave us speechless.</p>
          <p class="mb-4">The beauty of a galloping horse, of the migrating birds, the valley of flowers, or the attacking shark evokes awe and a deep sense of wonder. The living world comprises plants, animals, fungi, microorganisms and all other life forms.</p>
          <p class="mb-4">When we try to define 'living', we conventionally look for the common properties among all organisms. The most obvious and apparently simple property that one associates with living beings is their ability to respond to external stimuli — be it heat, light, touch, chemicals etc.</p>
          <p class="mb-4">All living organisms are aware of their environment. Even unicellular organisms respond to stimuli. Plants also respond to stimuli (they move their roots toward water and stems toward light). Consciousness, therefore, is the defining property of living organisms.</p>
        `,
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg">What is Living? — Defining characteristics of living organisms.</p>
          <p class="mb-4 leading-relaxed">
            Living organisms occupy every habitat on Earth — from freezing mountains to boiling hot springs. What unites them is a set of defining characteristics. The most fundamental is {consciousness} — the ability to sense and respond to the environment.
          </p>
          <p class="mb-4 leading-relaxed">
            Growth is another characteristic: living organisms grow by the addition of new cells from inside ({growth}). Non-living objects may grow too (like a crystal) but only by addition of material on the outside — not from within.
          </p>
          <p class="mb-4 leading-relaxed">
            Living organisms also exhibit {reproduction} — the ability to produce offspring similar to themselves. Reproduction is not essential for individual survival but is necessary for the perpetuation of the species.
          </p>
        `,
        concepts: {
          "consciousness": {
            term: "Consciousness",
            definition: "Consciousness is the ability of a living organism to sense and respond to its environment. It is the defining property of all living organisms — from bacteria to human beings. All organisms respond to stimuli such as light, heat, touch, gravity, and chemicals.",
            flashcard: {
              front: "Why is 'consciousness' considered the defining characteristic of living organisms?",
              back: "Because ALL living organisms — even unicellular ones — sense and respond to external stimuli (light, heat, chemicals etc.). This awareness of the environment (consciousness) distinguishes living from non-living matter."
            },
            mcq: {
              question: "Which of the following is the defining characteristic that distinguishes all living organisms from non-living matter?",
              options: [
                "Ability to grow in size",
                "Presence of carbon compounds",
                "Consciousness — the ability to sense and respond to stimuli",
                "Ability to reproduce sexually"
              ],
              correctIndex: 2,
              explanation: "Consciousness (response to external stimuli) is considered the defining property of life, shared by all living organisms from unicellular bacteria to complex animals."
            }
          },
          "growth": {
            term: "Growth in Living Organisms",
            definition: "In living organisms, growth is an internal process — new cells are added from within. This is called intussusception. In contrast, non-living objects like crystals grow by apposition (addition of material from outside). Growth in living organisms is self-regulated.",
            flashcard: {
              front: "How is growth in living organisms different from growth in non-living things?",
              back: "Living organisms grow by intussusception — new cells are added from inside the organism. Non-living things (like crystals) grow by apposition — material is added from outside the surface."
            },
            mcq: {
              question: "A crystal increasing in size is an example of growth. Why is this NOT considered the same as growth in living organisms?",
              options: [
                "Crystals do not contain carbon",
                "Crystal growth is by apposition (from outside), not from within",
                "Crystals cannot reproduce",
                "Crystals do not consume energy"
              ],
              correctIndex: 1,
              explanation: "Living organisms grow by intussusception (from within — new cells added). Crystals grow by apposition — material deposits on the outer surface. Hence crystal growth is not biological growth."
            }
          },
          "reproduction": {
            term: "Reproduction",
            definition: "Reproduction is the biological process by which an organism gives rise to offspring similar to itself. It can be asexual (single parent, e.g., budding in Hydra) or sexual (two parents, fusion of gametes). Reproduction is considered essential for perpetuation of species, not for individual survival.",
            flashcard: {
              front: "Is reproduction absolutely essential for an individual living organism? Explain.",
              back: "No — some organisms like mules and worker bees cannot reproduce yet are living. Reproduction is essential for the continuation of the SPECIES, not for individual survival. Hence it cannot be the sole defining criterion of life."
            },
            mcq: {
              question: "Which of the following organisms is alive but cannot reproduce?",
              options: [
                "Amoeba",
                "Yeast",
                "Worker bee (sterile)",
                "Bacteria"
              ],
              correctIndex: 2,
              explanation: "Worker bees are sterile and cannot reproduce, yet they are clearly living organisms. This shows that reproduction, while important for species survival, is not absolutely necessary for individual life."
            }
          }
        }
      },
      {
        pageNumber: 4,
        title: "The Living World — Nomenclature & Binomial Names",
        imageUrl: "/kebo101/page_04.png",
        originalText: `
          <h3>DIVERSITY IN THE LIVING WORLD</h3>
          <p class="mb-4">As stated earlier, there are millions of plants and animals in the world. We know the plants and animals in our own area by their local names. These local names differ from place to place within a country and across countries. For convenience in communication, a system was devised where each organism would be given a scientific name.</p>
          <p class="mb-4">Scientific names are universally accepted and used by biologists all over the world. This system of naming is called nomenclature. Since it is not possible to study all living organisms, it is necessary to devise some means to make the study of various life forms easier. This is done by classification.</p>
          <p class="mb-4">Taxonomy or classification is not a single step process but involves a hierarchy of steps in which each step represents a rank or category. Since the category is a part of overall taxonomic arrangement, it is called a taxonomic category.</p>
        `,
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg">Diversity & Classification — Why we need a universal naming system.</p>
          <p class="mb-4 leading-relaxed">
            With millions of species on Earth, a universally accepted system of naming — {nomenclature} — is essential. Local names differ from region to region, so scientific names provide a common language for biologists worldwide.
          </p>
          <p class="mb-4 leading-relaxed">
            Organisms that share similar characteristics are placed into groups — this process is called {classification}. Classification is not a single step but a hierarchical process involving categories (taxa) arranged from most specific to most general.
          </p>
          <p class="mb-4 leading-relaxed">
            The study of classification, naming, and identification of organisms is called {systematics}. The word 'systematics' comes from the Latin word 'systema' — meaning systematic arrangement of organisms. Systematics was first used by Carolus Linnaeus.
          </p>
        `,
        concepts: {
          "nomenclature": {
            term: "Nomenclature",
            definition: "Nomenclature is the process of standardising the naming of living organisms such that a particular organism is known by the same name all over the world. The scientific name is universal, unlike local or common names which vary by region.",
            flashcard: {
              front: "What is nomenclature and why is it necessary?",
              back: "Nomenclature is the standardised system of naming organisms. It is necessary because local/common names differ from place to place — a universal scientific name ensures biologists worldwide can communicate about the same organism without confusion."
            },
            mcq: {
              question: "Which of the following is the need for a universal system of nomenclature?",
              options: [
                "To make biology more complex",
                "Because local names differ from region to region causing confusion",
                "To replace common names permanently",
                "To rename all organisms every decade"
              ],
              correctIndex: 1,
              explanation: "Local/common names for organisms differ across regions and countries, causing confusion. Nomenclature provides a universal scientific name, recognised globally."
            }
          },
          "classification": {
            term: "Classification",
            definition: "Classification is the process of grouping organisms into convenient categories (taxa) based on observable characteristics. It makes the study of the vast diversity of life easier and more systematic.",
            flashcard: {
              front: "What is biological classification and why is it useful?",
              back: "Classification is grouping organisms into hierarchical categories (taxa) based on shared characters. It helps manage the enormous diversity of life, makes organisms easier to study, and reveals evolutionary relationships."
            },
            mcq: {
              question: "Classification is necessary because:",
              options: [
                "All organisms look alike and need to be separated",
                "There is enormous diversity of life forms making individual study impractical",
                "Organisms are constantly changing their shapes",
                "Scientists want to rename all organisms"
              ],
              correctIndex: 1,
              explanation: "With millions of species on Earth, it is impossible to study each organism individually. Classification groups them into manageable categories, making study systematic and efficient."
            }
          },
          "systematics": {
            term: "Systematics",
            definition: "Systematics is the branch of biology that deals with the diversity of organisms and their comparative study, including their evolutionary relationships. The term was introduced by Carolus Linnaeus (who used 'Systema Naturae' as the title of his work).",
            flashcard: {
              front: "How is Systematics different from Taxonomy?",
              back: "Taxonomy involves identification, nomenclature, and classification. Systematics is broader — it includes taxonomy but also covers evolutionary relationships between organisms and the comparative study of their diversity."
            },
            mcq: {
              question: "Who introduced the term 'Systema Naturae' and what is its significance?",
              options: [
                "Ernst Mayr — introduced the species concept",
                "Charles Darwin — introduced evolution theory",
                "Carolus Linnaeus — introduced systematic arrangement of organisms",
                "Aristotle — classified animals into groups"
              ],
              correctIndex: 2,
              explanation: "Carolus Linnaeus used 'Systema Naturae' as the title of his major work on classifying nature, establishing the foundational framework of modern systematics."
            }
          }
        }
      },
      {
        pageNumber: 5,
        title: "The Living World — Classification, Taxa & Taxonomy",
        imageUrl: "/kebo101/page_05.png",
        originalText: `
          <h3>BINOMIAL NOMENCLATURE</h3>
          <p class="mb-4">The scientific name of an organism consists of two parts. This two-word system of naming is called Binomial Nomenclature. It was introduced by Carolus Linnaeus.</p>
          <p class="mb-4">The first word represents the genus and the second word is the specific epithet (species name). Rules of ICBN (International Code for Botanical Nomenclature) for plants and ICZN (International Code of Zoological Nomenclature) for animals govern scientific naming.</p>
          <h4 class="font-bold text-lg border-b border-[#ebdcb9] pb-1 mt-4 mb-2">Rules of Binomial Nomenclature</h4>
          <ul class="list-disc pl-5 mb-4">
            <li>The name of the genus starts with a capital letter.</li>
            <li>The specific epithet (species name) starts with a small letter.</li>
            <li>The name should be printed in italics when typed.</li>
            <li>When handwritten, the genus and species name are underlined separately.</li>
          </ul>
          <p class="mb-4">Example: Mangifera indica (Mango), Homo sapiens (Human being), Panthera leo (Lion).</p>
        `,
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg">Binomial Nomenclature — The universal two-name system for organisms.</p>
          <p class="mb-4 leading-relaxed">
            {Binomial nomenclature} is the system of giving each organism a scientific name consisting of two words — the genus name (capitalised) and the specific epithet (lowercase). It was introduced by Carolus Linnaeus.
          </p>
          <p class="mb-4 leading-relaxed">
            Scientific names follow strict rules governed by {ICBN} (for plants) and ICZN (for animals). Names are printed in italics when typed, or underlined separately when handwritten.
          </p>
          <p class="mb-4 leading-relaxed">
            Example: <em>Mangifera indica</em> (Mango) — <em>Mangifera</em> is the genus, <em>indica</em> is the specific epithet. Similarly <em>Homo sapiens</em> (human), <em>Panthera leo</em> (lion), <em>Oryza sativa</em> (rice).
          </p>
        `,
        concepts: {
          "Binomial nomenclature": {
            term: "Binomial Nomenclature",
            definition: "Binomial nomenclature is the system introduced by Carolus Linnaeus where every organism is given a scientific name comprising two words: (1) the genus name (first word, capital letter) and (2) the specific epithet (second word, small letter). Names are universally used in italics or underlined.",
            flashcard: {
              front: "Who introduced Binomial Nomenclature and what are its two components?",
              back: "Carolus Linnaeus introduced Binomial Nomenclature. The two components are: (1) Generic name/Genus — first word, capital letter, and (2) Specific epithet — second word, lowercase. E.g., Homo sapiens, Mangifera indica."
            },
            mcq: {
              question: "In the scientific name Mangifera indica, which word represents the genus?",
              options: [
                "indica",
                "Mangifera indica",
                "Mangifera",
                "Neither — genus is written separately"
              ],
              correctIndex: 2,
              explanation: "In binomial nomenclature, the first word (Mangifera) represents the genus. It begins with a capital letter. The second word (indica) is the specific epithet and begins with a lowercase letter."
            }
          },
          "ICBN": {
            term: "ICBN — International Code for Botanical Nomenclature",
            definition: "ICBN (International Code for Botanical Nomenclature) is the set of rules and recommendations that govern the scientific naming of plants. The equivalent code for animals is ICZN (International Code of Zoological Nomenclature). These codes ensure names are universally standardised.",
            flashcard: {
              front: "What is ICBN and what does it govern?",
              back: "ICBN = International Code for Botanical Nomenclature. It sets the universal rules for naming plant species. The equivalent for animals is ICZN. Both ensure scientific names are stable, unique, and universally accepted."
            },
            mcq: {
              question: "Which code governs the naming of animals?",
              options: [
                "ICBN",
                "ICZN",
                "IUCN",
                "ICSB"
              ],
              correctIndex: 1,
              explanation: "ICZN = International Code of Zoological Nomenclature governs animal naming. ICBN governs plant naming. IUCN deals with conservation status."
            }
          }
        }
      },
      {
        pageNumber: 6,
        title: "The Living World — Taxonomic Categories & Species (1.2)",
        imageUrl: "/kebo101/page_06.png",
        originalText: `
          <h3>1.2 TAXONOMIC CATEGORIES</h3>
          <p class="mb-4">Classification is not a single step process but involves a hierarchy of steps in which each step represents a rank or category. Each category, referred to as a unit of classification, is commonly known as a taxon.</p>
          <p class="mb-4">The taxonomic categories from species to kingdom have been arranged in ascending order. These categories in ascending order are: Species → Genus → Family → Order → Class → Phylum → Kingdom. This hierarchy is called the taxonomic hierarchy.</p>
          <p class="mb-4">As we go higher from species to kingdom, the number of common characteristics shared by members goes on decreasing. Lower taxa share more characteristics; higher taxa share fewer.</p>
        `,
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg">Taxonomic Categories — The seven-level hierarchy of classification.</p>
          <p class="mb-4 leading-relaxed">
            The classification system is arranged in a {taxon} hierarchy. A taxon is a unit of classification at any level. Each level or rank is called a taxonomic category. Together they form the taxonomic hierarchy.
          </p>
          <p class="mb-4 leading-relaxed">
            The seven major taxonomic categories in ascending order are: Species → Genus → {Family} → Order → Class → Phylum/Division → Kingdom. As we go higher, shared characteristics decrease.
          </p>
          <p class="mb-4 leading-relaxed">
            Key rule: lower the taxon, more characters are shared among members. Higher the taxon (like {Kingdom}), fewer characters are common and more difficult it becomes to define membership.
          </p>
        `,
        concepts: {
          "taxon": {
            term: "Taxon (plural: Taxa)",
            definition: "A taxon is any unit of classification in the taxonomic hierarchy — it can be a species, genus, family, order, class, phylum, or kingdom. Each taxon represents a group of organisms sharing certain common characters.",
            flashcard: {
              front: "What is a taxon? Give examples at different hierarchical levels.",
              back: "A taxon is any unit of biological classification. Examples: Species (Homo sapiens), Genus (Homo), Family (Hominidae), Order (Primata), Class (Mammalia), Phylum (Chordata), Kingdom (Animalia)."
            },
            mcq: {
              question: "Which of the following correctly lists taxonomic categories from lowest to highest?",
              options: [
                "Kingdom → Phylum → Class → Order → Family → Genus → Species",
                "Species → Genus → Family → Order → Class → Phylum → Kingdom",
                "Species → Order → Family → Genus → Class → Phylum → Kingdom",
                "Genus → Species → Family → Order → Class → Phylum → Kingdom"
              ],
              correctIndex: 1,
              explanation: "The correct ascending order is: Species → Genus → Family → Order → Class → Phylum/Division → Kingdom. This can be memorised as 'Silly Giraffes Fight Over Colored Paint Kits'."
            }
          },
          "Family": {
            term: "Family (Taxonomic Category)",
            definition: "Family is a taxonomic category that contains a group of related genera with more similarities than genera of different families. Plant families are characterised by vegetative and reproductive features. E.g., Solanum, Petunia and Datura all belong to family Solanaceae. Lion and tiger belong to family Felidae.",
            flashcard: {
              front: "Give one example of a plant family and one animal family with their member genera.",
              back: "Plant: Family Solanaceae includes genera Solanum (potato/brinjal), Petunia, and Datura. Animal: Family Felidae includes genera Panthera (lion, tiger, leopard) and Felis (cats)."
            },
            mcq: {
              question: "Which family do lion (Panthera leo), tiger (Panthera tigris) and leopard (Panthera pardus) belong to?",
              options: [
                "Canidae",
                "Hominidae",
                "Felidae",
                "Ursidae"
              ],
              correctIndex: 2,
              explanation: "Lion, tiger, and leopard all belong to genus Panthera, which is placed in family Felidae. Canidae includes dogs and wolves; Hominidae includes humans."
            }
          },
          "Kingdom": {
            term: "Kingdom (Taxonomic Category)",
            definition: "Kingdom is the highest category in the taxonomic hierarchy. All animals are grouped in Kingdom Animalia, and all plants in Kingdom Plantae. Higher categories like kingdoms share very few common characters among members.",
            flashcard: {
              front: "What is the highest category in the taxonomic hierarchy and how many kingdoms exist?",
              back: "Kingdom is the highest taxonomic category. Traditionally, five kingdoms are recognised: Monera, Protista, Fungi, Plantae, and Animalia. Some modern systems recognise 6 or more kingdoms."
            },
            mcq: {
              question: "To which kingdom do human beings belong?",
              options: [
                "Kingdom Plantae",
                "Kingdom Monera",
                "Kingdom Animalia",
                "Kingdom Protista"
              ],
              correctIndex: 2,
              explanation: "Humans (Homo sapiens) are animals, so they belong to Kingdom Animalia — the kingdom comprising all multicellular, heterotrophic eukaryotes (animals)."
            }
          }
        }
      },
      {
        pageNumber: 7,
        title: "The Living World — Genus, Family, Order, Class, Phylum",
        imageUrl: "/kebo101/page_07.png",
        originalText: `
          <h3>1.2.1–1.2.4 TAXONOMIC CATEGORIES: Species to Order</h3>
          <p class="mb-4">Human beings belong to the species sapiens which is grouped in the genus Homo. The scientific name thus, for human being, is written as Homo sapiens.</p>
          <h4 class="font-bold border-b pb-1 mt-3 mb-2">1.2.2 Genus</h4>
          <p class="mb-4">Genus comprises a group of related species which has more characters in common. For example, lion (Panthera leo), leopard (P. pardus) and tiger (P. tigris) are all species of genus Panthera. Potato and brinjal belong to genus Solanum.</p>
          <h4 class="font-bold border-b pb-1 mt-3 mb-2">1.2.3 Family</h4>
          <p class="mb-4">Family has a group of related genera. Solanum, Petunia and Datura are placed in family Solanaceae. Genus Panthera and Felis are in family Felidae.</p>
          <h4 class="font-bold border-b pb-1 mt-3 mb-2">1.2.4 Order</h4>
          <p class="mb-4">Order is the assemblage of families which exhibit a few similar characters. Plant families Convolvulaceae and Solanaceae are in Order Polymoniales. Animal Order Carnivora includes families Felidae and Canidae.</p>
        `,
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg">Species → Genus → Family → Order: Understanding each taxonomic level.</p>
          <p class="mb-4 leading-relaxed">
            A {genus} is a group of related species sharing more characteristics than species of other genera. Example: Panthera includes lion (P. leo), tiger (P. tigris), and leopard (P. pardus). All are distinct species but share enough traits to be in one genus.
          </p>
          <p class="mb-4 leading-relaxed">
            An {order} is an assemblage of related families. For animals, Order Carnivora includes families Felidae (cats) and Canidae (dogs/wolves). For plants, Order Polymoniales includes families Solanaceae and Convolvulaceae.
          </p>
          <p class="mb-4 leading-relaxed">
            The key point: as you move from Species → Genus → Family → Order, the number of shared characters decreases, but the total number of organisms included in each category increases.
          </p>
        `,
        concepts: {
          "genus": {
            term: "Genus",
            definition: "Genus is a taxonomic category above species. It comprises a group of related species that share more characters in common with each other than with species of other genera. The genus name is the first word in binomial nomenclature (e.g., Panthera, Homo, Solanum).",
            flashcard: {
              front: "What is a genus? Give one plant and one animal example of a genus with multiple species.",
              back: "A genus is a group of related species sharing many characters. Animal example: Genus Panthera includes lion (P. leo), tiger (P. tigris), leopard (P. pardus). Plant example: Genus Solanum includes potato (S. tuberosum), brinjal (S. melongena)."
            },
            mcq: {
              question: "Lion and tiger are placed in the same genus because:",
              options: [
                "They look exactly the same",
                "They live in the same region",
                "They share more common characters with each other than with cats (genus Felis)",
                "They are the same species"
              ],
              correctIndex: 2,
              explanation: "Genus is based on shared characters. Lion (Panthera leo) and tiger (Panthera tigris) share more characteristics with each other than with cats (genus Felis), so they are placed in genus Panthera."
            }
          },
          "order": {
            term: "Order (Taxonomic Category)",
            definition: "Order is a taxonomic category that includes related families. Orders are identified based on aggregates of characters shared by families. E.g., Order Carnivora includes families Felidae (cats) and Canidae (dogs). Order Primata includes families with monkeys, apes, and humans.",
            flashcard: {
              front: "To which order do lions and dogs both belong?",
              back: "Lions (family Felidae) and dogs (family Canidae) are both placed in Order Carnivora — because they share the character of being flesh-eating (carnivorous) mammals with similar dentition."
            },
            mcq: {
              question: "Order Primata includes which of the following?",
              options: [
                "Lion, Tiger, Leopard",
                "Monkey, Gorilla, Gibbon, and Humans",
                "Frogs, Toads, and Salamanders",
                "Eagles, Hawks, and Falcons"
              ],
              correctIndex: 1,
              explanation: "Order Primata includes primates — monkey, gorilla, gibbon — and is placed along with Order Carnivora in class Mammalia. Humans (Homo sapiens) also belong to Order Primata."
            }
          }
        }
      },
      {
        pageNumber: 8,
        title: "The Living World — Kingdom & Taxonomic Hierarchy",
        imageUrl: "/kebo101/page_08.png",
        originalText: `
          <h3>1.2.5–1.2.7 CLASS, PHYLUM AND KINGDOM</h3>
          <h4 class="font-bold border-b pb-1 mt-3 mb-2">1.2.5 Class</h4>
          <p class="mb-4">Class includes related orders. Order Primata (monkey, gorilla, gibbon) and Order Carnivora (tiger, cat, dog) are placed in class Mammalia.</p>
          <h4 class="font-bold border-b pb-1 mt-3 mb-2">1.2.6 Phylum</h4>
          <p class="mb-4">Classes comprising fishes, amphibians, reptiles, birds and mammals constitute Phylum Chordata, based on the common features of notochord and dorsal hollow neural system.</p>
          <h4 class="font-bold border-b pb-1 mt-3 mb-2">1.2.7 Kingdom</h4>
          <p class="mb-4">All animals belonging to various phyla are assigned to Kingdom Animalia. Plants to Kingdom Plantae.</p>
          <p class="mb-4">Taxonomic categories (Man): Homo sapiens → Genus Homo → Family Hominidae → Order Primata → Class Mammalia → Phylum Chordata → Kingdom Animalia.</p>
        `,
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg">Class, Phylum & Kingdom — The top three levels of taxonomic hierarchy.</p>
          <p class="mb-4 leading-relaxed">
            A {class} groups related orders. Class Mammalia includes orders Primata (monkeys, apes, humans) and Carnivora (cats, dogs, bears). All share characters like warm blood, hair, and milk-producing mammary glands.
          </p>
          <p class="mb-4 leading-relaxed">
            A {phylum} groups related classes. Phylum Chordata includes fishes, amphibians, reptiles, birds, and mammals — all share a notochord and dorsal hollow neural tube at some stage of their life.
          </p>
          <p class="mb-4 leading-relaxed">
            Complete taxonomy of Mango: Mangifera indica → Genus Mangifera → Family Anacardiaceae → Order Sapindales → Class Dicotyledonae → Division Angiospermae → Kingdom Plantae. For humans: Homo sapiens → Homo → Hominidae → Primata → Mammalia → Chordata → Animalia.
          </p>
        `,
        concepts: {
          "class": {
            term: "Class (Taxonomic Category)",
            definition: "Class is a taxonomic category above order that groups related orders. For example, orders Primata (primates) and Carnivora (flesh-eaters) are both in class Mammalia. Class Mammalia members share characters like warm blood, body hair, and mammary glands.",
            flashcard: {
              front: "To which class do humans, lions, and dogs belong?",
              back: "All three belong to class Mammalia. Humans are in Order Primata; lions and dogs are in Order Carnivora. But all share mammalian characters (warm blood, hair, mammary glands), placing them all in Mammalia."
            },
            mcq: {
              question: "Order Primata and Order Carnivora are both included in which class?",
              options: [
                "Class Reptilia",
                "Class Aves",
                "Class Mammalia",
                "Class Amphibia"
              ],
              correctIndex: 2,
              explanation: "Both Primata (primates like humans, gorillas) and Carnivora (lions, dogs, bears) are placed in class Mammalia because they share mammalian features."
            }
          },
          "phylum": {
            term: "Phylum (Taxonomic Category)",
            definition: "Phylum is a major taxonomic category above class. Phylum Chordata includes animals with a notochord and dorsal hollow nervous system at some stage of life — this includes fishes, amphibians, reptiles, birds, and mammals. For plants, the equivalent is Division.",
            flashcard: {
              front: "What characters unite all animals in Phylum Chordata?",
              back: "All chordates share: (1) a notochord at some life stage, (2) a dorsal hollow nerve cord, and (3) pharyngeal gill slits at some stage. This includes fishes, amphibians, reptiles, birds, and mammals."
            },
            mcq: {
              question: "Which of the following is a common feature of all organisms in Phylum Chordata?",
              options: [
                "They are all warm-blooded",
                "They all have four limbs",
                "They all possess a notochord at some stage",
                "They all live in water"
              ],
              correctIndex: 2,
              explanation: "The defining feature of Phylum Chordata is the presence of a notochord at some stage of life. Not all chordates are warm-blooded or have four limbs (fish and snakes don't)."
            }
          }
        }
      },
      {
        pageNumber: 9,
        title: "The Living World — Summary & Exercises",
        imageUrl: "/kebo101/page_09.png",
        originalText: `
          <h3>SUMMARY</h3>
          <p class="mb-4">The living world is rich in variety. Millions of plants and animals have been identified and described but a large number still remains unknown. The very range of organisms in terms of size, colour, habitat, physiological and morphological features make us seek the defining characteristics of living organisms.</p>
          <p class="mb-4">In order to facilitate the study of kinds and diversity of organisms, biologists have evolved certain rules and principles for identification, nomenclature and classification of organisms. The branch of knowledge dealing with these aspects is referred to as taxonomy.</p>
          <p class="mb-4">The basics of taxonomy like identification, naming and classification of organisms are universally evolved under international codes. Based on the resemblances and distinct differences, each organism is identified and assigned a correct scientific/biological name comprising two words as per the binomial system of nomenclature.</p>
          <p class="mb-4">All the categories constitute a taxonomic hierarchy. The categories in ascending order: Species → Genus → Family → Order → Class → Phylum/Division → Kingdom.</p>
        `,
        interactiveSummary: `
          <p class="lead mb-4 font-medium text-lg">Chapter 1 Summary — The Living World & Taxonomy.</p>
          <p class="mb-4 leading-relaxed">
            The living world is extraordinarily diverse. Millions of species have been identified, yet many remain undiscovered. Biologists use {taxonomy} to bring order to this diversity through identification, nomenclature, and classification.
          </p>
          <p class="mb-4 leading-relaxed">
            Every organism is given a unique two-part scientific name under the binomial nomenclature system. Names follow international codes (ICBN for plants, ICZN for animals), ensuring universal acceptance and stability.
          </p>
          <p class="mb-4 leading-relaxed">
            The {taxonomic hierarchy} (Species → Genus → Family → Order → Class → Phylum → Kingdom) organises all life into progressively broader groups. As we ascend the hierarchy, shared characters decrease but the breadth of diversity within each group increases.
          </p>
        `,
        concepts: {
          "taxonomy": {
            term: "Taxonomy",
            definition: "Taxonomy is the branch of biology that deals with identification, nomenclature, and classification of organisms. It establishes rules for naming (ICBN, ICZN) and groups organisms based on shared characteristics into a hierarchical system (taxa).",
            flashcard: {
              front: "What are the three main pillars of Taxonomy?",
              back: "1. Identification — recognising and describing an organism. 2. Nomenclature — assigning a universal scientific name. 3. Classification — placing it in the correct hierarchical group based on shared characters."
            },
            mcq: {
              question: "The branch of biology concerned with identification, nomenclature, and classification of organisms is:",
              options: [
                "Ecology",
                "Physiology",
                "Taxonomy",
                "Genetics"
              ],
              correctIndex: 2,
              explanation: "Taxonomy (from Greek 'taxis' = arrangement) is the science of naming, describing, and classifying all living organisms."
            }
          },
          "taxonomic hierarchy": {
            term: "Taxonomic Hierarchy",
            definition: "The taxonomic hierarchy is the arrangement of taxonomic categories in a specific order from the most specific (species) to the most general (kingdom). The seven obligate categories are: Species → Genus → Family → Order → Class → Phylum/Division → Kingdom.",
            flashcard: {
              front: "List the seven obligate taxonomic categories in ascending order.",
              back: "Species → Genus → Family → Order → Class → Phylum (Division for plants) → Kingdom. Mnemonic: 'Silly Giraffes Fight Over Colorful Pretty Kingdoms'."
            },
            mcq: {
              question: "As we move from species to kingdom in the taxonomic hierarchy, which of the following is TRUE?",
              options: [
                "Shared characters increase as we go higher",
                "Shared characters decrease and total number of organisms increases",
                "Both characters and organism count decrease",
                "The number of taxa decreases"
              ],
              correctIndex: 1,
              explanation: "Moving up the hierarchy (species → kingdom), fewer characters are shared among members, but the total number of organisms included in that group becomes larger."
            }
          }
        }
      },
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
    isPdf: true,
    pdfUrl: "/bio12-ch1-5.pdf",
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

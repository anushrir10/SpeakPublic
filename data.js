// SpeakPublic Translation & Accessibility Dataset
window.SpeakPublicData = {
  documents: {
    hospital_discharge: {
      id: "hospital_discharge",
      title: {
        en: "Apex Municipal Hospital - Patient Discharge Summary & Post-Operative Plan",
        hi: "एपेक्स म्युनिसिपल अस्पताल - रोगी डिस्चार्ज सारांश और पोस्ट-ऑपरेटिव योजना"
      },
      meta: {
        docType: "Medical Discharge Summary",
        simplificationTemplate: "Healthcare Worker Explainer",
        detectedLanguage: "English / Hindi Jargon"
      },
      originalContent: {
        title: "Apex Municipal Hospital - Patient Discharge Summary & Post-Operative Plan",
        sections: [
          {
            heading: "Patient Clinical Status & Diagnosis",
            content: "Patient presented with acute calculous cholecystitis. Successfully underwent laparoscopic cholecystectomy under general anesthesia. Post-operative course uneventful. Vital signs stable, surgical wounds clean and healing by primary intention. Patient is hemodynamically stable and is cleared for discharge."
          },
          {
            heading: "Pharmacological Management Protocol",
            content: "1. Tab. Amoxicillin + Clavulanic Acid (625mg) BD (twice daily) post-prandial for 5 days. \n2. Tab. Paracetamol (650mg) QDS (four times daily) PRN (as required) for pain management. \n3. Tab. Pantoprazole (40mg) OD (once daily) ante-prandial (before food) for gastric protection."
          },
          {
            heading: "Activity Restrictions & Dietary Regimen",
            content: "Strict adherence to a low-fat, low-residue diet for 14 days post-op to prevent dyspepsia. Avoid lifting weights > 5 kg, abdominal straining, or strenuous physical exertion. Normal activities of daily living may resume gradually as tolerated."
          },
          {
            heading: "Clinical Red Flags & Emergency Re-admission Criteria",
            content: "In the event of pyrexia (>101°F), persistent emesis, acute radiating abdominal pain, progressive jaundice, or active purulent discharge from surgical ports, report immediately to the Emergency Room."
          },
          {
            heading: "Follow-up Care & Suture Removal Schedule",
            content: "Patient is scheduled for surgical outpatient review and suture removal on Friday, June 26th, 2026, at 0900 hours in Room 14 of the Surgical OPD."
          }
        ]
      },
      adaptations: {
        tamil: {
          languageName: "Tamil (தமிழ்)",
          simplificationExplainer: "ஒரு உள்ளூர் சுகாதாரப் பணியாளர் உங்களுக்குப் புரியும் வகையில் இதை விளக்குகிறார்:",
          originalTitleTranslated: "அபெக்ஸ் நகராட்சி மருத்துவமனை - நோயாளி வெளியேற்ற சுருக்கம் & அறுவை சிகிச்சைக்கு பிந்தைய பராமரிப்பு",
          sections: [
            {
              heading: "நோயாளி நிலைமை (உங்களுக்கு என்ன நடந்தது?)",
              originalHeading: "Patient Clinical Status & Diagnosis",
              content: "பித்தப்பையில் கல் மற்றும் வீக்கம் காரணமாக நீங்கள் அனுமதிக்கப்பட்டீர்கள். பித்தப்பையை அகற்றுவதற்கான அறுவை சிகிச்சை வெற்றிகரமாக செய்யப்பட்டது. இப்போது நீங்கள் நலமாக இருக்கிறீர்கள். காயங்கள் ஆறி வருகின்றன. நீங்கள் வீட்டிற்குச் செல்லலாம்.",
              plainContent: "பித்தப்பை கல் அறுவை சிகிச்சை முடிந்தது. உடம்பு தேறி வருகிறது, வீட்டிற்குப் போகலாம்.",
              audioNarration: "நோயாளி நிலைமை. உங்கள் பித்தப்பை கல் அறுவை சிகிச்சை வெற்றிகரமாக முடிந்தது. தையல் போடப்பட்ட இடம் சுத்தமாக இருக்கிறது. நீங்கள் வீட்டிற்கு செல்ல தயார்.",
              avatarSigns: ["hospital", "surgery", "good", "go-home"],
              icons: ["🩺", "✅", "🏠"]
            },
            {
              heading: "மருந்துகள் சாப்பிடும் முறை (மாத்திரைகள்)",
              originalHeading: "Pharmacological Management Protocol",
              content: "1. அமோக்ஸிசிலின் மாத்திரை (Amoxicillin 625mg): காலை 1, இரவு 1 சாப்பிட்ட பிறகு. (5 நாட்களுக்கு - தொற்று வராமல் இருக்க)\n2. பாராசிட்டமால் மாத்திரை (Paracetamol 650mg): வலி இருந்தால் மட்டும், ஒரு நாளைக்கு 4 முறை வரை சாப்பிடலாம்.\n3. பான்டோபிரசோல் மாத்திரை (Pantoprazole 40mg): காலை உணவு சாப்பிடுவதற்கு அரை மணி நேரம் முன்னால் 1 மாத்திரை (வயிற்று எரிச்சலைத் தடுக்க).",
              plainContent: "1. ஆன்டிபயாடிக் மாத்திரை: 5 நாட்களுக்கு, காலை 1, இரவு 1 (சாப்பிட்ட பின்).\n2. வலி மாத்திரை: வலி இருக்கும் போது மட்டும் (நாளைக்கு 4 முறை வரை).\n3. கேஸ் மாத்திரை: காலையில் வெறும் வயிற்றில் 1 மாத்திரை.",
              audioNarration: "மருந்துகள். உங்களுக்கு மூன்று மருந்துகள் தரப்பட்டுள்ளன. முதல் மருந்து ஆன்டிபயாடிக், காலை மற்றும் இரவு உணவுக்கு பின் சாப்பிடவும். இரண்டாம் மருந்து பாராசிட்டமால், வலி இருந்தால் மட்டுமே சாப்பிடவும். மூன்றாம் மருந்து கேஸ் மாத்திரை, காலையில் சாப்பாட்டுக்கு முன் வெறும் வயிற்றில் சாப்பிட வேண்டும்.",
              avatarSigns: ["medicine", "morning", "night", "food", "before", "water"],
              icons: ["💊", "🍽️", "⏰"]
            },
            {
              heading: "உணவு மற்றும் ஓய்வு",
              originalHeading: "Activity Restrictions & Dietary Regimen",
              content: "அடுத்த 2 வாரங்களுக்கு எண்ணெய், கொழுப்பு மற்றும் காரமான உணவுகளை முற்றிலும் தவிர்க்கவும். எளிதில் ஜீரணமாகும் உணவுகளை உண்ணுங்கள். 5 கிலோவிற்கும் அதிகமான எடையை தூக்கக் கூடாது. கடினமான வேலைகளை செய்ய வேண்டாம். மெதுவாக நடப்பது நல்லது.",
              plainContent: "காரமில்லாத, எண்ணெய் இல்லாத சாப்பாடு சாப்பிடவும். அதிக எடை தூக்கக் கூடாது, ஓய்வு தேவை.",
              audioNarration: "உணவு மற்றும் ஓய்வு. இரண்டு வாரங்களுக்கு எண்ணெய் மற்றும் கொழுப்பு உணவுகளை தவிர்க்கவும். ஐந்து கிலோவுக்கு மேல் எடையைத் தூக்கக் கூடாது. ஓய்வு எடுக்கவும்.",
              avatarSigns: ["food", "no-oil", "no-heavy-lifting", "rest"],
              icons: ["🍎", "🚫", "🛌"]
            },
            {
              heading: "எப்போது உடனே மருத்துவமனைக்கு வரவேண்டும்?",
              originalHeading: "Clinical Red Flags & Emergency Re-admission Criteria",
              content: "உடலில் 101 டிகிரிக்கு மேல் கடுமையான காய்ச்சல் அடித்தால், தொடர்ந்து வாந்தி எடுத்தால், வயிற்றில் கடுமையான வலி ஏற்பட்டால், கண் அல்லது தோல் மஞ்சள் நிறமாக மாறினால், அல்லது அறுவை சிகிச்சை காயத்திலிருந்து சீழ் வடிந்தால், உடனே அவசர சிகிச்சைப் பிரிவுக்கு வரவும்.",
              plainContent: "காய்ச்சல், வாந்தி, கடுமையான வயிற்று வலி, அல்லது காயத்தில் சீழ் வந்தால் உடனே அவசர சிகிச்சைக்கு வரவும்.",
              audioNarration: "எச்சரிக்கை அறிகுறிகள். உங்களுக்கு கடுமையான காய்ச்சல் வந்தாலோ, வாந்தி எடுத்தாலோ, அல்லது காயம் உள்ள இடத்தில் சீழ் வடிந்தாலோ தாமதிக்காமல் உடனே எமர்ஜென்சி வார்டுக்கு வரவும்.",
              avatarSigns: ["fever", "pain", "vomit", "danger", "hospital", "quick"],
              icons: ["⚠️", "🌡️", "🚨"]
            },
            {
              heading: "அடுத்த பரிசோதனை மற்றும் தையல் பிரித்தல்",
              originalHeading: "Follow-up Care & Suture Removal Schedule",
              content: "ஜூன் 26 வெள்ளிக்கிழமை காலை 9:00 மணிக்கு அறுவை சிகிச்சை வெளிநோயாளி பிரிவு (Surgical OPD) அறை எண் 14-க்கு வர வேண்டும். அன்று தையல் பிரிக்கப்படும்.",
              plainContent: "ஜூன் 26 வெள்ளிக்கிழமை காலை 9 மணிக்கு, அறை எண் 14-க்கு தையல் பிரிக்க வரவும்.",
              audioNarration: "அடுத்த பரிசோதனை. ஜூன் இருபத்தி ஆறாம் தேதி, வெள்ளிக்கிழமை காலை ஒன்பது மணிக்கு அறை எண் பதினான்கிற்கு தையல் பிரிக்க வர வேண்டும்.",
              avatarSigns: ["calendar", "friday", "morning", "room", "1", "4", "doctor"],
              icons: ["📅", "🏥", "📍"]
            }
          ]
        },
        odia: {
          languageName: "Odia (ଓଡ଼ିଆ)",
          simplificationExplainer: "ଜଣେ ସ୍ଥାନୀୟ ସ୍ୱାସ୍ଥ୍ୟକର୍ମୀଙ୍କ ଭାଷାରେ ସରଳ ବୁଝାମଣା:",
          originalTitleTranslated: "ଆପେକ୍ସ ମ୍ୟୁନିସିପାଲ୍ ହସ୍ପିଟାଲ୍ - ରୋଗୀ ଡିସଚାର୍ଜ ସଂକ୍ଷିପ୍ତ ବିବରଣୀ ଓ ପରବର୍ତ୍ତୀ ଯତ୍ନ",
          sections: [
            {
              heading: "ରୋଗୀର ଅବସ୍ଥା (ଆପଣଙ୍କର କଣ ହୋଇଥିଲା?)",
              originalHeading: "Patient Clinical Status & Diagnosis",
              content: "ପିତ୍ତକୋଷରେ ପଥର ଏବଂ ପ୍ରଦାହ ଯୋଗୁଁ ଆପଣ ଭର୍ତ୍ତି ହୋଇଥିଲେ | ପିତ୍ତକୋଷ ବାହାର କରିବା ପାଇଁ ଲାପାରୋସ୍କୋପିକ୍ ଅପରେସନ ସଫଳତାର ସହ ଶେଷ ହୋଇଛି | ଆପଣ ଏବେ ସୁସ୍ଥ ଅଛନ୍ତି ଏବଂ ଘରକୁ ଯାଇପାରିବେ |",
              plainContent: "ପିତ୍ତକୋଷ ପଥର ଅପରେସନ ସରିଛି। ଆପଣ ଭଲ ଅଛନ୍ତି, ଘରକୁ ଯାଇପାରିବେ।",
              audioNarration: "ରୋଗୀର ସ୍ଥିତି। ଆପଣଙ୍କ ପିତ୍ତକୋଷ ପଥର ଅପରେସନ ସଫଳତାର ସହ ଶେଷ ହୋଇଛି। ଆପଣ ଏବେ ସୁସ୍ଥ ଅଛନ୍ତି ଏବଂ ଘରକୁ ଯିବାକୁ ପ୍ରସ୍ତୁତ।",
              avatarSigns: ["hospital", "surgery", "good", "go-home"],
              icons: ["🩺", "✅", "🏠"]
            },
            {
              heading: "ଔଷଧ ଖାଇବାର ନିୟମ (ମେଡିସିନ୍)",
              originalHeading: "Pharmacological Management Protocol",
              content: "1. ଆମୋକ୍ସିସିଲିନ୍ ଟାବଲେଟ୍ (Amoxicillin 625mg): ସକାଳେ ୧, ସନ୍ଧ୍ୟାରେ ୧ ଖାଇବା ପରେ (୫ ଦିନ ପାଇଁ - ସଂକ୍ରମଣ ନହେବା ପାଇଁ) |\n2. ପାରାସିଟାମୋଲ୍ ଟାବଲେଟ୍ (Paracetamol 650mg): ଯଦି ଦେହ କିମ୍ବା କ୍ଷତ ଜାଗା ବିନ୍ଧାଛିଡ଼ା କରେ, ଦିନକୁ ୪ ଥର ଯାଏଁ ଖାଇପାରିବେ |\n3. ପାଣ୍ଟୋପ୍ରାଜୋଲ୍ ଟାବଲେଟ୍ (Pantoprazole 40mg): ସକାଳ ଜଳଖିଆ ଖାଇବାର ଅଧ ଘଣ୍ଟା ପୂର୍ବରୁ ୧ ଟାବଲେଟ୍ ଖାଲି ପେଟରେ ଖାଇବେ (ଗ୍ୟାଷ୍ଟ୍ରିକ୍ ନହେବା ପାଇଁ) |",
              plainContent: "1. ଆଣ୍ଟିବାୟୋଟିକ୍: ୫ ଦିନ ପାଇଁ ସକାଳେ ୧, ରାତିରେ ୧ (ଖାଇବା ପରେ)।\n2. ବିନ୍ଧାଔଷଧ: କେବଳ ଦରଜ ଥିଲେ ଖାଇବେ (ଦିନକୁ ୪ ଥର ଯାଏଁ)।\n3. ଗ୍ୟାସ ଔଷଧ: ସକାଳୁ ଖାଲି ପେଟରେ ୧ ଟାବଲେଟ୍।",
              audioNarration: "ଔଷଧ ଖାଇବା ନିୟମ। ଆପଣଙ୍କୁ ତିନୋଟି ଔଷଧ ଦିଆଯାଇଛି। ପ୍ରଥମେ ସକାଳେ ଓ ରାତିରେ ଖାଇବା ପରେ ଆଣ୍ଟିବାୟୋଟିକ୍ ଖାଆନ୍ତୁ। ଦ୍ଵିତୀୟରେ କେବଳ ଦରଜ ହେଲେ ପାରାସିଟାମୋଲ୍ ଖାଆନ୍ତୁ। ତୃତୀୟରେ ସକାଳେ ଖାଲି ପେଟରେ ଗ୍ୟାସ ଔଷଧ ଖାଆନ୍ତୁ।",
              avatarSigns: ["medicine", "morning", "night", "food", "before", "water"],
              icons: ["💊", "🍽️", "⏰"]
            },
            {
              heading: "ଖାଦ୍ୟପେୟ ଏବଂ ବିଶ୍ରାମ",
              originalHeading: "Activity Restrictions & Dietary Regimen",
              content: "ଆସନ୍ତା ୨ ସପ୍ତାହ ପର୍ଯ୍ୟନ୍ତ ତେଲ, ଘିଅ କିମ୍ବା ମସଲାଯୁକ୍ତ ଗରିଷ୍ଠ ଖାଦ୍ୟ ଖାଆନ୍ତୁ ନାହିଁ | ସରଳ ଓ ସହଜରେ ହଜମ ହେଉଥିବା ଖାଦ୍ୟ ଖାଆନ୍ତୁ | ୫ କିଲୋରୁ ଅଧିକ ଓଜନ ଜିନିଷ ଟେକନ୍ତୁ ନାହିଁ ଏବଂ କଠିନ କାମ କରନ୍ତୁ ନାହିଁ |",
              plainContent: "ତେଲ-ମସଲା ଖାଇବା ମନା। ଭାରୀ ଜିନିଷ ଉଠାନ୍ତୁ ନାହିଁ, ଆରାମ କରନ୍ତୁ।",
              audioNarration: "ଖାଦ୍ୟ ଏବଂ ଆରାମ। ୨ ସପ୍ତାହ ଯାଏଁ ତେଲ ମସଲା ଖାଦ୍ୟ ବାରଣ କରନ୍ତୁ। କୌଣସି ଭାରୀ ଜିନିଷ ଉଠାନ୍ତୁ ନାହିଁ। ବିଶ୍ରାମ ନିଅନ୍ତୁ।",
              avatarSigns: ["food", "no-oil", "no-heavy-lifting", "rest"],
              icons: ["🍎", "🚫", "🛌"]
            },
            {
              heading: "କେଉଁ ଅବସ୍ଥାରେ ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଆସିବେ?",
              originalHeading: "Clinical Red Flags & Emergency Re-admission Criteria",
              content: "ଯଦି ଦେହରେ ୧୦୧ ଡିଗ୍ରୀରୁ ଅଧିକ ଜ୍ୱର ହୁଏ, ବାରମ୍ବାର ବାନ୍ତି ହୁଏ, ପେଟରେ ଅସହ୍ୟ ଯନ୍ତ୍ରଣା ହୁଏ, ଆଖି ବା ଚର୍ମ ହଳଦିଆ ପଡ଼ିଯାଏ କିମ୍ବା କ୍ଷତ ସ୍ଥାନରୁ ପୂଜ ବାହାରେ, ତେବେ ବିଳମ୍ବ ନକରି ତୁରନ୍ତ ଇମରଜେନ୍ସି ବିଭାଗକୁ ଆସନ୍ତୁ |",
              plainContent: "ଜ୍ୱର, ବାନ୍ତି, ଅଧିକ ପେଟ ବିନ୍ଧା କିମ୍ବା ଘାରୁ ପୂଜ ବାହାରିଲେ ତୁରନ୍ତ ଇମରଜେନ୍ସିକୁ ଆସନ୍ତୁ।",
              audioNarration: "ଜରୁରୀ ସୂଚନା। ଯଦି ଆପଣଙ୍କୁ ପ୍ରବଳ ଜ୍ୱର ହୁଏ, ବାନ୍ତି ହୁଏ କିମ୍ବା କ୍ଷତ ସ୍ଥାନରୁ ପୂଜ ବାହାରେ, ତେବେ ସଙ୍ଗେ ସଙ୍ଗେ ଜରୁରୀକାଳୀନ ବିଭାଗକୁ ଯାଆନ୍ତୁ।",
              avatarSigns: ["fever", "pain", "vomit", "danger", "hospital", "quick"],
              icons: ["⚠️", "🌡️", "🚨"]
            },
            {
              heading: "ପରବର୍ତ୍ତୀ ଦେଖା ଏବଂ ସିଲେଇ କଟା",
              originalHeading: "Follow-up Care & Suture Removal Schedule",
              content: "ଆସନ୍ତା ଜୁନ୍ ୨୬ ତାରିଖ ଶୁକ୍ରବାର ସକାଳ ୯ଟାରେ ସର୍ଜିକାଲ୍ ଓପିଡି (Surgical OPD) ର ରୁମ୍ ନମ୍ବର ୧୪ କୁ ଆସିବେ | ସେଦିନ ସିଲେଇ କଟାଯିବ |",
              plainContent: "ଜୁନ୍ ୨୬ ଶୁକ୍ରବାର ସକାଳ ୯ଟାରେ ରୁମ୍ ନମ୍ବର ୧୪କୁ ସିଲେଇ କାଟିବା ପାଇଁ ଆସନ୍ତୁ।",
              audioNarration: "ଡାକ୍ତରୀ ଦେଖା। ଜୁନ୍ ୨୬ ତାରିଖ ଶୁକ୍ରବାର ସକାଳ ୯ଟା ସମୟରେ, ରୁମ୍ ନମ୍ବର ୧୪କୁ ଡାକ୍ତରଙ୍କ ପାଖକୁ ସିଲେଇ କାଟିବା ପାଇଁ ଆସନ୍ତୁ।",
              avatarSigns: ["calendar", "friday", "morning", "room", "1", "4", "doctor"],
              icons: ["📅", "🏥", "📍"]
            }
          ]
        },
        bhojpuri: {
          languageName: "Bhojpuri (भोजपुरी)",
          simplificationExplainer: "गांव के स्वास्थ कार्यकर्ता के भाषा में आसानी से समझीं:",
          originalTitleTranslated: "एपेक्स म्युनिसिपल अस्पताल - मरीज के छुट्टी के परचा और देखभाल के तरीका",
          sections: [
            {
              heading: "मरीज के हालत (का भइल रहे?)",
              originalHeading: "Patient Clinical Status & Diagnosis",
              content: "पित्त के थैली में पथरी आ सूजन रहे जवना खातिर रउआ भरती भइल रहीं। बिना चीर-फार (दूरबीन से) थैली निकाले के आपरेशन सफल भइल बा। अब रउआ एकदम नीक बानी आ घर जाए के छुट्टी मिल गइल बा।",
              plainContent: "पित्त के पथरी के आपरेशन नीक से हो गइल बा। अब रउआ ठीक बानी, घर जाईं।",
              audioNarration: "मरीज के हालचाल। रउआ पित्त के पथरी के ऑपरेशन सफल भइल बा। अब घाव धीरे-धीरे सूखा ताह। रउआ ठीक बानी आ घर जाए के छुट्टी मिल गइल बा।",
              avatarSigns: ["hospital", "surgery", "good", "go-home"],
              icons: ["🩺", "✅", "🏠"]
            },
            {
              heading: "दवाई खाए के तरीका (दवाई-दारू)",
              originalHeading: "Pharmacological Management Protocol",
              content: "1. अमोक्सिसिलिन गोली (Amoxicillin 625mg): सुबह एगो आ रात को एगो, खाना खाए के बाद (५ दिन ले खाइल बा - घाव में इनफेक्शन ना होखे खातिर)।\n2. पैरासिटामोल गोली (Paracetamol 650mg): जब देह-हाथ दुखाए या घाव दरद करे, तब दिन में ४ बार ले खा सकत बानी।\n3. पेंटोप्राजोल गोली (Pantoprazole 40mg): सुबह के नाश्ता से आधा घंटा पहिले खाली पेट एगो गोली (पेट में जलन आ गैस से बचाव खातिर)।",
              plainContent: "1. घाव सुखावे वाला दवाई: 5 दिन ले, सुबह-रात खाए के बाद एगो।\n2. दरद के दवाई: खाली दरद होखला पर (दिन में 4 बेर ले)।\n3. गैस के दवाई: सुबह खाली पेटे एगो गोली।",
              audioNarration: "दवाई खाए के नियम। रउआ के तीन गो दवाई दिहल गइल बा। पहिलका दवाई सुखावे वाला ह, सुबह आ रात खाए के बाद खाएब। दूसरका पैरासिटामोल ह, खाली दरद भइला पर खाएब। तीसरका गैस के दवाई ह, जेकरा सुबह खाली पेटे नाश्ता से पहिले खाए के बा।",
              avatarSigns: ["medicine", "morning", "night", "food", "before", "water"],
              icons: ["💊", "🍽️", "⏰"]
            },
            {
              heading: "खान-पान आ आराम के परहेज",
              originalHeading: "Activity Restrictions & Dietary Regimen",
              content: "आवे वाला २ हफ्ता ले तेल, घी, आ मशाला वाला भारी खाना मत खाईं। सादा आ आसानी से पचे वाला भोजन करीं। ५ किलो से बेसी वजन मत उठाईं, पेट पर जोर मत देईं आ भारी काम से बचीं।",
              plainContent: "तेल-मसाला एकदम मना बा। भारी वजन ना उठावे के बा, आराम करीं।",
              audioNarration: "परहेज। दू हफ्ता ले तेल मसाला वाला खाना मत खाईं। पांच किलो से बेसी वजन मत उठाईं। नीक से आराम करीं।",
              avatarSigns: ["food", "no-oil", "no-heavy-lifting", "rest"],
              icons: ["🍎", "🚫", "🛌"]
            },
            {
              heading: "कबो तुरंत अस्पताल भागे के बा?",
              originalHeading: "Clinical Red Flags & Emergency Re-admission Criteria",
              content: "अगर शरीर में १०१ डिग्री से बेसी तेज बुखार आवे, लगातार उल्टी होखे, पेट में तेज दरद उठे, आंख या चमड़ी पीयर (पीलिया नियर) दिखे, भा आपरेशन वाला घाव में से पीब/पानी बहे, त बिना देरी कइले तुरंत इमरजेंसी वार्ड में आईं।",
              plainContent: "तेज बुखार, उल्टी, पेट दुखाना, या टांका से पीब अइला पर तुरंत इमरजेंसी में भागीं।",
              audioNarration: "खतरा के घंटी। अगर तेज बुखार होखे, लगातार उल्टी होखे, पेट में भयानक दरद होखे, या घाव से पीब बहे, त बिना देरी कइले तुरंत इमरजेंसी में चली आईं।",
              avatarSigns: ["fever", "pain", "vomit", "danger", "hospital", "quick"],
              icons: ["⚠️", "🌡️", "🚨"]
            },
            {
              heading: "दुबारा देखावे आ टांका कटवावे के समय",
              originalHeading: "Follow-up Care & Suture Removal Schedule",
              content: "२६ जून, सुकवार के सुबह ९:०० बजे सर्जरी ओपीडी (Surgical OPD) के कमरा नंबर १४ में देखावे आ टांका कटवावे खातिर आवे के बा।",
              plainContent: "26 जून सुकवार के सुबह 9 बजे, कमरा नंबर 14 में टांका कटवावे आईं।",
              audioNarration: "डॉक्टर से मिले के समय। छब्बीस जून सुकवार के सुबह नौ बजे, कमरा नंबर चौदह में डॉक्टर से मिले आ टांका कटवावे आवे के बा।",
              avatarSigns: ["calendar", "friday", "morning", "room", "1", "4", "doctor"],
              icons: ["📅", "🏥", "📍"]
            }
          ]
        }
      }
    },
    ration_card: {
      id: "ration_card",
      title: {
        en: "Form IV-B: Application for Renewal of Family Ration Card & Category Assessment",
        hi: "फॉर्म IV-B: पारिवारिक राशन कार्ड के नवीनीकरण और श्रेणी मूल्यांकन के लिए आवेदन"
      },
      meta: {
        docType: "Ration Card Renewal Form",
        simplificationTemplate: "Civil Services Facilitator",
        detectedLanguage: "Official Bureaucratic Jargon"
      },
      originalContent: {
        title: "Form IV-B: Application for Renewal of Family Ration Card & Category Assessment",
        sections: [
          {
            heading: "Eligibility Criteria & Section 12 Verification",
            content: "Applicants must satisfy the criteria laid down under the National Food Security Act (2013). Household annual aggregate income from all sources must not exceed INR 1,50,000 for Priority Household (PHH) classification. Non-eligibility conditions include ownership of motorized four-wheeler, concrete structure exceeding 1000 sq ft, or land holding under perennial irrigation exceeding 2.5 acres."
          },
          {
            heading: "Compulsory Annexures & Documents",
            content: "The following documentary evidence must be attached to the application: 1. Aadhaar Card copy of all household members. 2. Employer-certified Income Certificate or Revenue Department income declaration. 3. Copy of existing Ration Card. 4. Ward Councilor/Panchayat Pradhan certificate of residency validation."
          },
          {
            heading: "Submission Channel & Statutory Deadline",
            content: "Applications must be routing-verified by the local fair price shop dealer and physically submitted in triplicate at the office of the Block Development Officer (BDO) or District Food Controller on or before the close of business on July 15th, 2026. Late submissions will result in temporary suspension of subsidies."
          }
        ]
      },
      adaptations: {
        tamil: {
          languageName: "Tamil (தமிழ்)",
          simplificationExplainer: "அரசு சேவை மைய உதவியாளர் இதை எளிய முறையில் விளக்குகிறார்:",
          originalTitleTranslated: "படிவம் IV-B: குடும்ப ரேஷன் கார்டு புதுப்பித்தல் மற்றும் தகுதி மதிப்பீட்டிற்கான விண்ணப்பம்",
          sections: [
            {
              heading: "யாரெல்லாம் விண்ணப்பிக்கலாம்? (தகுதிகள்)",
              originalHeading: "Eligibility Criteria & Section 12 Verification",
              content: "உங்கள் குடும்பத்தின் மொத்த ஆண்டு வருமானம் ரூ.1,50,000-க்கு குறைவாக இருக்க வேண்டும். உங்களிடம் சொந்தமாக 4-சக்கர வாகனம் (கார்/டிராக்டர்), 1000 சதுர அடிக்கு மேல் சிமெண்ட் வீடு, அல்லது 2.5 ஏக்கருக்கு மேல் விவசாய நிலம் இருக்கக் கூடாது.",
              plainContent: "ஆண்டு வருமானம் ரூ. 1.5 லட்சத்திற்குள் இருக்க வேண்டும். கார், பெரிய சிமெண்ட் வீடு அல்லது பெரிய விவசாய நிலம் இருக்கக் கூடாது.",
              audioNarration: "ரேஷன் கார்டு தகுதி. உங்கள் ஆண்டு வருமானம் ஒரு லட்சத்து ஐம்பதாயிரத்திற்குள் இருக்க வேண்டும். நான்கு சக்கர வாகனம், பெரிய வீடு, அல்லது இரண்டரை ஏக்கருக்கு மேல் நிலம் இருந்தால் ரேஷன் கார்டு புதுப்பிக்க முடியாது.",
              avatarSigns: ["family", "money", "low", "no-car", "no-house", "yes"],
              icons: ["👨‍👩‍👧‍👦", "💰", "🚫"]
            },
            {
              heading: "தேவையான ஆவணங்கள் (நகல்கள்)",
              originalHeading: "Compulsory Annexures & Documents",
              content: "விண்ணப்பத்துடன் கீழே உள்ள நகல்களை இணைக்க வேண்டும்:\n1. குடும்பத்தில் உள்ள அனைவரின் ஆதார் கார்டு நகல்.\n2. வருமான சான்றிதழ் (Income Certificate).\n3. பழைய ரேஷன் கார்டு நகல்.\n4. வார்டு கவுன்சிலர் அல்லது பஞ்சாயத்து தலைவரிடம் வாங்கிய முகவரி சான்று.",
              plainContent: "1. குடும்பத்தாரின் ஆதார் கார்டுகள்.\n2. வருமான சான்றிதழ்.\n3. பழைய ரேஷன் கார்டு.\n4. பஞ்சாயத்து/வார்டு உறுப்பினர் சான்றிதழ்.",
              audioNarration: "தேவையான தாள்கள். குடும்பத்தில் உள்ள எல்லாரின் ஆதார் அட்டை, வருமான சான்றிதழ், பழைய ரேஷன் கார்டு மற்றும் பஞ்சாயத்து தலைவர் கொடுத்த இருப்பிட சான்றிதழ் ஆகியவற்றை இணைக்க வேண்டும்.",
              avatarSigns: ["paper", "aadhaar", "money", "paper", "card", "signature"],
              icons: ["📄", "🆔", "📋"]
            },
            {
              heading: "எங்கு, எப்போது சமர்ப்பிக்க வேண்டும்?",
              originalHeading: "Submission Channel & Statutory Deadline",
              content: "பூர்த்தி செய்த விண்ணப்பத்தை உங்கள் ரேஷன் கடைக்காரரிடம் சரிபார்த்து கையெழுத்து பெற வேண்டும். பின்னர், அதனை வட்டார வளர்ச்சி அலுவலகத்தில் (BDO) அல்லது உணவு கட்டுப்பாட்டு அலுவலகத்தில் ஜூலை 15, 2026-க்குள் சமர்ப்பிக்க வேண்டும். தவறினால் ரேஷன் பொருட்கள் வழங்குவது தற்காலிகமாக நிறுத்தப்படும்.",
              plainContent: "விண்ணப்பத்தை ரேஷன் கடையில் காட்டிவிட்டு, ஜூலை 15-க்குள் BDO ஆபீசில் சமர்ப்பிக்கவும். இல்லையெனில் ரேஷன் பொருட்கள் நிறுத்தப்படும்.",
              audioNarration: "விண்ணப்பிக்கும் வழி. பூர்த்தி செய்த படிவத்தை ஜூலை பதினைந்தாம் தேதிக்குள் பி டி ஓ அலுவலகத்தில் தர வேண்டும். தவறினால் உங்கள் ரேஷன் பொருட்கள் தற்காலிகமாக நிறுத்தப்படலாம்.",
              avatarSigns: ["shop", "write", "office", "calendar", "july", "1", "5", "stop"],
              icons: ["🏢", "📅", "🚨"]
            }
          ]
        },
        odia: {
          languageName: "Odia (ଓଡ଼ିଆ)",
          simplificationExplainer: "ସେବା କେନ୍ଦ୍ର ଅଧିକାରୀଙ୍କ ଭାଷାରେ ସରଳ ବୁଝାମଣା:",
          originalTitleTranslated: "ଫର୍ମ IV-B: ପରିବାର ରାସନ କାର୍ଡ ନବୀକରଣ ଏବଂ ଶ୍ରେଣୀ ନିର୍ଦ୍ଧାରଣ ଆବେଦନ",
          sections: [
            {
              heading: "କାହାକୁ ମିଳିବ? (ଯୋଗ୍ୟତା ନିୟମ)",
              originalHeading: "Eligibility Criteria & Section 12 Verification",
              content: "ଆପଣଙ୍କ ପରିବାରର ସମସ୍ତ ଉତ୍ସରୁ ବାର୍ଷିକ ଆୟ ୧,୫୦,୦୦୦ ଟଙ୍କାରୁ କମ୍ ହୋଇଥିବା ଦରକାର | ଆପଣଙ୍କ ପାଖରେ ଚାରିଚକିଆ ଯାନ (କାର୍/ଟ୍ରାକ୍ଟର), ୧००୦ ବର୍ଗଫୁଟରୁ ଅଧିକ ପକ୍କାଘର କିମ୍ବା ୨.୫ ଏକରରୁ ଅଧିକ ଜଳସେଚିତ ଜମି ନଥିବା ଆବଶ୍ୟକ |",
              plainContent: "ବାର୍ଷିକ ଆୟ ୧.୫ ଲକ୍ଷ ଟଙ୍କାରୁ କମ୍ ହେବା ଦରକାର। ଚାରିଚକିଆ ଗାଡ଼ି କିମ୍ବା ବଡ଼ ପକ୍କାଘର ନଥିବ।",
              audioNarration: "ଆବେଦନ ଯୋଗ୍ୟତା। ଆପଣଙ୍କ ପରିବାରର ବାର୍ଷିକ ଆୟ ଦେଢ଼ ଲକ୍ଷ ଟଙ୍କାରୁ କମ୍ ହେବା ଉଚିତ୍। ଗାଡ଼ି କିମ୍ବା ବଡ଼ କୋଠାଘର ଥିଲେ ଏହା ମିଳିବ ନାହିଁ।",
              avatarSigns: ["family", "money", "low", "no-car", "no-house", "yes"],
              icons: ["👨‍👩‍👧‍👦", "💰", "🚫"]
            },
            {
              heading: "କେଉଁ କାଗଜପତ୍ର ଦରକାର? (ନକଲ)",
              originalHeading: "Compulsory Annexures & Documents",
              content: "ଆବେଦନ ସହିତ ନିମ୍ନଲିଖିତ କାଗଜପତ୍ରର ନକଲ ଯୋଡ଼ିବାକୁ ହେବ:\n1. ପରିବାରର ସମସ୍ତ ସଦସ୍ୟଙ୍କ ଆଧାର କାର୍ଡ ନକଲ |\n2. ଆୟ ପ୍ରମାଣ ପତ୍ର (Income Certificate) |\n3. ପୁରୁଣା ରାସନ କାର୍ଡ ନକଲ |\n4. ୱାର୍ଡ କାଉନସିଲର କିମ୍ବା ସରପଞ୍ଚଙ୍କ ଦ୍ୱାରା ଦିଆଯାଇଥିବା ବାସସ୍ଥାନ ପ୍ରମାଣ ପତ୍ର |",
              plainContent: "1. ପରିବାର ସମସ୍ତଙ୍କ ଆଧାର କାର୍ଡ।\n2. ଆୟ ପ୍ରମାଣ ପତ୍ର।\n3. ପୁରୁଣା ରାସନ କାର୍ଡ।\n4. ସରପଞ୍ଚ/ୱାର୍ଡ ସଭ୍ୟଙ୍କ ପ୍ରମାଣପତ୍ର।",
              audioNarration: "ଦରକାରୀ କାଗଜପତ୍ର। ଆବେଦନ ସହ ପରିବାରର ସମସ୍ତଙ୍କ ଆଧାର କାର୍ଡ, ଆୟ ପ୍ରମାଣ ପତ୍ର, ପୁରୁଣା ରାସନ କାର୍ଡ ଏବଂ ସରପଞ୍ଚଙ୍କ ବାସସ୍ଥାନ ଚିଠି ଦେବାକୁ ପଡ଼ିବ।",
              avatarSigns: ["paper", "aadhaar", "money", "paper", "card", "signature"],
              icons: ["📄", "🆔", "📋"]
            },
            {
              heading: "କେଉଁଠି ଓ କେବେ ଦେବେ?",
              originalHeading: "Submission Channel & Statutory Deadline",
              content: "ଆବେଦନ ପତ୍ରକୁ ପ୍ରଥମେ ଆପଣଙ୍କ ରାସନ ଦୋକାନୀଙ୍କ ଦ୍ୱାରା ଯାଞ୍ଚ କରାଇବେ | ଏହାପରେ ଜୁଲାଇ ୧୫, ୨୦୨୬ ସନ୍ଧ୍ୟା ପୂର୍ବରୁ ଆପଣଙ୍କ ବ୍ଲକ ଉନ୍ନୟନ ଅଧିକାରୀ (BDO) କିମ୍ବା ଖାଦ୍ୟ ଯୋଗାଣ ଅଫିସରେ ଜମା କରିବେ | ବିଳମ୍ବ ହେଲେ ରାସନ ମିଳିବା ବନ୍ଦ ହୋଇପାରେ |",
              plainContent: "ରାସନ ଦୋକାନୀଙ୍କ ସାଇନ୍ ନେଇ ଜୁଲାଇ ୧୫ ସୁଦ୍ଧା BDO ଅଫିସରେ ଜମା କରନ୍ତୁ, ନଚେତ୍ ରାସନ ବନ୍ଦ ହୋଇଯିବ।",
              audioNarration: "ଜମା କରିବା ସମୟ। ଆବେଦନକୁ ରାସନ ଦୋକାନୀଙ୍କ ଦ୍ଵାରା ସାଇନ କରାଇ ଜୁଲାଇ ୧୫ ତାରିଖ ସୁଦ୍ଧା ବ୍ଲକ ଅଫିସ ବା ବି ଡି ଓ ଅଫିସରେ ଜମା କରନ୍ତୁ।",
              avatarSigns: ["shop", "write", "office", "calendar", "july", "1", "5", "stop"],
              icons: ["🏢", "📅", "🚨"]
            }
          ]
        },
        bhojpuri: {
          languageName: "Bhojpuri (भोजपुरी)",
          simplificationExplainer: "सरकारी सेवा केंद्र के बाबू आसान भाषा में समझावत बानी:",
          originalTitleTranslated: "फार्म IV-B: राशन कार्ड के नवीनीकरण आ नया कार्ड बनवावे खातिर आवेदन",
          sections: [
            {
              heading: "केकरा राशन कार्ड मिली? (लायक होखे के नियम)",
              originalHeading: "Eligibility Criteria & Section 12 Verification",
              content: "आपके पूरा परिवार के सालाना कमाई ₹१,५०,००० (डेढ़ लाख) से कम होखे के चाहीं। आपके लगे चार चक्का गाड़ी (कार, ट्रैक्टर), १००० वर्ग फुट से बड़ पक्का के मकान, चाहे ढाई एकड़ से बेसी जोत वाला सिंचित जमीन ना होखे के चाहीं।",
              plainContent: "सालाना कमाई ₹1.5 लाख से कम होखे। कार, बड़ पक्का मकान, या ढेर खेती के जमीन ना होखे।",
              audioNarration: "राशन कार्ड खातिर योग्यता। रउआ परिवार के सालाना कमाई डेढ़ लाख से कम होखे के चाहीं। गाड़ी, बड़ मकान या ढेर जमीन भइला पर ई राशन कार्ड ना मिली।",
              avatarSigns: ["family", "money", "low", "no-car", "no-house", "yes"],
              icons: ["👨‍👩‍👧‍👦", "💰", "🚫"]
            },
            {
              heading: "का का कागज लागी? (फोटोकॉपी)",
              originalHeading: "Compulsory Annexures & Documents",
              content: "फार्म के साथ ई सब कागज नत्थी करे के बा:\n1. घर के सब लोगन के आधार कार्ड के फोटोकॉपी।\n2. कमाई के रसीद/आय प्रमाण पत्र (पटवारी या तहसीलदार के जारी)।\n3. पुरान राशन कार्ड के फोटोकॉपी।\n4. वार्ड कमिश्नर या प्रधान के दिहल निवास प्रमाण पत्र (घर के पता के सबूत)।",
              plainContent: "1. घर के सबके आधार कार्ड।\n2. आय प्रमाण पत्र।\n3. पुरनका राशन कार्ड।\n4. प्रधान या पार्षद के निवास परचा।",
              audioNarration: "जरूरी कागज। फार्म के साथ घर के सब सदस्यन के आधार कार्ड के कॉपी, आय प्रमाण पत्र, पुरान राशन कार्ड आ मुखिया या पार्षद के निवास प्रमाण पत्र लगावे के बा।",
              avatarSigns: ["paper", "aadhaar", "money", "paper", "card", "signature"],
              icons: ["📄", "🆔", "📋"]
            },
            {
              heading: "कहाँ आ कब ले जमा करे के बा?",
              originalHeading: "Submission Channel & Statutory Deadline",
              content: "फार्म भर के पहिले राशन दुकानदार से दस्तखत/सत्यापन करा लीं। ओकरा बाद एकरा के ब्लॉक (BDO ऑफिस) चाहे जिला खाद्य विभाग में १५ जुलाई, २०२६ से पहिले जमा कर दीं। देर कइला पर राशन मिलना बंद हो जाई।",
              plainContent: "राशन डीलर से जांच करा के 15 जुलाई ले ब्लॉक ऑफिस में जमा कर दीं, ना त राशन बंद हो जाई।",
              audioNarration: "जमा करे के तारीख। फार्म के राशन डीलर से दस्तखत करा के पंद्रह जुलाई से पहिले ब्लॉक ऑफिस में जमा कइल जरूरी बा। ना त राशन के समान मिलना बंद हो जाई।",
              avatarSigns: ["shop", "write", "office", "calendar", "july", "1", "5", "stop"],
              icons: ["🏢", "📅", "🚨"]
            }
          ]
        }
      }
    },
    school_admission: {
      id: "school_admission",
      title: {
        en: "Directorate of Public Instruction - Notification for Free & Compulsory Primary Admission (RTE Act Sec 12)",
        hi: "लोक शिक्षण निदेशालय - निःशुल्क एवं अनिवार्य प्राथमिक प्रवेश के लिए अधिसूचना (आरटीई अधिनियम धारा 12)"
      },
      meta: {
        docType: "Primary School Enrollment Notice",
        simplificationTemplate: "Education Officer Explainer",
        detectedLanguage: "Official Bureaucratic Jargon"
      },
      originalContent: {
        title: "Directorate of Public Instruction - Notification for Free & Compulsory Primary Admission (RTE Act Sec 12)",
        sections: [
          {
            heading: "Statutory Age Allocation Matrix",
            content: "As mandated by the Right of Children to Free and Compulsory Education Act (2009), enrollment eligibility for Grade I requires the ward to have attained a minimum threshold age of 6 years as of March 31st, 2026. Age verification must be authenticated via a municipal birth registry certificate or notarized affidavit."
          },
          {
            heading: "Socio-Economic Weaker Section (EWS) Quota Allocation",
            content: "Twenty-five percent (25%) of aggregate entry-level seats in private unassisted educational facilities are reserved for weaker sections and disadvantaged groups. Applications under this quota must be backed by a certified caste certificate, parental income declaration, or disability card issued by a competent authority."
          },
          {
            heading: "Administrative Registration Protocol",
            content: "Online registration forms must be uploaded through the official state education administrative portal. Applicants must designate a maximum of five (5) neighborhood schools within a 3km radial distance. The selection will be executed via a randomized automated lottery algorithm on July 10th, 2026."
          }
        ]
      },
      adaptations: {
        tamil: {
          languageName: "Tamil (தமிழ்)",
          simplificationExplainer: "தலைமை ஆசிரியர் இதை எளிய முறையில் விளக்குகிறார்:",
          originalTitleTranslated: "பொதுக் கல்வி இயக்ககம் - இலவச மற்றும் கட்டாய ஆரம்பக் கல்வி சேர்க்கை அறிவிப்பு (RTE சட்டம்)",
          sections: [
            {
              heading: "குழந்தையின் வயது வரம்பு (வயது தகுதி)",
              originalHeading: "Statutory Age Allocation Matrix",
              content: "மத்திய அரசின் கட்டாயக் கல்வி உரிமைச் சட்டத்தின்படி (RTE), ஒன்றாம் வகுப்பில் சேர குழந்தைக்கு 31 மார்ச் 2026 தேதியன்று 6 வயது பூர்த்தியாகி இருக்க வேண்டும். இதற்கு நகராட்சி பிறப்புச் சான்றிதழ் அவசியமாகும்.",
              plainContent: "ஒன்றாம் வகுப்பில் சேர மார்ச் 31, 2026 அன்று 6 வயது முடிந்திருக்க வேண்டும். பிறப்புச் சான்றிதழ் தேவை.",
              audioNarration: "வயது தகுதி. ஒன்றாம் வகுப்பில் சேர குழந்தைக்கு மார்ச் முப்பத்தி ஒன்றாம் தேதியன்று ஆறு வயது முடிந்திருக்க வேண்டும். பிறப்புச் சான்றிதழை தயாராக வைக்கவும்.",
              avatarSigns: ["child", "calendar", "number-six", "age", "birth-certificate"],
              icons: ["👶", "📅", "🆔"]
            },
            {
              heading: "25% இலவச இட ஒதுக்கீடு (EWS சீட்டுகள்)",
              originalHeading: "Socio-Economic Weaker Section (EWS) Quota Allocation",
              content: "தனியார் பள்ளிகளில் 25% இடங்கள் ஏழை மற்றும் நலிவடைந்த பிரிவைச் சேர்ந்த குழந்தைகளுக்கு இலவசமாக ஒதுக்கப்படும். இதற்கு சாதிச் சான்றிதழ், பெற்றோரின் வருமானச் சான்றிதழ் அல்லது மாற்றுத்திறனாளி சான்றிதழை சமர்ப்பிக்க வேண்டும்.",
              plainContent: "தனியார் பள்ளிகளில் ஏழை குழந்தைகளுக்கு 25% இடங்கள் இலவசம். சாதி மற்றும் வருமான சான்றிதழ்கள் தேவை.",
              audioNarration: "இலவச இடங்கள். தனியார் பள்ளிகளில் இருபத்தி ஐந்து சதவீத இடங்கள் ஏழை எளிய குடும்பத்து குழந்தைகளுக்கு இலவசமாக ஒதுக்கப்படும். வருமான சான்றிதழ் அல்லது சாதி சான்றிதழ் இதற்குத் தேவை.",
              avatarSigns: ["money", "free", "school", "quota", "paper"],
              icons: ["💼", "🎒", "📄"]
            },
            {
              heading: "விண்ணப்பிப்பது எப்படி? (பதிவு முறை)",
              originalHeading: "Administrative Registration Protocol",
              content: "அரசு கல்வித் துறை இணையதளத்தில் ஆன்லைன் மூலம் மட்டுமே விண்ணப்பிக்க முடியும். உங்கள் வீட்டைச் சுற்றியுள்ள 3 கிலோமீட்டர் தூரத்திற்குள் இருக்கும் ஏதேனும் 5 பள்ளிகளைத் தேர்ந்தெடுக்கலாம். ஜூலை 10, 2026 அன்று ஆன்லைன் குலுக்கல் (Lottery) முறையில் குழந்தைகள் தேர்ந்தெடுக்கப்படுவர்.",
              plainContent: "இணையதளத்தில் ஆன்லைனில் விண்ணப்பிக்கவும். வீட்டிற்கு அருகே உள்ள 5 பள்ளிகளை தேர்வு செய்யலாம். ஜூலை 10 குலுக்கல் மூலம் தேர்வு நடக்கும்.",
              audioNarration: "விண்ணப்பிக்கும் முறை. இணையதளத்தில் ஆன்லைன் மூலமாக விண்ணப்பிக்கவும். உங்கள் வீட்டிற்கு அருகில் உள்ள ஐந்து பள்ளிகளை தேர்வு செய்ய வேண்டும். ஜூலை பத்தாம் தேதி குலுக்கல் முறையில் சேர்க்கை அறிவிக்கப்படும்.",
              avatarSigns: ["computer", "online", "write", "school", "calendar", "july", "1", "0", "lottery"],
              icons: ["💻", "🏫", "🎲"]
            }
          ]
        },
        odia: {
          languageName: "Odia (ଓଡ଼ିଆ)",
          simplificationExplainer: "ପ୍ରଧାନଶିକ୍ଷକଙ୍କ ଭାଷାରେ ସରଳ ବୁଝାମଣା:",
          originalTitleTranslated: "ସାଧାରଣ ଶିକ୍ଷା ନିର୍ଦ୍ଦେଶାଳୟ - ମାଗଣା ଓ ବାଧ୍ୟତାମୂଳକ ପ୍ରାଥମିକ ନାମଲେଖା ବିଜ୍ଞପ୍ତି (RTE ସିଟ୍)",
          sections: [
            {
              heading: "ପିଲାଙ୍କ ବୟସ ସୀମା (ବୟସ ଯୋଗ୍ୟତା)",
              originalHeading: "Statutory Age Allocation Matrix",
              content: "ମାଗଣା ଓ ବାଧ୍ୟତାମୂଳକ ଶିକ୍ଷା ଅଧିକାର ସୂତ୍ରେ (RTE), ପ୍ରଥମ ଶ୍ରେଣୀରେ ନାମ ଲେଖାଇବା ପାଇଁ ୩୧ ମାର୍ଚ୍ଚ ୨୦୨୬ ସୁଦ୍ଧା ପିଲାଙ୍କ ବୟସ ଅତିକମରେ ୬ ବର୍ଷ ହୋଇଥିବା ଆବଶ୍ୟକ | ବୟସ ପ୍ରମାଣ ପାଇଁ ମ୍ୟୁନିସିପାଲିଟି ଜନ୍ମ ପ୍ରମାଣପତ୍ର ଜରୁରୀ |",
              plainContent: "ପ୍ରଥମ ଶ୍ରେଣୀ ପାଇଁ ମାର୍ଚ୍ଚ ୩୧ ସୁଦ୍ଧା ପିଲାର ବୟସ ୬ ବର୍ଷ ହୋଇଥିବା ଦରକାର। ଜନ୍ମ ପ୍ରମାଣପତ୍ର ଆବଶ୍ୟକ।",
              audioNarration: "ପିଲାଙ୍କ ବୟସ। ପ୍ରଥମ ଶ୍ରେଣୀରେ ନାମ ଲେଖାଇବା ପାଇଁ ପିଲାକୁ ମାର୍ଚ୍ଚ ୩୧ ସୁଦ୍ଧା ୬ ବର୍ଷ ହୋଇଥିବା ଆବଶ୍ୟକ। ନିଶ୍ଚିତ ଭାବରେ ଜନ୍ମ ପ୍ରମାଣପତ୍ର ପାଖରେ ରଖନ୍ତୁ।",
              avatarSigns: ["child", "calendar", "number-six", "age", "birth-certificate"],
              icons: ["👶", "📅", "🆔"]
            },
            {
              heading: "୨୫% ମାଗଣା ସିଟ୍ (ଆରକ୍ଷଣ ସୁବିଧା)",
              originalHeading: "Socio-Economic Weaker Section (EWS) Quota Allocation",
              content: "ଘରୋଇ ଇଂରାଜୀ ସ୍କୁଲ୍ ଗୁଡ଼ିକରେ ୨୫% ସିଟ୍ ଗରିବ ଓ ପଛୁଆ ବର୍ଗର ପିଲାଙ୍କ ପାଇଁ ମାଗଣାରେ ସଂରକ୍ଷିତ ଥାଏ | ଏଥିପାଇଁ ଜାତି ପ୍ରମାଣ ପତ୍ର, ଆୟ ପ୍ରମାଣ ପତ୍ର କିମ୍ବା ଦିବ୍ୟାଙ୍ଗ କାର୍ଡ ଦେବାକୁ ପଡ଼ିବ |",
              plainContent: "ଘରୋଇ ସ୍କୁଲରେ ୨୫% ସିଟ୍ ଗରିବ ପିଲାଙ୍କ ପାଇଁ ମାଗଣା। ଜାତି ଓ ଆୟ ପ୍ରମାଣପତ୍ର ଆବଶ୍ୟକ।",
              audioNarration: "ମାଗଣା ଆସନ ସଂରକ୍ଷଣ। ବେସରକାରୀ ସ୍କୁଲ ମାନଙ୍କରେ ପଚିଶ ପ୍ରତିଶତ ସିଟ୍ ଗରିବ ପରିବାରର ପିଲାଙ୍କ ପାଇଁ ମାଗଣାରେ ରଖାଯାଇଛି। ଆୟ କିମ୍ବା ଜାତି ପ୍ରମାଣ ପତ୍ର ଜମା କରନ୍ତୁ।",
              avatarSigns: ["money", "free", "school", "quota", "paper"],
              icons: ["💼", "🎒", "📄"]
            },
            {
              heading: "କିପରି ନାମ ଲେଖାଇବେ? (ଆବେଦନ ନିୟମ)",
              originalHeading: "Administrative Registration Protocol",
              content: "ରାଜ୍ୟ ଶିକ୍ଷା ବିଭାଗର ୱେବସାଇଟ୍ ଜରିଆରେ କେବଳ ଅନଲାଇନ୍ ଆବେଦନ ହୋଇପାରିବ | ୩ କିଲୋମିଟର ପରିସୀମା ମଧ୍ୟରେ ଥିବା ୫ଟି ସ୍କୁଲ୍ ବାଛି ପାରିବେ | ଜୁଲାଇ ୧୦, ୨୦୨୬ ରେ ଅନଲାଇନ୍ ଲଟେରୀ (Lottery) ଜରିଆରେ ପିଲାଙ୍କୁ ଚୟନ କରାଯିବ |",
              plainContent: "ୱେବସାଇଟରେ ଅନଲାଇନ୍ ଫର୍ମ ଭରନ୍ତୁ। ୩ କିମି ମଧ୍ୟରେ ୫ଟି ସ୍କୁଲ ବାଛନ୍ତୁ। ଜୁଲାଇ ୧୦ ଲଟେରୀ ଦ୍ଵାରା ଚୟନ ହେବ।",
              audioNarration: "ନାମ ଲେଖା ନିୟମ। ଅନଲାଇନରେ ଫର୍ମ ପୂରଣ କରନ୍ତୁ। ଆପଣଙ୍କ ଘର ପାଖ ୩ କିଲୋମିଟର ଭିତରେ ଥିବା ୫ଟି ସ୍କୁଲ ବାଛନ୍ତୁ। ଜୁଲାଇ ୧୦ ତାରିଖରେ ଲଟେରୀ ଦ୍ଵାରା ନାମ ଲେଖା ତାଲିକା ପ୍ରକାଶ ପାଇବ।",
              avatarSigns: ["computer", "online", "write", "school", "calendar", "july", "1", "0", "lottery"],
              icons: ["💻", "🏫", "🎲"]
            }
          ]
        },
        bhojpuri: {
          languageName: "Bhojpuri (भोजपुरी)",
          simplificationExplainer: "हेड मास्टर साहब आसान देहाती भाषा में समझावत बानी:",
          originalTitleTranslated: "लोक शिक्षण निदेशालय - प्राइमरी स्कूल में मुफ्त और अनिवार्य सरकारी दाखिला के सूचना (RTE कानून)",
          sections: [
            {
              heading: "लइका के उम्र सीमा (दाखिला के उमर)",
              originalHeading: "Statutory Age Allocation Matrix",
              content: "शिक्षा के अधिकार (RTE) कानून के तहत, पहिलका क्लास में भर्ती खातिर ३१ मार्च, २०२६ ले लइका के उम्र कम से कम ६ साल पूरा होखे के चाहीं। उम्र के जांच खातिर जनम प्रमाण पत्र (नगरपालिका या कचहरी के हलफनामा) जरूरी बा।",
              plainContent: "पहिला क्लास खातिर 31 मार्च ले लइका के उमर 6 साल होखे के चाहीं। जनम परचा जरूरी बा।",
              audioNarration: "लइका के उमर। पहिली कक्षा में नाम लिखवावे खातिर लइका के उमर एकतीस मार्च ले छह बरिस पूरा होखे के चाहीं। जनम प्रमाण पत्र जरूर लगावेब।",
              avatarSigns: ["child", "calendar", "number-six", "age", "birth-certificate"],
              icons: ["👶", "📅", "🆔"]
            },
            {
              heading: "25% फ्री सीट (गरीब आ कमजोर परिवार खातिर)",
              originalHeading: "Socio-Economic Weaker Section (EWS) Quota Allocation",
              content: "प्राइवेट स्कूलन में २५ प्रतिशत (२५%) सीट गरीब, कमजोर वर्ग आ लाचार परिवार के लइकन खातिर मुफ्त आरक्षित बा। एकरा खातिर जाति प्रमाण पत्र, आमदनी के रसीद, या बिकलांगता के सरकारी कार्ड लगावे के पड़ी।",
              plainContent: "प्राइवेट स्कूल में 25% सीट गरीब लइकन खातिर एकदम फ्री बा। जाति आ आय प्रमाण पत्र चाहीं।",
              audioNarration: "मुफ्त दाखिला। प्राइवेट स्कूलन में पचीस परसेंट सीट गरीब घर के लइकन खातिर एकदम फ्री बा। जाति आ आय प्रमाण पत्र जमा कइल जरूरी बा।",
              avatarSigns: ["money", "free", "school", "quota", "paper"],
              icons: ["💼", "🎒", "📄"]
            },
            {
              heading: "दाखिला कइसे होई? (रजिस्ट्रेशन के तरीका)",
              originalHeading: "Administrative Registration Protocol",
              content: "रजिस्ट्रेशन खाली सरकारी वेबसाइट पर जाके ऑनलाइन करे के बा। अपने घर के ३ किलोमीटर के भीतर के ५ गो स्कूल के नाम पसंद करे के बा। १० जुलाई, २०२६ के कंप्यूटर से ऑनलाइन लॉटरी (कुदाल) फेंक के लइकन के नाम चुनल जाई।",
              plainContent: "ऑनलाइन फॉर्म भरे के बा। घर से 3 किमी भीतर के 5 गो स्कूल चुनीं। 10 जुलाई के कंप्यूटर लॉटरी से नाम निकली।",
              audioNarration: "फॉर्म भरे के तरीका। कंप्यूटर से ऑनलाइन फॉर्म भरे के बा। अपना घर से तीन किलोमीटर के भीतर के पांच गो स्कूल के नाम चुन लीं। दस जुलाई के कंप्यूटर लॉटरी से नाम निकालल जाई।",
              avatarSigns: ["computer", "online", "write", "school", "calendar", "july", "1", "0", "lottery"],
              icons: ["💻", "🏫", "🎲"]
            }
          ]
        }
      }
    }
  },
  communityCorrections: [
    {
      id: 1,
      documentName: "Hospital Discharge Summary",
      language: "Bhojpuri",
      originalText: "Tab. Paracetamol (650mg) QDS (four times daily) PRN (as required) for pain management.",
      suggestedCorrection: "पैरासिटामोल दवाई जब देह-हाथ दुखाए या टांका दरद करे, तब दिन में ४ बार खाइल जा सकेला।",
      contributor: "आरती देवी (आशा कार्यकर्ता)",
      votes: 142
    },
    {
      id: 2,
      documentName: "Ration Card Renewal Form",
      language: "Tamil",
      originalText: "Ownership of motorized four-wheeler or concrete structure exceeding 1000 sq ft.",
      suggestedCorrection: "சொந்தமாக 4-சக்கர வண்டியோ (கார்/டிராக்டர்) அல்லது மாடி வீடோ (1000 சதுர அடிக்கு மேல்) இருக்கக் கூடாது.",
      contributor: "கார்த்திகேயன் (சமூக ஆர்வலர்)",
      votes: 98
    },
    {
      id: 3,
      documentName: "Primary School Enrollment Notice",
      language: "Odia",
      originalText: "Verification must be authenticated via a municipal birth registry certificate.",
      suggestedCorrection: "ବୟସର ପ୍ରମାଣ ପାଇଁ ମ୍ୟୁନିସିପାଲିଟି ବା ସରପଞ୍ଚଙ୍କ ଜନ୍ମ ପ୍ରମାଣପତ୍ର ଆବଶ୍ୟକ |",
      contributor: "ସସ୍ମିତା ସେନାପତି (ଅଙ୍ଗନୱାଡ଼ି କର୍ମୀ)",
      votes: 75
    }
  ]
};

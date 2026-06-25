package genediff.disease;

import java.util.*;



public class GeneticDiseaseDatabase {

    public static class DiseaseRecord {
        private String diseaseId;
        private String diseaseName;
        private String affectedGene;
        private String referenceSequence;   
        private String mutantSequence;      
        private String chromosome;
        private String mutationType;        
        private String medicalDescription;
        private String symptoms;
        private String inheritance;
        private String prevalence;

        public DiseaseRecord(String diseaseId, String diseaseName, String affectedGene,
                             String chromosome, String referenceSequence, String mutantSequence,
                             String mutationType, String medicalDescription,
                             String symptoms, String inheritance, String prevalence) {
            this.diseaseId = diseaseId;
            this.diseaseName = diseaseName;
            this.affectedGene = affectedGene;
            this.chromosome = chromosome;
            this.referenceSequence = referenceSequence.toUpperCase();
            this.mutantSequence = mutantSequence.toUpperCase();
            this.mutationType = mutationType;
            this.medicalDescription = medicalDescription;
            this.symptoms = symptoms;
            this.inheritance = inheritance;
            this.prevalence = prevalence;
        }

        
        public String getDiseaseId() { return diseaseId; }
        public String getDiseaseName() { return diseaseName; }
        public String getAffectedGene() { return affectedGene; }
        public String getReferenceSequence() { return referenceSequence; }
        public String getMutantSequence() { return mutantSequence; }
        public String getChromosome() { return chromosome; }
        public String getMutationType() { return mutationType; }
        public String getMedicalDescription() { return medicalDescription; }
        public String getSymptoms() { return symptoms; }
        public String getInheritance() { return inheritance; }
        public String getPrevalence() { return prevalence; }
    }

    private static final Map<String, DiseaseRecord> DATABASE = new LinkedHashMap<>();

    static {
       
        DATABASE.put("SICKLE_CELL", new DiseaseRecord(
                "SICKLE_CELL",
                "Sickle Cell Anemia",
                "HBB (Beta-Globin)",
                "Chromosome 11",
                "ATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAG",
                "ATGGTGCATCTGACTCCTGTGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAG",
                "Point Substitution",
                "A single nucleotide substitution (A→T) at position 17 of the HBB gene changes codon 6 from GAG (Glutamic acid) to GTG (Valine). This causes hemoglobin to polymerize under low oxygen, distorting red blood cells into a sickle shape.",
                "Chronic hemolytic anemia, painful vaso-occlusive crises, stroke, organ damage, increased infection risk",
                "Autosomal Recessive",
                "~100,000 Americans affected; 1 in 365 African American births"
        ));

        DATABASE.put("CYSTIC_FIBROSIS", new DiseaseRecord(
                "CYSTIC_FIBROSIS",
                "Cystic Fibrosis",
                "CFTR",
                "Chromosome 7",
                "ATCATTTTTTTAATGGAAAAGATAATGATAACAAGCTTCAGCTTTTTTTTCCTTTACTTGTATTTTTTCACGAAATATAAAGTATCATTTTTTTAATGG",
                "ATCATTTTTTTAATGGAAAAGATAATGATAACAAGCTTCAGCTTTTTTTTCCTTTACTTGTTTTTTTCACGAAATATAAAGTATCATTTTTTTAATGG",
                "Deletion",
                "Deletion of phenylalanine (Phe508) in the CFTR protein due to 3-base deletion (CTT→---). This prevents the CFTR chloride channel from reaching the cell surface, causing thick mucus buildup in lungs and digestive tract.",
                "Chronic lung infections, mucus buildup, digestive enzyme deficiency, infertility in males, salty sweat",
                "Autosomal Recessive",
                "~35,000 in USA; 1 in 2,500–3,500 white births"
        ));

        
        DATABASE.put("PKU", new DiseaseRecord(
                "PKU",
                "Phenylketonuria (PKU)",
                "PAH (Phenylalanine Hydroxylase)",
                "Chromosome 12",
                "ATGGCTTCTCCCAAAGAAATACGTGGGGTCCTTGTTGGTTGGAAAGCCGTGCAGCCAGAAGATACTTTCCAACGTATGTCCCGGCGGCCAGCCTGAAGG",
                "ATGGCTTCTCCCAAAGAAATACGTGGGGTCCTTGTTGGTTGGAAAGCCGTGCAGCCAGAAGATACTTTCCAATGTATGTCCCGGCGGCCAGCCTGAAGG",
                "Point Substitution",
                "Mutation R408W: CGG (Arginine) → TGG (Tryptophan) at codon 408 of the PAH gene. This eliminates phenylalanine hydroxylase activity, causing phenylalanine accumulation that damages the developing brain if untreated.",
                "Intellectual disability (if untreated), seizures, behavioral problems, musty body odor, light skin/hair",
                "Autosomal Recessive",
                "1 in 10,000–15,000 births in USA; screened at birth"
        ));

       
        DATABASE.put("HUNTINGTONS", new DiseaseRecord(
                "HUNTINGTONS",
                "Huntington's Disease",
                "HTT (Huntingtin)",
                "Chromosome 4",
                "ATGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAAGCTGGAGCCGCAGCAGCAGCAGCAGCC",
                "ATGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAAGCTGGAGCC",
                "Trinucleotide Expansion",
                "Expansion of CAG trinucleotide repeat in exon 1 of HTT gene. Normal: 10-35 CAG repeats. Disease: 36+ repeats. Each CAG encodes Glutamine; expanded polyglutamine tract causes neuronal death in striatum and cortex.",
                "Progressive motor dysfunction (chorea), cognitive decline, psychiatric symptoms, onset typically 30-50 years",
                "Autosomal Dominant",
                "~30,000 in USA; 1 in 10,000-20,000"
        ));

        
        DATABASE.put("BRCA1", new DiseaseRecord(
                "BRCA1",
                "BRCA1 Hereditary Breast/Ovarian Cancer",
                "BRCA1",
                "Chromosome 17",
                "ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCCATCTGTCTGGAGTTGATCAAGG",
                "ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCCATCTGTCTGGAGTTGATCAAGG",
                "Deletion (Frameshift)",
                "The 185delAG mutation deletes 2 bases (AG) near the beginning of BRCA1, causing a frameshift that leads to a truncated, non-functional protein. BRCA1 normally repairs DNA double-strand breaks; loss of function dramatically increases cancer risk.",
                "Greatly elevated lifetime risk: ~70% for breast cancer, ~44% for ovarian cancer",
                "Autosomal Dominant",
                "BRCA1 mutations in ~1 in 400 general population; higher in Ashkenazi Jewish (1 in 40)"
        ));

        DATABASE.put("THALASSEMIA", new DiseaseRecord(
                "THALASSEMIA",
                "Beta-Thalassemia",
                "HBB (Beta-Globin)",
                "Chromosome 11",
                "ATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGTTGGTATCAAGGTTACAAGACAGGTTTAAGGAGACC",
                "ATGGTGCATCTGACTCCTAAGCAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGTTGGTATCAAGGTTACAAGACAGGTTTAAGGAGACC",
                "Nonsense Substitution",
                "Point mutation GAG→AAG introduces a premature stop codon (nonsense mutation) in the HBB gene, drastically reducing or eliminating beta-globin production. This prevents formation of normal adult hemoglobin (HbA), causing severe anemia.",
                "Severe anemia requiring regular blood transfusions, bone deformities, organ damage, growth retardation",
                "Autosomal Recessive",
                "~1.5% of global population are carriers; common in Mediterranean, Middle East, South Asia"
        ));
    }

    public static Map<String, DiseaseRecord> getAllDiseases() {
        return Collections.unmodifiableMap(DATABASE);
    }

    public static DiseaseRecord getDisease(String diseaseId) {
        return DATABASE.get(diseaseId);
    }

    public static List<String> getDiseaseIds() {
        return new ArrayList<>(DATABASE.keySet());
    }

    
    public static String detectDisease(String patientSequence, String referenceId) {
        DiseaseRecord ref = DATABASE.get(referenceId);
        if (ref == null) return null;

        String pat = patientSequence.toUpperCase().trim();
        String mutant = ref.getMutantSequence();

        
        int matches = 0;
        int minLen = Math.min(pat.length(), mutant.length());
        for (int i = 0; i < minLen; i++) {
            if (pat.charAt(i) == mutant.charAt(i)) matches++;
        }
        double similarity = (double) matches / Math.max(pat.length(), mutant.length());

        
        if (similarity >= 0.85) {
            return referenceId;
        }
        return null;
    }
}

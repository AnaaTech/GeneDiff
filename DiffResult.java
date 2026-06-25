package genediff.model;

import java.util.ArrayList;
import java.util.List;


public class DiffResult {

    public static class DiffEntry {
        private int position;
        private String referenceBase;
        private String patientBase;
        private GeneNode.DiffState state;
        private String codonId;
        private int codonPosition; 
        public DiffEntry(int position, String referenceBase, String patientBase,
                         GeneNode.DiffState state, String codonId, int codonPosition) {
            this.position = position;
            this.referenceBase = referenceBase;
            this.patientBase = patientBase;
            this.state = state;
            this.codonId = codonId;
            this.codonPosition = codonPosition;
        }

        public int getPosition() { return position; }
        public String getReferenceBase() { return referenceBase; }
        public String getPatientBase() { return patientBase; }
        public GeneNode.DiffState getState() { return state; }
        public String getCodonId() { return codonId; }
        public int getCodonPosition() { return codonPosition; }

        public boolean isAnomalous() {
            return state != GeneNode.DiffState.MATCH;
        }
    }

    private List<DiffEntry> entries;
    private int matchCount;
    private int mutationCount;
    private int missingCount;
    private int extraCount;
    private boolean isHealthy;
    private String detectedDisease;
    private String diseaseDescription;
    private String patientId;
    private String referenceGeneName;

    
    private int editDistance;

    public DiffResult(String patientId, String referenceGeneName) {
        this.patientId = patientId;
        this.referenceGeneName = referenceGeneName;
        this.entries = new ArrayList<>();
    }

    public void addEntry(DiffEntry entry) {
        entries.add(entry);
        switch (entry.getState()) {
            case MATCH:   matchCount++;    break;
            case MUTATED: mutationCount++; break;
            case MISSING: missingCount++;  break;
            case EXTRA:   extraCount++;    break;
        }
    }

    public void computeVerdict() {
        this.isHealthy = (mutationCount == 0 && missingCount == 0 && extraCount == 0);
    }

    public int getTotalAnomalies() {
        return mutationCount + missingCount + extraCount;
    }

    public double getSimilarityPercent() {
        int total = entries.size();
        if (total == 0) return 100.0;
        return (matchCount * 100.0) / total;
    }


    public List<DiffEntry> getEntries() { return entries; }
    public int getMatchCount() { return matchCount; }
    public int getMutationCount() { return mutationCount; }
    public int getMissingCount() { return missingCount; }
    public int getExtraCount() { return extraCount; }
    public boolean isHealthy() { return isHealthy; }
    public String getDetectedDisease() { return detectedDisease; }
    public String getDiseaseDescription() { return diseaseDescription; }
    public String getPatientId() { return patientId; }
    public String getReferenceGeneName() { return referenceGeneName; }
    public int getEditDistance() { return editDistance; }

    public void setDetectedDisease(String detectedDisease) { this.detectedDisease = detectedDisease; }
    public void setDiseaseDescription(String diseaseDescription) { this.diseaseDescription = diseaseDescription; }
    public void setEditDistance(int editDistance) { this.editDistance = editDistance; }
    public void setHealthy(boolean healthy) { isHealthy = healthy; }
}

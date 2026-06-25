package genediff.disease;

import genediff.model.DiffResult;


public class DiseaseDetector {

    
    public void annotate(DiffResult result, String patientSequence) {
        if (result.isHealthy()) {
            result.setDetectedDisease("None");
            result.setDiseaseDescription("Patient sequence matches the reference sequence perfectly. No genetic anomalies detected.");
            return;
        }

        String referenceId = result.getReferenceGeneName();
        String detectedId = GeneticDiseaseDatabase.detectDisease(patientSequence, referenceId);

        if (detectedId != null) {
            GeneticDiseaseDatabase.DiseaseRecord disease =
                    GeneticDiseaseDatabase.getDisease(detectedId);

            result.setDetectedDisease(disease.getDiseaseName());
            result.setDiseaseDescription(buildDescription(disease));
            result.setHealthy(false);
        } else {
            result.setDetectedDisease("Unknown Mutation");
            result.setDiseaseDescription(buildUnknownDescription(result));
            result.setHealthy(false);
        }
    }

    private String buildDescription(GeneticDiseaseDatabase.DiseaseRecord disease) {
        return String.format(
                "<strong>Gene:</strong> %s &nbsp;|&nbsp; " +
                "<strong>Location:</strong> %s &nbsp;|&nbsp; " +
                "<strong>Mutation Type:</strong> %s<br><br>" +
                "<strong>Mechanism:</strong> %s<br><br>" +
                "<strong>Symptoms:</strong> %s<br>" +
                "<strong>Inheritance:</strong> %s &nbsp;|&nbsp; " +
                "<strong>Prevalence:</strong> %s",
                disease.getAffectedGene(),
                disease.getChromosome(),
                disease.getMutationType(),
                disease.getMedicalDescription(),
                disease.getSymptoms(),
                disease.getInheritance(),
                disease.getPrevalence()
        );
    }

    private String buildUnknownDescription(DiffResult result) {
        return String.format(
                "The patient's gene sequence contains <strong>%d anomalies</strong> " +
                "(%d mutations, %d missing bases, %d extra bases) " +
                "that do not match any known disease pattern in the database. " +
                "Sequence similarity: <strong>%.1f%%</strong>. " +
                "Manual clinical review is recommended.",
                result.getTotalAnomalies(),
                result.getMutationCount(),
                result.getMissingCount(),
                result.getExtraCount(),
                result.getSimilarityPercent()
        );
    }
}

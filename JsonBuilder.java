package genediff.util;

import genediff.model.DiffResult;
import genediff.model.GeneNode;
import genediff.model.GeneTree;

import java.util.List;


public class JsonBuilder {

   
    public static String diffResultToJson(DiffResult result, GeneTree refTree, GeneTree patTree) {
        StringBuilder sb = new StringBuilder();
        sb.append("{\n");

        sb.append("  \"patientId\": \"").append(escape(result.getPatientId())).append("\",\n");
        sb.append("  \"referenceGene\": \"").append(escape(result.getReferenceGeneName())).append("\",\n");

        sb.append("  \"isHealthy\": ").append(result.isHealthy()).append(",\n");

        sb.append("  \"detectedDisease\": \"").append(escape(result.getDetectedDisease())).append("\",\n");
        sb.append("  \"diseaseDescription\": \"").append(escape(result.getDiseaseDescription())).append("\",\n");

        sb.append("  \"stats\": {\n");
        sb.append("    \"totalBases\": ").append(result.getEntries().size()).append(",\n");
        sb.append("    \"matchCount\": ").append(result.getMatchCount()).append(",\n");
        sb.append("    \"mutationCount\": ").append(result.getMutationCount()).append(",\n");
        sb.append("    \"missingCount\": ").append(result.getMissingCount()).append(",\n");
        sb.append("    \"extraCount\": ").append(result.getExtraCount()).append(",\n");
        sb.append("    \"editDistance\": ").append(result.getEditDistance()).append(",\n");
        sb.append("    \"similarityPercent\": ").append(
                String.format("%.2f", result.getSimilarityPercent())).append("\n");
        sb.append("  },\n");

        sb.append("  \"diffEntries\": [\n");
        List<DiffResult.DiffEntry> entries = result.getEntries();
        for (int i = 0; i < entries.size(); i++) {
            DiffResult.DiffEntry e = entries.get(i);
            sb.append("    {\n");
            sb.append("      \"position\": ").append(e.getPosition()).append(",\n");
            sb.append("      \"codonId\": \"").append(escape(e.getCodonId())).append("\",\n");
            sb.append("      \"codonPosition\": ").append(e.getCodonPosition()).append(",\n");
            sb.append("      \"referenceBase\": \"").append(escape(e.getReferenceBase())).append("\",\n");
            sb.append("      \"patientBase\": \"").append(escape(e.getPatientBase())).append("\",\n");
            sb.append("      \"state\": \"").append(e.getState().name()).append("\"\n");
            sb.append("    }");
            if (i < entries.size() - 1) sb.append(",");
            sb.append("\n");
        }
        sb.append("  ],\n");

        sb.append("  \"referenceTree\": ");
        sb.append(treeToJson(refTree.getRoot()));
        sb.append(",\n");

        sb.append("  \"patientTree\": ");
        sb.append(treeToJson(patTree.getRoot()));
        sb.append("\n");

        sb.append("}");
        return sb.toString();
    }

    public static String treeToJson(GeneNode node) {
        StringBuilder sb = new StringBuilder();
        sb.append("{\n");
        sb.append("  \"id\": \"").append(escape(node.getId())).append("\",\n");
        sb.append("  \"value\": \"").append(escape(node.getValue())).append("\",\n");
        sb.append("  \"position\": ").append(node.getPosition()).append(",\n");
        sb.append("  \"type\": \"").append(node.getType().name()).append("\",\n");
        sb.append("  \"diffState\": \"").append(node.getDiffState().name()).append("\",\n");
        sb.append("  \"children\": [");

        List<GeneNode> children = node.getChildren();
        for (int i = 0; i < children.size(); i++) {
            sb.append(treeToJson(children.get(i)));
            if (i < children.size() - 1) sb.append(",");
        }
        sb.append("]\n}");
        return sb.toString();
    }

    public static String diseaseListToJson(
            java.util.Map<String, genediff.disease.GeneticDiseaseDatabase.DiseaseRecord> diseases) {
        StringBuilder sb = new StringBuilder("[");
        boolean first = true;
        for (var entry : diseases.entrySet()) {
            if (!first) sb.append(",");
            first = false;
            var d = entry.getValue();
            sb.append("{");
            sb.append("\"id\":\"").append(escape(d.getDiseaseId())).append("\",");
            sb.append("\"name\":\"").append(escape(d.getDiseaseName())).append("\",");
            sb.append("\"gene\":\"").append(escape(d.getAffectedGene())).append("\",");
            sb.append("\"mutationType\":\"").append(escape(d.getMutationType())).append("\",");
            sb.append("\"referenceSequence\":\"").append(escape(d.getReferenceSequence())).append("\",");
            sb.append("\"mutantSequence\":\"").append(escape(d.getMutantSequence())).append("\"");
            sb.append("}");
        }
        sb.append("]");
        return sb.toString();
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}

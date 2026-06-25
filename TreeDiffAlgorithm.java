package genediff.algorithm;

import genediff.model.DiffResult;
import genediff.model.GeneNode;
import genediff.model.GeneTree;

import java.util.List;


public class TreeDiffAlgorithm {

    
    public DiffResult diff(GeneTree referenceTree, GeneTree patientTree, String patientId) {
        DiffResult result = new DiffResult(patientId, referenceTree.getSequenceName());

        List<GeneNode> refBases = referenceTree.getAllBaseNodes();
        List<GeneNode> patBases = patientTree.getAllBaseNodes();

        int refLen = refBases.size();
        int patLen = patBases.size();
        int maxLen = Math.max(refLen, patLen);

        int editDistance = 0;

        for (int i = 0; i < maxLen; i++) {
            boolean refHas = (i < refLen);
            boolean patHas = (i < patLen);

            String refVal = refHas ? refBases.get(i).getValue() : "-";
            String patVal = patHas ? patBases.get(i).getValue() : "-";

            
            String codonId = refHas
                    ? refBases.get(i).getId().replaceAll("B\\d+$", "")
                    : (patHas ? patBases.get(i).getId().replaceAll("B\\d+$", "") : "?");
            int codonPos = i % 3;

            GeneNode.DiffState state;

            if (refHas && patHas) {
                if (refVal.equals(patVal)) {
                    state = GeneNode.DiffState.MATCH;
                    // Tag nodes
                    refBases.get(i).setDiffState(GeneNode.DiffState.MATCH);
                    patBases.get(i).setDiffState(GeneNode.DiffState.MATCH);
                } else {
                    state = GeneNode.DiffState.MUTATED;
                    refBases.get(i).setDiffState(GeneNode.DiffState.MUTATED);
                    patBases.get(i).setDiffState(GeneNode.DiffState.MUTATED);
                    editDistance++;
                }
            } else if (refHas) {
                state = GeneNode.DiffState.MISSING;
                refBases.get(i).setDiffState(GeneNode.DiffState.MISSING);
                editDistance++;
            } else {
                state = GeneNode.DiffState.EXTRA;
                patBases.get(i).setDiffState(GeneNode.DiffState.EXTRA);
                editDistance++;
            }

            DiffResult.DiffEntry entry = new DiffResult.DiffEntry(
                    i, refVal, patVal, state, codonId, codonPos
            );
            result.addEntry(entry);
        }

        result.setEditDistance(editDistance);
        result.computeVerdict();
        return result;
    }

    
    public int countAffectedCodons(DiffResult result) {
        java.util.Set<String> affectedCodons = new java.util.HashSet<>();
        for (DiffResult.DiffEntry entry : result.getEntries()) {
            if (entry.isAnomalous()) {
                affectedCodons.add(entry.getCodonId());
            }
        }
        return affectedCodons.size();
    }
}

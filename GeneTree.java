package genediff.model;

import java.util.ArrayList;
import java.util.List;


public class GeneTree {

    private GeneNode root;
    private String sequenceName;
    private String rawSequence;
    private int totalBases;

    public GeneTree(String sequenceName, String rawSequence) {
        this.sequenceName = sequenceName;
        this.rawSequence = rawSequence.toUpperCase().trim();
        this.totalBases = this.rawSequence.length();
        buildTree();
    }

    
    private void buildTree() {
        root = new GeneNode("ROOT", sequenceName, 0, GeneNode.NodeType.ROOT);
        String seq = rawSequence;

        int codonIndex = 0;
        for (int i = 0; i < seq.length(); i += 3) {
            String codon = seq.substring(i, Math.min(i + 3, seq.length()));
            GeneNode codonNode = new GeneNode(
                    "C" + codonIndex,
                    codon,
                    i,
                    GeneNode.NodeType.CODON
            );

            for (int j = 0; j < codon.length(); j++) {
                char base = codon.charAt(j);
                GeneNode baseNode = new GeneNode(
                        "C" + codonIndex + "B" + j,
                        String.valueOf(base),
                        i + j,
                        GeneNode.NodeType.BASE
                );
                codonNode.addChild(baseNode);
            }

            root.addChild(codonNode);
            codonIndex++;
        }
    }

   
    public List<GeneNode> getAllBaseNodes() {
        List<GeneNode> bases = new ArrayList<>();
        collectBases(root, bases);
        return bases;
    }

    private void collectBases(GeneNode node, List<GeneNode> bases) {
        if (node.getType() == GeneNode.NodeType.BASE) {
            bases.add(node);
            return;
        }
        for (GeneNode child : node.getChildren()) {
            collectBases(child, bases);
        }
    }

    
    public List<GeneNode> getAllCodonNodes() {
        List<GeneNode> codons = new ArrayList<>();
        for (GeneNode child : root.getChildren()) {
            if (child.getType() == GeneNode.NodeType.CODON) {
                codons.add(child);
            }
        }
        return codons;
    }


    public GeneNode getRoot() { return root; }
    public String getSequenceName() { return sequenceName; }
    public String getRawSequence() { return rawSequence; }
    public int getTotalBases() { return totalBases; }

    @Override
    public String toString() {
        return String.format("GeneTree[name=%s, length=%d bases, codons=%d]",
                sequenceName, totalBases, root.getChildren().size());
    }
}

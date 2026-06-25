package genediff.model;

import java.util.ArrayList;
import java.util.List;


public class GeneNode {

    public enum NodeType {
        ROOT,       
        CODON,      
        BASE        
    }

    private String id;          
    private String value;       
    private int position;       
    private NodeType type;
    private List<GeneNode> children;
    private GeneNode parent;

    
    private DiffState diffState;

    public enum DiffState {
        MATCH,      
        MISSING,    
        EXTRA,      
        MUTATED     
    }

    public GeneNode(String id, String value, int position, NodeType type) {
        this.id = id;
        this.value = value;
        this.position = position;
        this.type = type;
        this.children = new ArrayList<>();
        this.diffState = DiffState.MATCH;
    }

    public void addChild(GeneNode child) {
        child.parent = this;
        this.children.add(child);
    }

    
    public String getId() { 
        return id; }
    public String getValue() {
         return value; }
    public int getPosition() { 
        return position; }
    public NodeType getType() { 
        return type; }
    public List<GeneNode> getChildren() { 
        return children; }
    public GeneNode getParent() { 
        return parent; }
    public DiffState getDiffState() { 
        return diffState; }

    public void setDiffState(DiffState diffState) { 
        this.diffState = diffState; }
    public void setValue(String value) { this.value = value; }

    public boolean isLeaf() { return children.isEmpty(); }

    @Override
    public String toString() {
        return String.format("GeneNode[id=%s, value=%s, pos=%d, type=%s, diff=%s]",
                id, value, position, type, diffState);
    }
}

package genediff.server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import genediff.algorithm.TreeDiffAlgorithm;
import genediff.disease.DiseaseDetector;
import genediff.disease.GeneticDiseaseDatabase;
import genediff.model.DiffResult;
import genediff.model.GeneTree;
import genediff.util.JsonBuilder;

import java.io.*;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;


public class AnalyzeHandler implements HttpHandler {

    private final TreeDiffAlgorithm diffAlgorithm = new TreeDiffAlgorithm();
    private final DiseaseDetector   diseaseDetector = new DiseaseDetector();

    @Override
    public void handle(HttpExchange exchange) throws IOException {

        exchange.getResponseHeaders().add("Access-Control-Allow-Origin",  "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
        exchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(200, -1);
            return;
        }

        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        try {
            String body = readBody(exchange);

            Map<String, String> params = parseFormBody(body);

            String patientId       = params.getOrDefault("patientId", "PATIENT-001");
            String patientSequence = params.getOrDefault("patientSequence", "");
            String diseaseId       = params.getOrDefault("diseaseId", "");

            // Validate
            if (patientSequence.trim().isEmpty()) {
                sendJson(exchange, 400, "{\"error\":\"Patient sequence is required\"}");
                return;
            }

            patientSequence = sanitize(patientSequence);
            if (patientSequence.isEmpty()) {
                sendJson(exchange, 400, "{\"error\":\"Sequence must contain only A, T, G, C\"}");
                return;
            }

            GeneticDiseaseDatabase.DiseaseRecord disease =
                    GeneticDiseaseDatabase.getDisease(diseaseId);

            if (disease == null) {
                sendJson(exchange, 400, "{\"error\":\"Unknown disease ID: " + diseaseId + "\"}");
                return;
            }

            String referenceSequence = disease.getReferenceSequence();

            GeneTree referenceTree = new GeneTree(diseaseId, referenceSequence);
            GeneTree patientTree   = new GeneTree(patientId, patientSequence);

            DiffResult result = diffAlgorithm.diff(referenceTree, patientTree, patientId);

            diseaseDetector.annotate(result, patientSequence);

            String json = JsonBuilder.diffResultToJson(result, referenceTree, patientTree);
            sendJson(exchange, 200, json);

        } catch (Exception e) {
            e.printStackTrace();
            sendJson(exchange, 500, "{\"error\":\"Server error: " + escape(e.getMessage()) + "\"}");
        }
    }


    private String readBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody();
             ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
            byte[] chunk = new byte[1024];
            int bytesRead;
            while ((bytesRead = is.read(chunk)) != -1) {
                buffer.write(chunk, 0, bytesRead);
            }
            return buffer.toString(StandardCharsets.UTF_8.name());
        }
    }

    
    private Map<String, String> parseFormBody(String body) throws UnsupportedEncodingException {
        Map<String, String> map = new HashMap<>();
        if (body == null || body.isEmpty()) return map;
        for (String pair : body.split("&")) {
            String[] parts = pair.split("=", 2);
            if (parts.length == 2) {
                String key   = URLDecoder.decode(parts[0], "UTF-8");
                String value = URLDecoder.decode(parts[1], "UTF-8");
                map.put(key, value);
            }
        }
        return map;
    }

    private String sanitize(String seq) {
        return seq.toUpperCase().replaceAll("[^ATGC]", "");
    }

    private void sendJson(HttpExchange exchange, int statusCode, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private String escape(String s) {
        if (s == null) return "unknown";
        return s.replace("\"", "'").replace("\n", " ");
    }
}
